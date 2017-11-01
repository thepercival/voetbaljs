/**
 * Created by coen on 27-2-17.
 */

import { Competitionseason } from './competitionseason';
import { Poule } from './poule';
import { Team } from './team';
import { Game } from './game';
import { PoulePlace } from './pouleplace';
import { QualifyRule } from './qualifyrule';
import { RoundConfig } from "./round/config";
import { RoundScoreConfig } from "./round/scoreconfig";

export class Round {
    protected id: number;
    protected competitionseason: Competitionseason;
    protected parentRound: Round;
    protected childRounds: Round[] = [];
    protected winnersOrLosers: number;
    protected number: number;
    protected name: string;
    protected config: RoundConfig;
    protected scoreConfig: RoundScoreConfig;
    protected poules: Poule[] = [];
    protected fromQualifyRules: QualifyRule[] = [];
    protected toQualifyRules: QualifyRule[] = [];

    static readonly classname = "Round";

    static readonly TYPE_POULE = 1;
    static readonly TYPE_KNOCKOUT = 2;
    static readonly TYPE_WINNER = 4;

    static readonly WINNERS = 1;
    static readonly LOSERS = 2;

    // constructor
    constructor( competitionseason: Competitionseason, parentRound: Round, winnersOrLosers: number ){
        this.setCompetitionseason(competitionseason);
        this.winnersOrLosers = winnersOrLosers;
        this.setParentRound(parentRound);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getCompetitionseason(): Competitionseason {
        return this.competitionseason;
    };

    protected setCompetitionseason( competitionseason: Competitionseason): void {
        this.competitionseason = competitionseason;
    };

    getParentRound(): Round {
        return this.parentRound;
    };

    protected setParentRound( round: Round ) {
        this.parentRound = round;
        this.number = this.parentRound !== null ? ( this.parentRound.getNumber() + 1 ) : 1;
        if( this.parentRound !== null ) {
            let childRounds = this.parentRound.getChildRounds();
            if( childRounds.length === 1 && this.getWinnersOrLosers() === Round.WINNERS ) {
                childRounds.unshift( this ) ;
            } else {
                childRounds.push( this ) ;
            }
        }
    }

    getNumber(): number {
        return this.number;
    };

    getChildRounds(): Round[] {
        return this.childRounds;
    };

    getChildRound( winnersOrLosers: number ): Round {
        let childRound = this.childRounds.find( ( roundIt ) => roundIt.getWinnersOrLosers() == winnersOrLosers );
        return ( childRound == null ) ? null : childRound;
    };

    getRootRound() {
        if( this.getParentRound() != null ) {
            return this.getParentRound().getRootRound();
        }
        return this;
    }

    getWinnersOrLosers(): number {
        return this.winnersOrLosers;
    };

    getName(): string {
        return this.name;
    };

    setName(name: string): void {
        this.name = name;
    };

    getConfig(): RoundConfig {
        return this.config;
    }

    setConfig( config: RoundConfig) {
        this.config = config;
    }

    getScoreConfig(): RoundScoreConfig {
        return this.scoreConfig;
    }

    setScoreConfig( scoreConfig: RoundScoreConfig) {
        this.scoreConfig = scoreConfig;
    }

    getPoules(): Poule[] {
        return this.poules;
    }

    getPoulePlaces( orderedByPlace: boolean = false): PoulePlace[]{
        let poulePlaces: PoulePlace[] = [];
        for( let poule of this.getPoules() ){
            for( let place of poule.getPlaces() ){
                poulePlaces.push(place);
            }
        }
        if ( orderedByPlace ===true ) {
            return poulePlaces.sort((poulePlaceA,poulePlaceB) => {
                if (poulePlaceA.getNumber() > poulePlaceB.getNumber()) {
                    return 1;
                }
                if (poulePlaceA.getNumber() < poulePlaceB.getNumber()) {
                    return -1;
                }
                if (poulePlaceA.getPoule().getNumber() > poulePlaceB.getPoule().getNumber()) {
                    return 1;
                }
                if (poulePlaceA.getPoule().getNumber() < poulePlaceB.getPoule().getNumber()) {
                    return -1;
                }
                return 0;
            });
        }
        return poulePlaces;
    }

    getPoulePlacesPerNumber( winnersOrLosers: number ): PoulePlace[][] {
        let poulePlacesPerNumber = [];

        let poulePlacesOrderedByPlace = this.getPoulePlaces( true );
        if( winnersOrLosers === Round.LOSERS ) {
            poulePlacesOrderedByPlace.reverse();
        }

        poulePlacesOrderedByPlace.forEach( function ( placeIt ) {
            let poulePlaces = this.find( function( poulePlacesIt ) {
               return poulePlacesIt.some( function( poulePlaceIt ) {
                   let poulePlaceNrIt = poulePlaceIt.getNumber();
                   if ( winnersOrLosers === Round.LOSERS ) {
                       poulePlaceNrIt = ( poulePlaceIt.getPoule().getPlaces().length + 1 ) - poulePlaceNrIt;
                   }
                   let placeNrIt = placeIt.getNumber();
                   if ( winnersOrLosers === Round.LOSERS ) {
                       placeNrIt = ( placeIt.getPoule().getPlaces().length + 1 ) - placeNrIt;
                   }
                   return poulePlaceNrIt === placeNrIt;
               });
            });

            if( poulePlaces == null ) {
                poulePlaces = [];
                this.push( poulePlaces );
            }
            poulePlaces.push( placeIt );
        }, poulePlacesPerNumber);

        return poulePlacesPerNumber;
    }

    getTeams(): Team[]{
        let teams: Team[] = [];
        for( let poule of this.getPoules() ){
            let pouleTeams = poule.getTeams();
            for( let pouleTeam of pouleTeams ){
                teams.push(pouleTeam);
            }
        }
        return teams;
    }

    getGames(): Game[]
    {
        let games = [];
        this.getPoules().forEach( function( poule ){
            poule.getGames().forEach( function( game ){
                games.push(game);
            });
        });
        return games;
    }

    getGamesByNumber(): Game[]
    {
        return this.getGames().sort((g1,g2) => {
            if ( g1.getRoundNumber() === g2.getRoundNumber() ) {
                if ( g1.getSubNumber() === g2.getSubNumber() ) {
                    return g1.getPoule().getNumber() - g2.getPoule().getNumber();
                }
                return g1.getSubNumber() - g2.getSubNumber();
            }
            return g1.getRoundNumber() - g2.getRoundNumber();
        });
    }

    getType(): number {
        if ( this.getPoules().length === 1 && this.getPoulePlaces().length < 2 ){
            return Round.TYPE_WINNER;
        }
        return ( this.needsRanking() ? Round.TYPE_POULE : Round.TYPE_KNOCKOUT );
    }

    needsRanking(): boolean {
        return this.getPoules().some(function(pouleIt) {
                return pouleIt.needsRanking();
            });
    }

    movePoulePlace( poulePlace: PoulePlace, toPoule: Poule, toNumber: number = null ){
        const removed = poulePlace.getPoule().removePlace( poulePlace );
        if( !removed ){
            return false;
        }

        // zet poule and position
        poulePlace.setNumber( toPoule.getPlaces().length + 1 );
        toPoule.addPlace( poulePlace );

        if( toNumber === null ) {
            return true;
        }
        return toPoule.movePlace( poulePlace, toNumber );
    }

    getFromQualifyRules(): QualifyRule[]{
        return this.fromQualifyRules;
    }

    getToQualifyRules(): QualifyRule[]{
        return this.toQualifyRules;
    }

    getNrOfPlacesChildRound( winnersOrLosers: number ): number {
        const childRound = this.getChildRound( winnersOrLosers );
        return childRound != null ? childRound.getPoulePlaces().length : 0;
    }

    static getOpposing( winnersOrLosers: number ) {
        return winnersOrLosers === Round.WINNERS ? Round.LOSERS : Round.WINNERS;
    }

    // getActiveQualifyRuleMul() {
    //     return ( ( this.getToQualifyRules() % this.getPoules().length ) === 0 );
    // }

    // isFromQualifyingAllSingle(): boolean{
    //     const lastFromQualifyRule = this.fromQualifyRules[this.fromQualifyRules.length - 1];
    //     return lastFromQualifyRule != null && lastFromQualifyRule.isMultiple()  {
    //         return true;
    //     }
    // }
}
