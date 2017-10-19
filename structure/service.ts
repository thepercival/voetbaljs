/**
 * Created by coen on 22-3-17.
 */

import { Injectable } from '@angular/core';
import { Competitionseason } from '../competitionseason';
import { Round } from '../round';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Game } from '../game';
import { QualifyRule } from '../qualifyrule';

export class StructureService {

    constructor( private competitionseason: Competitionseason, private round : Round )
    {

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
        // ///////////////////////
        let pouleName = '';
        if ( withPrefix == true )
            pouleName = round.getType() == Round.TYPE_KNOCKOUT ? 'wed.' : 'poule';
        return pouleName + ' x';
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

    removePoule( poule: Poule ): boolean {
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

    addRound( parentRound: Round, winnersOrLosers: number ): Round {
        let round = new Round( this.competitionseason, parentRound, winnersOrLosers );
        round.setNrofheadtoheadmatches(1)
        const poule = new Poule( round );
        const poulePlace = new PoulePlace( poule );
        return round;
    }

    addQualifier( fromRound: Round, winnersOrLosers: number ) {
        let toRound = fromRound.getChildRound( winnersOrLosers );
        console.log(toRound);
        if (toRound == null) {
            toRound = this.addRound( fromRound, winnersOrLosers );
        }
        // determine if new qualifiationrule is needed


        const fromQualifyRules = toRound.getFromQualifyRules();
        const lastFromQualifyRule = fromQualifyRules[fromQualifyRules.length - 1];
        if( lastFromQualifyRule != null && lastFromQualifyRule.isMultiple() ) {
            if( ( lastFromQualifyRule.getFromPoulePlaces().length - 1 ) < lastFromQualifyRule.getToPoulePlaces().length ) { // edit lastFromQualifyRule

            }
            if( ( lastFromQualifyRule.getFromPoulePlaces().length - 1 ) === lastFromQualifyRule.getToPoulePlaces().length ) {  // remove and add multiple

            }
        }

        const fromPoules = fromRound.getPoules();
        if ( fromPoules.length > 1 ) { // new multiple

        }
        else { // new single
            const fromPoule = fromPoules[0];
            const fromPlace = fromPoule.getPlaces().find( function( pouleplaceIt ) {
                return this == pouleplaceIt.getNumber()
            }, toRound.getFromQualifyRules().length + 1 );
            if ( fromPlace == null ) { return; }

            const toPoules = toRound.getPoules();
            const toPoule = toPoules[0];
            let toPlace = null;
            if( lastFromQualifyRule == null ) { // just get first
                toPlace = toPoule.getPlaces()[0];
            }
            else { // determine which toPoule and toPlace

            }
            if ( toPlace == null ) { return; }

            let qualifyRule = new QualifyRule( fromRound, toRound );
            qualifyRule.addFromPoulePlace( fromPlace );
            qualifyRule.addToPoulePlace( toPlace );
        }
    }
}