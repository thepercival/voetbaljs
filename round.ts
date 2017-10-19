/**
 * Created by coen on 27-2-17.
 */

import { Competitionseason } from './competitionseason';
import { Poule } from './poule';
import { Team } from './team';
import { Game } from './game';
import { PoulePlace } from './pouleplace';
import { QualifyRule } from './qualifyrule';

export class Round {
    protected id: number;
    protected competitionseason: Competitionseason;
    protected parentRound: Round;
    protected childRounds: Round[] = [];
    protected winnersOrLosers: number;
    protected number: number;
    protected nrofheadtoheadmatches: number;
    protected name: string;
    protected poules: Poule[] = [];
    protected bNeedsRanking: boolean = null;
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
        this.setParentRound(parentRound);
        this.winnersOrLosers = winnersOrLosers;
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
            this.parentRound.getChildRounds().push( this );
        }
    }

    getNumber(): number {
        return this.number;
    };

    getChildRounds(): Round[] {
        return this.childRounds;
    };

    getChildRound( winnersOrLosers: number ): Round {
        return this.childRounds.find( ( roundIt ) => roundIt.getWinnersOrLosers() == winnersOrLosers );
    };

    getWinnersOrLosers(): number {
        return this.winnersOrLosers;
    };

    getNrofheadtoheadmatches(): number {
        return this.nrofheadtoheadmatches;
    };

    setNrofheadtoheadmatches( nrofheadtoheadmatches: number): void {
        this.nrofheadtoheadmatches = nrofheadtoheadmatches;
    };

    getName(): string {
        return this.name;
    };

    setName(name: string): void {
        this.name = name;
    };

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

    getPoulePlacesPerNumber(): PoulePlace[][] {
        let poulePlacesPerNumber = [];
        this.getPoules().forEach( function ( pouleIt ) {
            pouleIt.getPlaces().forEach( function ( placeIt ) {
                let poulePlaces = poulePlacesPerNumber.find( function( poulePlacesIt ) {
                   return poulePlacesIt.some( function( poulePlaceIt ) {
                       return poulePlaceIt.getNumber() === placeIt.getNumber();
                   });
                });

                if( poulePlaces == null ) {
                    poulePlaces = [];
                    this.push( poulePlaces );
                }
                poulePlaces.push( placeIt );
            }, this );
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

    getType(): number {
        if ( this.getPoules().length === 1 && this.getPoulePlaces().length < 2 ){
            return Round.TYPE_WINNER;
        }
        return ( this.needsRanking() ? Round.TYPE_POULE : Round.TYPE_KNOCKOUT );

    }

    needsRanking(): boolean {
        if ( this.bNeedsRanking === null ) {

            this.bNeedsRanking = this.getPoules().some(function(pouleIt) {
                return pouleIt.needsRanking();
            });
        }
        return this.bNeedsRanking;
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
