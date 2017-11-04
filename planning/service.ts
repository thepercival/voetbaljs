
import {Round} from '../round';
import {Game} from '../game';
import {PoulePlace} from '../pouleplace';
import {Referee} from '../referee';

export class PlanningService
{
    private startDateTime: Date;

    constructor( startDateTime: Date = null ) {
        this.startDateTime = startDateTime;
    }

    create( round: Round, startDateTime: Date = null ) {
        if( startDateTime == null ) {
            startDateTime = this.calculateStartDateTime( round );
        }
        try{
            this.removeHelper( round );
            this.createHelper( round );
            const startNextRound = this.rescheduleHelper( round, startDateTime );

            round.getChildRounds().forEach( (childRound) => this.create( childRound, startNextRound ) );
        } catch ( e ) {
            console.error( e.message );
        }
    }

    reschedule( round: Round, startDateTime: Date = null ) {
        if( startDateTime == null && round.getConfig().getEnableTime() ) {
            startDateTime = this.calculateStartDateTime( round );
        }
        try{
            const startNextRound = this.rescheduleHelper( round, startDateTime );
            round.getChildRounds().forEach( (childRound) => this.reschedule( childRound, startNextRound ) );
        } catch ( e ) {
            console.error( e.message );
        }
    }

    protected calculateStartDateTime( round: Round ) {
        if ( round.getConfig().getEnableTime() === false ) {
            return null;
        }
        const parentRound = round.getParentRound();
        if( parentRound == null ) {
            return this.startDateTime;
        }

        return this.calculateEndDateTime( parentRound );
    }

    protected calculateEndDateTime( round: Round ) {
        if ( round.getConfig().getEnableTime() === false) {
            return null;
        }

        let endDateTime = null;
        round.getGames().forEach( function( game ) {
            if ( endDateTime == null || game.getStartDateTime() > endDateTime ) {
                endDateTime = game.getStartDateTime();
            }
        });

        if ( endDateTime == null) {
            return null;
        }

        let copiedEndDateTime = new Date( endDateTime.getTime() );
        const nrOfMinutes = round.getConfig().getMaximalNrOfMinutesPerGame( true );
        copiedEndDateTime.setMinutes(copiedEndDateTime.getMinutes() + nrOfMinutes);
        return copiedEndDateTime;
    }


    protected createHelper( round: Round ) {
        const roundConfig = round.getConfig();

        const poules = round.getPoules();
        for( let i = 0 ; i < poules.length ; i++ ) {
            const poule = poules[i];
            const schedGames = this.generateRRSchedule( poule.getPlaces().slice() );
            for( let headToHead = 1 ; headToHead <= roundConfig.getNrOfHeadtoheadMatches() ; headToHead++ ) {
                const headToHeadNumber = ( ( headToHead - 1 ) * schedGames.length );
                for (let roundNumber = 0; roundNumber < schedGames.length; roundNumber++) {
                    const schedRoundGames = schedGames[roundNumber];

                    let subNumber = 1;
                    schedRoundGames.forEach(function (schedGame) {
                        if (schedGame[0] === null || schedGame[1] === null) {
                            return;
                        }
                        const homePoulePlace = ( headToHead % 2 === 0 ) ? schedGame[1] : schedGame[0];
                        const awayPoulePlace = ( headToHead % 2 === 0 ) ? schedGame[0] : schedGame[1];
                        new Game(poule, homePoulePlace, awayPoulePlace, headToHeadNumber + roundNumber + 1, subNumber++);
                    });
                }
            }
        }
    }

    protected rescheduleHelper( round: Round, pStartDateTime: Date ): Date {
        const roundConfig = round.getConfig();

        let dateTime = ( pStartDateTime != null ) ? new Date( pStartDateTime.getTime() ) : null;
        const fields = round.getCompetitionseason().getFields(); // order by number

        const maxNrOfGamesSimultaneously = this.getMaxNrOfGamesSimultaneously( round );
        const tooMuchFieldsAvailable = fields.length > maxNrOfGamesSimultaneously;

        const referees = round.getCompetitionseason().getReferees();
        console.log('referees',referees);

        let nrOfGamesSimultaneously = 0;
        let fieldNr = 0;
        let currentField = fields[fieldNr];
        let refereeNr = 0;
        let currentReferee = referees[refereeNr];
        let nextRoundStartDateTime: Date = null;
        const games = this.getGamesByNumber( round );
        console.log("gamesbynumber",games);
        games.forEach(function (gamesPerRoundNumber) {
            gamesPerRoundNumber.forEach((game) => {

                game.setField(currentField);
                game.setStartDateTime(dateTime);
                game.setReferee(currentReferee);

                let addTime = false;

                currentField = fields[++fieldNr];
                if (currentField == null) {
                    fieldNr = 0;
                    currentField = fields[fieldNr];
                    addTime = true;
                }
                currentReferee = referees[++refereeNr];
                if (referees.length > 0 && currentReferee == null) {
                    refereeNr = 0;
                    currentReferee = referees[refereeNr];
                    addTime = true;
                }

                if (++nrOfGamesSimultaneously === maxNrOfGamesSimultaneously) {
                    addTime = true;
                    nrOfGamesSimultaneously = 0;
                }

                if (roundConfig.getEnableTime() && addTime) {
                    const nrOfMinutes = roundConfig.getMaximalNrOfMinutesPerGame(true);
                    dateTime = new Date(dateTime.getTime());
                    dateTime.setMinutes(dateTime.getMinutes() + nrOfMinutes);
                    if (nextRoundStartDateTime == null || dateTime > nextRoundStartDateTime) {
                        nextRoundStartDateTime = dateTime;
                        nrOfGamesSimultaneously = 0;
                    }
                }
            });
        }, this);
        return nextRoundStartDateTime;
    }

    protected getGamesByNumber( round: Round ): Game[][] {
        let games = [];
        round.getPoules().forEach( function( poule ) {
            let number = 1;
            poule.getGames().forEach( function( game ) {
                if ( games[number] == null ) {
                    games[number] = [];
                }
                games[number++].push(game);
            });
        });
        return games;
    }

    protected getMaxNrOfGamesSimultaneously( round ) {
        let nrOfGames = 0;
        round.getPoules().forEach( (poule) => {
            const nrOfRestingPlaces = poule.getPlaces().length % 2;
            nrOfGames += ( poule.getPlaces().length - nrOfRestingPlaces ) / 2;
        });
        return nrOfGames;
    }

    protected removeHelper( round: Round ) {
        round.getPoules().forEach( function( poule ) {
            poule.getGames().splice(0,poule.getGames().length);
        });
    }


    private generateRRSchedule( places: PoulePlace[], rand = false) {
        let nrOfPlaces = places.length;
        if ( nrOfPlaces == 0 ) {
            return [];
        }

        // add a placeholder if the count is odd
        if( (nrOfPlaces % 2) !== 0 ) {
            places.push( null );
            nrOfPlaces++;
        }

        // calculate the number of sets and matches per set
        const nrOfSets = nrOfPlaces - 1;
        const nrOfMatches = nrOfPlaces / 2;

        let matchups = [];

        // generate each set
        for( let j = 0; j < nrOfSets ; j++ ) {
            matchups[j] = [];
            // break the list in half
            let halves = this.chunk( places, 2 );
            // reverse the order of one half
            halves[1] = halves[1].reverse();
            // generate each match in the set
            for( let i = 0; i < nrOfMatches ; i++ ) {
                matchups[j][i] = [];
                // match each pair of elements
                matchups[j][i][0] = halves[0][i];
                matchups[j][i][1] = halves[1][i];
            }
            // remove the first player and store
            const first = places.shift();
            // move the second player to the end of the list
            places.push( places.shift() );
            // place the first item back in the first position
            places.unshift( first );
        }

        // shuffle the results if desired
        if(rand) {
            matchups.forEach( ( match ) => {
                this.shuffle(match);
            });
            this.shuffle(matchups);
        }

        return matchups;
    }

    private shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    private chunk( arr:PoulePlace[], pieces: number): any[][] {
        let chunkSize = Math.round( arr.length / pieces );
        let result = [];
        for ( let i = 0 ; i < arr.length; i += chunkSize) {
            if( result.length < pieces - 1)
                result.push( arr.slice( i, i + chunkSize).map(a=>a));
            else{
                result.push( arr.slice(i).map(a=>a));
                break;
            }
        }
        return result;
    }
}