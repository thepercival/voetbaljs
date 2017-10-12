/**
 * Created by coen on 22-3-17.
 */

import { Injectable } from '@angular/core';
import { Competitionseason } from '../competitionseason';
import { Round } from '../round';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Game } from '../game';

@Injectable()
export class StructureService {

    constructor( private competitionseason: Competitionseason, private rounds : Round[] )
    {

    }

    getCompetitionseason(): Competitionseason
    {
        return this.competitionseason;
    }

    getRounds(): Round[]
    {
        return this.rounds;
    }

    getPoulePlaces(): PoulePlace[]
    {
        let pouleplaces = [];
        this.rounds.forEach( function( round ){
            round.getPoules().forEach( function( poule ){
                poule.getPlaces().forEach( function( pouleplace ){
                    pouleplaces.push(pouleplace);
                });
            });
        });
        return pouleplaces;
    }

    getGames(): Game[]
    {
        let games = [];
        this.rounds.forEach( function( round ) {
            round.getGames().forEach(function (game) {
                games.push(game);
            });
        });
        return games;
    }

    getRoundName( round: Round ) {

        let pouleRounds = 0;
        this.rounds.some(function(roundIt) {
            const knockOut = ( roundIt.getType() == Round.TYPE_KNOCKOUT);
            pouleRounds += knockOut ? 0 : 1;
            return knockOut;
        });

        if ( round.getNumber() > pouleRounds) {
            const nrOfRoundsFromWinning = this.rounds.length - ( round.getNumber() );
            if (nrOfRoundsFromWinning == 5) {
                return "<span style='font-size: 80%'><sup>1</sup>&frasl;<sub>16</sub></span> finale";
            }
            else if (nrOfRoundsFromWinning == 4) {
                return "&frac18; finale";
            }
            else if (nrOfRoundsFromWinning == 3) {
                return "&frac14; finale";
            }
            else if (nrOfRoundsFromWinning == 2) {
                return "&frac12; finale";
            }
            else if (nrOfRoundsFromWinning == 1) {
                return "finale";
            }
            else if (nrOfRoundsFromWinning == 0) {
                return "winnaar";
            }
        }

        return ( round.getNumber() ) + '<sup>' + ( round.getNumber() == 1 ? 'st' : 'd' ) + "e</sup> ronde";
    }

    getPouleName( poule: Poule, withPrefix: boolean ) {

        const round = poule.getRound();
        let previousNrOfPoules = 0;
        this.rounds.some(function(roundIt) {
            previousNrOfPoules += round !== roundIt ? roundIt.getPoules().length : 0;
            return round === roundIt;
        });
        let pouleName = "";
        if ( withPrefix == true )
            pouleName = round.getType() == Round.TYPE_KNOCKOUT ? "wed." : "poule";
        return pouleName + ' ' + ( String.fromCharCode( "A".charCodeAt(0) + previousNrOfPoules + ( poule.getNumber() - 1 ) ) );
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

    movePoulePlace( poulePlace: PoulePlace, toPoule: Poule ){

    }


}