/**
 * Created by coen on 22-3-17.
 */

import { Injectable } from '@angular/core';
import { Competitionseason } from '../competitionseason';
import { Round } from '../round';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Game } from '../game';
import { QualifyService } from '../qualifyrule/service';

export class StructureService {

    private rangeNrOfCompetitors = null;

    constructor(
        private competitionseason: Competitionseason,
        private round : Round,
        rangeNrOfCompetitors
    )
    {
        this.rangeNrOfCompetitors = rangeNrOfCompetitors;
    }

    getCompetitionseason(): Competitionseason
    {
        return this.competitionseason;
    }

    getFirstRound(): Round
    {
        return this.round;
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

    getRoundName( round: Round ) {
        return "ronde x";
        // let pouleRounds = 0;
        // this.rounds.some(function(roundIt) {
        //     const knockOut = ( roundIt.getType() == Round.TYPE_KNOCKOUT);
        //     pouleRounds += knockOut ? 0 : 1;
        //     return knockOut;
        // });
        //
        // if ( round.getNumber() > pouleRounds) {
        //     const nrOfRoundsFromWinning = this.rounds.length - ( round.getNumber() );
        //     if (nrOfRoundsFromWinning == 5) {
        //         return "<span style='font-size: 80%'><sup>1</sup>&frasl;<sub>16</sub></span> finale";
        //     }
        //     else if (nrOfRoundsFromWinning == 4) {
        //         return "&frac18; finale";
        //     }
        //     else if (nrOfRoundsFromWinning == 3) {
        //         return "&frac14; finale";
        //     }
        //     else if (nrOfRoundsFromWinning == 2) {
        //         return "&frac12; finale";
        //     }
        //     else if (nrOfRoundsFromWinning == 1) {
        //         return "finale";
        //     }
        //     else if (nrOfRoundsFromWinning == 0) {
        //         return "winnaar";
        //     }
        // }
        //
        // return ( round.getNumber() ) + '<sup>' + ( round.getNumber() == 1 ? 'st' : 'd' ) + "e</sup> ronde";
    }

    getPouleName( poule: Poule, withPrefix: boolean ) {
        const round = poule.getRound();
        let previousNrOfPoules = this.getNrOfPreviousPoules( round, poule );
        let pouleName = '';
        if ( withPrefix == true )
            pouleName = round.getType() == Round.TYPE_KNOCKOUT ? 'wed.' : 'poule';
        return pouleName + ' ' + ( String.fromCharCode( "A".charCodeAt(0) + previousNrOfPoules ) );
    }

    private getNrOfPreviousPoules( round: Round, poule: Poule = null ) {
        let nrOfPreviousPoules = poule != null ? ( poule.getNumber() - 1 ) : round.getPoules().length;
        if( round.getParentRound() != null ) {
            nrOfPreviousPoules += this.getNrOfPreviousPoules( round.getParentRound() );
        }
        return nrOfPreviousPoules;
    }

    getPoulePlaceName( pouleplace: PoulePlace ) {

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



    addRound( parentRound: Round, winnersOrLosers: number ): Round {
        let round = new Round( this.competitionseason, parentRound, winnersOrLosers );
        round.setNrofheadtoheadmatches(1)
        const poule = new Poule( round );
        const poulePlace = new PoulePlace( poule );
        return round;
    }

    removeRound( parentRound: Round, winnersOrLosers: number ) {
        const childRound = parentRound.getChildRound( winnersOrLosers );
        const index = parentRound.getChildRounds().indexOf( childRound );
        if ( index > -1) {
            parentRound.getChildRounds().splice(index, 1);
        }
    }

    addPoule( round, fillPouleToMinimum = true ): void {
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

    getOpposing( winnersOrLosers: number ) {
        return winnersOrLosers === Round.WINNERS ? Round.LOSERS : Round.WINNERS;
    }

    changeNrOfPlacesChildRound( nrOfChildPlacesNew: number, parentRound: Round, winnersOrLosers: number ) {
        let childRound = parentRound.getChildRound( winnersOrLosers );
        if ( childRound == null && nrOfChildPlacesNew > 0 ) {
            childRound = this.addRound( parentRound, winnersOrLosers );
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
        const opposing = this.getOpposing( winnersOrLosers );
        const nrOfPlacesLeftForOpposing = parentRound.getPoulePlaces().length - nrOfChildPlaces;
        const nrOfChildPlacesOpposing = parentRound.getNrOfPlacesChildRound( opposing );
        if ( nrOfPlacesLeftForOpposing < nrOfChildPlacesOpposing ) {
            this.changeNrOfPlacesChildRound( nrOfPlacesLeftForOpposing, parentRound, opposing );
        }
        else if ( nrOfPlacesLeftForOpposing === nrOfChildPlacesOpposing ) {
            qualifyService.oneMultipleToSingle();
        }
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