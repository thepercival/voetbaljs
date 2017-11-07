/**
 * Created by coen on 22-3-17.
 */

import { Competitionseason } from '../competitionseason';
import { Round } from '../round';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { RoundConfigRepository } from '../round/config/repository';
import { QualifyService } from '../qualifyrule/service';
import { RoundScoreConfigRepository } from '../round/scoreconfig/repository';

export interface IRoundStructure {
    nrofpoules: number,
    nrofwinners: number
}

export class StructureService {

    private rangeNrOfCompetitors = null;

    private static readonly DEFAULTS: IRoundStructure[] = [
        null, null,
        { nrofpoules: 1, nrofwinners: 1 }, // 2
        { nrofpoules: 1, nrofwinners: 1 },
        { nrofpoules: 1, nrofwinners: 1 },
        { nrofpoules: 1, nrofwinners: 2 },
        { nrofpoules: 2, nrofwinners: 2 }, // 6
        { nrofpoules: 1, nrofwinners: 1 },
        { nrofpoules: 2, nrofwinners: 2 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 2, nrofwinners: 2 }, // 10
        { nrofpoules: 2, nrofwinners: 2 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 3, nrofwinners: 4 },
        { nrofpoules: 4, nrofwinners: 4 },
        { nrofpoules: 4, nrofwinners: 4 },
        { nrofpoules: 4, nrofwinners: 8 },
        { nrofpoules: 4, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 5, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 7, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 6, nrofwinners: 8 },
        { nrofpoules: 7, nrofwinners: 8 },
        { nrofpoules: 8, nrofwinners: 16 }
    ];

    constructor(
        private competitionseason: Competitionseason,
        private round : Round,
        private configRepos: RoundConfigRepository,
        private scoreConfigRepos: RoundScoreConfigRepository,
        rangeNrOfCompetitors
    )
    {
        this.rangeNrOfCompetitors = rangeNrOfCompetitors;
    }

    getCompetitionseason(): Competitionseason {
        return this.competitionseason;
    }

    getFirstRound(): Round {
        return this.round;
    }

    getRoundById( id: number ) {
        return this.getRounds().find( roundIt => id == roundIt.getId() );
    };

    getRounds( round: Round = this.getFirstRound(), rounds: Round[] = [] ): Round[] {
        if( round == null ) {
            return rounds;
        }
        rounds.push( round );
        rounds = this.getRounds( round.getChildRound( Round.WINNERS ), rounds );
        return this.getRounds( round.getChildRound( Round.LOSERS ), rounds );
    }

    // getPoulePlaces(): PoulePlace[]
    // {
    //     let pouleplaces = [];
    //     this.rounds.forEach( function( round ){
    //         round.getPoules().forEach( function( poule ){
    //             poule.getPlaces().forEach( function( pouleplace ){
    //                 pouleplaces.push(pouleplace);
    //             });
    //         });
    //     });
    //     return pouleplaces;
    // }

    // getGames(): Game[]
    // {
    //     let games = [];
    //     this.rounds.forEach( function( round ) {
    //         round.getGames().forEach(function (game) {
    //             games.push(game);
    //         });
    //     });
    //     return games;
    // }

    private roundAndParentsNeedsRanking( round: Round ) {

        if( round.needsRanking() ) {
            if( round.getParentRound() != null ) {
                return this.roundAndParentsNeedsRanking( round.getParentRound() );
            }
            return true;
        }
        return false;
    }

    private getNrOfRoundsToGo( round: Round, nrOfRoundsToGo = 0 ) {
        const childRound = round.getChildRound( round.getWinnersOrLosers() );
        if( childRound == null ) {
            return nrOfRoundsToGo;
        }
        nrOfRoundsToGo++;
        return this.getNrOfRoundsToGo( childRound, nrOfRoundsToGo );
    }

    getRoundName( round: Round ) {
        if( this.roundAndParentsNeedsRanking( round ) ) {
            return ( round.getNumber() ) + '<sup>' + ( round.getNumber() == 1 ? 'st' : 'd' ) + "e</sup> ronde";
        }

        const nrOfRoundsToGo = this.getNrOfRoundsToGo( round );
        if (nrOfRoundsToGo == 5) {
            return "<span style='font-size: 80%'><sup>1</sup>&frasl;<sub>16</sub></span> finale";
        }
        else if (nrOfRoundsToGo == 4) {
            return "&frac18; finale";
        }
        else if (nrOfRoundsToGo == 3) {
            return "&frac14; finale";
        }
        else if (nrOfRoundsToGo == 2) {
            return "&frac12; finale";
        }
        else if (nrOfRoundsToGo == 1) {
            return "finale";
        }
        else if (nrOfRoundsToGo == 0) {
            return this.getWinnersLosersDescription( round.getWinnersOrLosers() );
        }
        return "?";
    }

    getWinnersLosersDescription( winnersOrLosers: number ): string {
        return winnersOrLosers === Round.WINNERS ? 'winnaar' : ( winnersOrLosers === Round.LOSERS ? 'verliezer' : '' );
    }

    getPouleName( poule: Poule, withPrefix: boolean ) {
        const round = poule.getRound();
        let previousNrOfPoules = this.getNrOfPreviousPoules( round.getNumber(), round, poule );
        let pouleName = '';
        if ( withPrefix == true )
            pouleName = round.getType() == Round.TYPE_KNOCKOUT ? 'wed. ' : 'poule ';

        const secondLetter = previousNrOfPoules % 26;
        if ( previousNrOfPoules >= 26 ) {
            const firstLetter = ( previousNrOfPoules - secondLetter ) / 26;
            pouleName += ( String.fromCharCode( "A".charCodeAt(0) + ( firstLetter - 1 ) ) );
        }
        pouleName += ( String.fromCharCode( "A".charCodeAt(0) + secondLetter ) );
        return pouleName;
    }

    private getNrOfPreviousPoules( roundNumber:number, round: Round, poule ): number {
        let nrOfPoules = poule.getNumber() - 1;
        nrOfPoules += this.getNrOfPoulesParentRounds( roundNumber );
        nrOfPoules += this.getNrOfPoulesSiblingRounds( roundNumber, round );
        return nrOfPoules;
    }

    private getNrOfPoulesParentRounds( roundNumber:number, round: Round = this.getFirstRound() ): number {
        if ( round.getNumber() >= roundNumber ) {
            return 0;
        }
        let nrOfPoules = round.getPoules().length;
        round.getChildRounds().forEach( ( childRound ) => {
            nrOfPoules += this.getNrOfPoulesParentRounds( roundNumber, childRound );
        });
        return nrOfPoules;
    }

    private getNrOfPoulesSiblingRounds( roundNumber:number, round: Round ): number {
        let nrOfPoules = 0;

        let parentRound = round.getParentRound();
        if( parentRound !== null ) {
            nrOfPoules += this.getNrOfPoulesSiblingRounds( roundNumber, parentRound/* round */ );
        }

        if( round.getWinnersOrLosers() === Round.LOSERS ) {
            const winningSibling = round.getOpposing();
            if (winningSibling != null ) {
                nrOfPoules += this.getNrOfPoulesForChildRounds( winningSibling, roundNumber );
            }
        }
        return nrOfPoules;
    }

    private getNrOfPoulesForChildRounds( round: Round, roundNumber:number ): number {
        let nrOfChildPoules = 0;
        if ( round.getNumber() > roundNumber ) {
            return nrOfChildPoules;
        }
        else if ( round.getNumber() === roundNumber ) {
            return round.getPoules().length;
        }

        round.getChildRounds().forEach( ( childRound ) => {
            nrOfChildPoules += this.getNrOfPoulesForChildRounds( childRound, roundNumber );
        });
        return nrOfChildPoules;
    }

    getPoulePlaceName( pouleplace: PoulePlace, teamName = false ) {
        if( teamName === true && pouleplace.getTeam() != null ) {
            return pouleplace.getTeam().getName();
        }
        const poule = pouleplace.getPoule();
        const round = poule.getRound();

        // ///////////////////////
        let pouleplaceName = this.getPouleName( poule, false );
        return pouleplaceName + pouleplace.getNumber();
        // ///////////////////////////////////
        // let previousNrOfPoules = 0;
        // this.rounds.some(function(roundIt) {
        //     previousNrOfPoules += round !== roundIt ? roundIt.getPoules().length : 0;
        //     return round === roundIt;
        // });
        // let pouleName = "";
        // if ( withPrefix == true )
        //     pouleName = round.getType() == Round.TYPE_KNOCKOUT ? 'wed.' : 'poule';
        // return pouleName + ' ' + ( String.fromCharCode( "A".charCodeAt(0) + previousNrOfPoules + ( poule.getNumber() - 1 ) ) );
    }

    addRound( parentRound: Round, winnersOrLosers: number, nrOfPlaces: number ): Round {
        let round = new Round( this.competitionseason, parentRound, winnersOrLosers );
        if( nrOfPlaces <= 0 ) {
            return;
        }

        const roundStructure = this.getDefaultRoundStructure( round.getNumber(), nrOfPlaces );
        if( roundStructure == null ) {
            return;
        }
        const nrOfPlacesPerPoule = this.getNrOfPlacesPerPoule( nrOfPlaces, roundStructure.nrofpoules );
        const nrOfPlacesNextRound = ( winnersOrLosers === Round.WINNERS ) ? roundStructure.nrofwinners : ( nrOfPlaces - roundStructure.nrofwinners );
        const nrOfOpposingPlacesNextRound = ( Round.getOpposing( winnersOrLosers ) === Round.WINNERS ) ? roundStructure.nrofwinners : nrOfPlaces - roundStructure.nrofwinners;

        while( nrOfPlaces > 0 ){
            const nrOfPlacesToAdd = nrOfPlaces < nrOfPlacesPerPoule ? nrOfPlaces : nrOfPlacesPerPoule;
            const poule = new Poule( round );
            for( let i = 0 ; i < nrOfPlacesToAdd ; i++) {
                new PoulePlace( poule );
            }
            nrOfPlaces -= nrOfPlacesPerPoule;
        }

        this.configRepos.createObjectFromParent( round );
        round.setScoreConfig( this.scoreConfigRepos.createObjectFromParent( round ) );

        const qualifyService = new QualifyService( round );
        // qualifyService.removeObjectsForParentRound();
        qualifyService.createObjectsForParentRound();

        console.log(roundStructure);
        if ( roundStructure.nrofwinners === 0 ) {
            return round;
        }
        console.log('addRound',nrOfPlacesNextRound);
        this.addRound( round, winnersOrLosers, nrOfPlacesNextRound );
        const hasParentRoundOpposingChild = ( parentRound.getChildRound( Round.getOpposing( winnersOrLosers ) )!= null );
        if( hasParentRoundOpposingChild === true ) {
            this.addRound( round, Round.getOpposing( winnersOrLosers ), nrOfOpposingPlacesNextRound );
        }

        return round;
    }

    removeRound( parentRound: Round, winnersOrLosers: number ) {
        const childRound = parentRound.getChildRound( winnersOrLosers );
        const index = parentRound.getChildRounds().indexOf( childRound );
        if ( index > -1) {
            parentRound.getChildRounds().splice(index, 1);
        }
        console.log('removeround',index);

    }

    addPoule( round: Round, fillPouleToMinimum: boolean = true ): void {
        const poules = round.getPoules();
        const places = round.getPoulePlaces();
        const nrOfPlacesNotEvenOld = places.length % poules.length;
        const placesPerPouleOld = ( places.length - nrOfPlacesNotEvenOld ) / poules.length;
        const newPoule = new Poule( round );
        const nrOfPlacesNotEven = places.length % poules.length;
        let placesToAddToNewPoule = ( places.length - nrOfPlacesNotEven ) / poules.length;

        if ( placesPerPouleOld === 2 && nrOfPlacesNotEvenOld < 2 ) {
            placesToAddToNewPoule = nrOfPlacesNotEvenOld;
        }

        const orderedByPlace = true;
        const poulePlacesOrderedByPlace = round.getPoulePlaces( orderedByPlace );
        while ( placesToAddToNewPoule > 0 ) {

            poulePlacesOrderedByPlace.forEach( function ( poulePlaceIt ) {
                if ( poulePlaceIt.getNumber() === 1 || placesToAddToNewPoule === 0 ) {
                    return;
                }
                round.movePoulePlace( poulePlaceIt, newPoule );
                placesToAddToNewPoule--;
            });
        }

        // there could be a place left in the last placenumber which does not start at the first poule
        const poulePlacesPerNumberParentRound = round.getPoulePlacesPerNumber( null );
        const lastPoulePlaces = poulePlacesPerNumberParentRound.pop();
        let pouleIt = round.getPoules()[0];
        lastPoulePlaces.forEach( function ( lastPoulePlaceIt ) {
            if ( lastPoulePlaceIt.getPoule() !== pouleIt ) {
                round.movePoulePlace( lastPoulePlaceIt, pouleIt );
            }
            pouleIt = pouleIt.next();
        });

        if ( fillPouleToMinimum === true ) {
            while ( newPoule.getPlaces().length < 2 ) {
                const pouleTmp = new PoulePlace( newPoule );
            }
        }

        round.getChildRounds().forEach( function ( childRound ) {
            const qualifyService = new QualifyService( childRound );
            qualifyService.removeObjectsForParentRound();
            qualifyService.createObjectsForParentRound();
        });
    }

    removePoule( round ): boolean {
        const poules = round.getPoules();
        const roundPlaces = round.getPoulePlaces();
        if ( poules.length === 1 ) {
            throw new Error('er moet minimaal 1 poule zijn');
        }
        const lastPoule = poules[poules.length - 1];
        const places = lastPoule.getPlaces();
        while ( places.length > 0 ) {
            const place = places[places.length - 1];
            const nrOfPlacesNotEven = ( ( roundPlaces.length - lastPoule.getPlaces().length ) % ( poules.length - 1 ) ) + 1;
            const poule = poules.find( pouleIt => nrOfPlacesNotEven === pouleIt.getNumber() );
            if ( !round.movePoulePlace( place, poule ) ) {
                throw new Error('de pouleplek kan niet verplaatst worden');
            }
        }
        try {
            this.removePouleHelper( lastPoule );
        } catch (e) {
            throw new Error('er moet minimaal 1 poule zijn');
        }

        round.getChildRounds().forEach( function ( childRound ) {
            const qualifyService = new QualifyService( childRound );
            qualifyService.removeObjectsForParentRound();
            qualifyService.createObjectsForParentRound();
        });
        return true;
    }

    private removePouleHelper( poule: Poule ): boolean {
        if( poule.getGames().length > poule.getGamesNotStarted().length ){
            throw new Error('de poule kan niet verwijderd worden, omdat er al gestarte wedstrijden aanwezig aan');
        }

        var poules = poule.getRound().getPoules();
        var index = poules.indexOf(poule);
        if (index > -1) {
            poules.splice(index, 1);
            return true;
        }
        return false;
    }

    removePoulePlace( round ): boolean {
        const places = round.getPoulePlaces();
        const poules = round.getPoules();
        if ( poules.length === 0 ) {
            throw new Error('er moet minimaal 1 poule aanwezig zijn');
        }

        const nrOfPlacesNotEven = places.length % poules.length;
        let pouleToRemoveFrom = poules[poules.length - 1];
        if ( nrOfPlacesNotEven > 0 ) {
            pouleToRemoveFrom = poules.find( pouleIt => nrOfPlacesNotEven === pouleIt.getNumber() );
        }

        const placesTmp = pouleToRemoveFrom.getPlaces();
        const minNrOfCompetitors = round.getNumber() === 1 ? this.rangeNrOfCompetitors.min : this.rangeNrOfCompetitors.min - 1;
        if ( minNrOfCompetitors && placesTmp.length === minNrOfCompetitors ) {
            throw new Error('er moeten minimaal ' + minNrOfCompetitors + ' deelnemers per poule zijn');
        }
        return pouleToRemoveFrom.removePlace( placesTmp[placesTmp.length - 1]);
    }

    addPoulePlace( round ): boolean {
        const poules = round.getPoules();
        if ( poules.length === 0 ) {
            throw new Error('er moet minimaal 1 poule aanwezig zijn' );
        }
        const places = round.getPoulePlaces();
        if ( places.length > this.rangeNrOfCompetitors.max ) {
            throw new Error('er mogen maximaal ' + this.rangeNrOfCompetitors.max + ' deelnemers meedoen' );
        }

        const nrOfPlacesNotEven = places.length % poules.length;

        let pouleToAddTo = poules[0];
        if ( nrOfPlacesNotEven > 0 ) {
            pouleToAddTo = poules.find( pouleIt => ( nrOfPlacesNotEven + 1 ) === pouleIt.getNumber() );
        }

        const poulePlace = new PoulePlace( pouleToAddTo );

        round.getChildRounds().forEach( function( childRound ) {
            const qualifyService = new QualifyService( childRound );
            qualifyService.removeObjectsForParentRound();
            qualifyService.createObjectsForParentRound();
        });
        return true;
    }

    changeNrOfPlacesChildRound( nrOfChildPlacesNew: number, parentRound: Round, winnersOrLosers: number ) {
        let childRound = parentRound.getChildRound( winnersOrLosers );
        if ( childRound == null && nrOfChildPlacesNew > 0 ) {
            childRound = this.addRound( parentRound, winnersOrLosers, nrOfChildPlacesNew );
            return;
            // nrOfChildPlacesNew = childRound.getPoulePlaces().length;
        }
        if ( childRound == null ) {
            return;
        }

        const qualifyService = new QualifyService( childRound );
        qualifyService.removeObjectsForParentRound();

        if ( nrOfChildPlacesNew === 0 ) {
            this.removeRound( parentRound, winnersOrLosers );
            return;
        }

        // check wat the last number was
        const nrOfPlacesDifference = nrOfChildPlacesNew - childRound.getPoulePlaces().length;
        if ( nrOfPlacesDifference < 0 ) {
            for ( let nI = 0 ; nI > nrOfPlacesDifference ; nI-- ) {
                if ( this.removePoulePlace( childRound ) !== true ) {
                    return;
                }
            }
        } else {
            for ( let nI = 0 ; nI < nrOfPlacesDifference ; nI++ ) {
                if ( this.addPoulePlace( childRound ) !== true ) {
                    return;
                }
            }
        }
        qualifyService.createObjectsForParentRound();

        const nrOfChildPlaces = parentRound.getNrOfPlacesChildRound( winnersOrLosers );
        const opposing = Round.getOpposing( winnersOrLosers );
        const nrOfPlacesLeftForOpposing = parentRound.getPoulePlaces().length - nrOfChildPlaces;
        const nrOfChildPlacesOpposing = parentRound.getNrOfPlacesChildRound( opposing );
        if ( nrOfPlacesLeftForOpposing < nrOfChildPlacesOpposing ) {
            this.changeNrOfPlacesChildRound( nrOfPlacesLeftForOpposing, parentRound, opposing );
        }
        else if ( nrOfPlacesLeftForOpposing === nrOfChildPlacesOpposing ) {
            qualifyService.oneMultipleToSingle();
        }
    }

    /**
     * determine number of pouleplaces on left side
     * @param round
     */
    getRankedPlace( round: Round, rankedPlace:number = 1 ) {
        const parentRound = round.getParentRound();
        if ( parentRound === null ) {
            return rankedPlace;
        }
        if ( round.getWinnersOrLosers() === Round.LOSERS ) {
            rankedPlace += parentRound.getPoulePlaces().length - round.getPoulePlaces().length;
        }
        return this.getRankedPlace( parentRound, rankedPlace );
    }

    getDefaultRoundStructure( roundNr, nrOfTeams ): IRoundStructure {
        if ( nrOfTeams === 0 ) {
            throw new Error('het aantal teams moet minimaal ' + ( this.rangeNrOfCompetitors.min - 1 ) + ' zijn en mag maximaal ' + this.rangeNrOfCompetitors.max + ' zijn');
        }

        if( roundNr > 1 ) {
            if ( nrOfTeams === 1 ) {
                return { nrofpoules: 1, nrofwinners: 0 };
            }
            else if ( ( nrOfTeams % 2 ) !== 0 ) {
                throw new Error('het aantal(' + nrOfTeams + ') moet een veelvoud van 2 zijn na de eerste ronde');
            }
            return { nrofpoules: nrOfTeams / 2, nrofwinners: nrOfTeams / 2 };
        }
    
        const roundStructure = StructureService.DEFAULTS[nrOfTeams]
        if( roundStructure == null ) {
            throw new Error('het aantal teams moet minimaal ' + ( this.rangeNrOfCompetitors.min - 1 ) + ' zijn en mag maximaal ' + this.rangeNrOfCompetitors.max + ' zijn');
        }
        return roundStructure;
    }

    getNrOfPlacesPerPoule( nrOfPlaces, nrOfPoules ) {
        const nrOfPlaceLeft = ( nrOfPlaces % nrOfPoules );
        return ( nrOfPlaces + nrOfPlaceLeft ) / nrOfPoules;
    }



    // addQualifier( fromRound: Round, winnersOrLosers: number ) {
    //     let toRound = fromRound.getChildRound( winnersOrLosers );
    //     console.log(toRound);
    //     if (toRound == null) {
    //         toRound = this.addRound( fromRound, winnersOrLosers );
    //     }
    //     // determine if new qualifiationrule is needed
    //
    //
    //     const fromQualifyRules = toRound.getFromQualifyRules();
    //     const lastFromQualifyRule = fromQualifyRules[fromQualifyRules.length - 1];
    //     if( lastFromQualifyRule != null && lastFromQualifyRule.isMultiple() ) {
    //         if( ( lastFromQualifyRule.getFromPoulePlaces().length - 1 ) < lastFromQualifyRule.getToPoulePlaces().length ) { // edit lastFromQualifyRule
    //
    //         }
    //         if( ( lastFromQualifyRule.getFromPoulePlaces().length - 1 ) === lastFromQualifyRule.getToPoulePlaces().length ) {  // remove and add multiple
    //
    //         }
    //     }
    //
    //     const fromPoules = fromRound.getPoules();
    //     if ( fromPoules.length > 1 ) { // new multiple
    //
    //     }
    //     else { // new single
    //         const fromPoule = fromPoules[0];
    //         const fromPlace = fromPoule.getPlaces().find( function( pouleplaceIt ) {
    //             return this == pouleplaceIt.getNumber()
    //         }, toRound.getFromQualifyRules().length + 1 );
    //         if ( fromPlace == null ) { return; }
    //
    //         const toPoules = toRound.getPoules();
    //         const toPoule = toPoules[0];
    //         let toPlace = null;
    //         if( lastFromQualifyRule == null ) { // just get first
    //             toPlace = toPoule.getPlaces()[0];
    //         }
    //         else { // determine which toPoule and toPlace
    //
    //         }
    //         if ( toPlace == null ) { return; }
    //
    //         let qualifyRule = new QualifyRule( fromRound, toRound );
    //         qualifyRule.addFromPoulePlace( fromPlace );
    //         qualifyRule.addToPoulePlace( toPlace );
    //     }
    // }
}

