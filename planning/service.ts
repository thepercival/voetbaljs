
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
        if( startDateTime == null && round.getConfig().getNrOfMinutesPerGame() > 0 ) {
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
        if ( round.getConfig().getNrOfMinutesPerGame() === 0) {
            return null;
        }
        const parentRound = round.getParentRound();
        if( parentRound == null ) {
            return this.startDateTime;
        }

        return this.calculateEndDateTime( parentRound );
    }

    protected calculateEndDateTime( round: Round ) {
        if ( round.getConfig().getNrOfMinutesPerGame() === 0) {
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
            let startGameNrReturnGames = poule.getPlaces().length - 1;
            const schedGames = this.generateRRSchedule( poule.getPlaces().slice() );

            // als aantal onderlinge duels > 1 dan nog een keer herhalen
            // maar bij oneven aantal de pouleplaces ophogen!!!!

            for( let roundNumber = 0 ; roundNumber < schedGames.length ; roundNumber++ ) {
                const schedRoundGames = schedGames[roundNumber];

                let subNumber = 1;
                schedRoundGames.forEach( function( schedGame ) {
                    if (schedGame[0] === null || schedGame[1] === null) {
                        return;
                    }
                    const homePoulePlace = schedGame[0];
                    const awayPoulePlace = schedGame[1];
                    new Game( poule, homePoulePlace, awayPoulePlace, roundNumber + 1, subNumber++ );
                });
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
        games.forEach( function( gamesPerRoundNumber ) {
            gamesPerRoundNumber.forEach( ( game ) => {

                game.setField( currentField );
                game.setStartDateTime( dateTime );
                game.setReferee( currentReferee );

                let addTime = false;

                currentField = fields[++fieldNr];
                if ( currentField == null ) {
                    fieldNr = 0;
                    currentField = fields[fieldNr];
                    addTime = true;
                }
                currentReferee = referees[++refereeNr];
                if ( referees.length > 0 && currentReferee == null ) {
                    refereeNr = 0;
                    currentReferee = referees[refereeNr];
                    addTime = true;
                }

                if( ++nrOfGamesSimultaneously === maxNrOfGamesSimultaneously ) {
                    addTime = true;
                    nrOfGamesSimultaneously = 0;
                }

                if ( roundConfig.getNrOfMinutesPerGame() > 0 && addTime ) {
                    const nrOfMinutes = roundConfig.getMaximalNrOfMinutesPerGame( true );
                    dateTime = new Date( dateTime.getTime() );
                    dateTime.setMinutes(dateTime.getMinutes() + nrOfMinutes);
                    if ( nextRoundStartDateTime == null || dateTime > nextRoundStartDateTime ) {
                        nextRoundStartDateTime = dateTime;
                        nrOfGamesSimultaneously = 0;
                    }
                }
            });
        }, this );
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
            return [];
    //     $numPlayers = count($players);
    //
    //     // add a placeholder if the count is odd
    //     if($numPlayers%2) {
    //         $players[] = null;
    //         $numPlayers++;
    //     }
    //
    //     // calculate the number of sets and matches per set
    //     $numSets = $numPlayers-1;
    //     $numMatches = $numPlayers/2;
    //
    //     $matchups = array();
    //
    //     // generate each set
    //     for($j = 0; $j < $numSets; $j++) {
    //         // break the list in half
    //         $halves = array_chunk($players, $numMatches);
    //         // reverse the order of one half
    //         $halves[1] = array_reverse($halves[1]);
    //         // generate each match in the set
    //         for($i = 0; $i < $numMatches; $i++) {
    //             // match each pair of elements
    //             $matchups[$j][$i][0] = $halves[0][$i];
    //             $matchups[$j][$i][1] = $halves[1][$i];
    //         }
    //         // remove the first player and store
    //         $first = array_shift($players);
    //         // move the second player to the end of the list
    //         $players[] = array_shift($players);
    //         // place the first item back in the first position
    //         array_unshift($players, $first);
    //     }
    //
    //     // shuffle the results if desired
    //     if($rand) {
    //         foreach($matchups as &$match) {
    //             shuffle($match);
    //         }
    //         shuffle($matchups);
    //     }
    //
    //     return $matchups;
    }
}
