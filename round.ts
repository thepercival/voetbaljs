/**
 * Created by coen on 27-2-17.
 */

import { Competitionseason } from './competitionseason';
import { Poule } from './poule';
import { Team } from './team';
import { Game } from './game';
import { PoulePlace } from './pouleplace';

export class Round {
    protected id: number;
    protected competitionseason: Competitionseason;
    protected number: number;
    protected nrofheadtoheadmatches: number;
    protected name: string;
    protected poules: Poule[] = [];
    protected bNeedsRanking: boolean = null;

    static readonly classname = "Round";

    static readonly TYPE_POULE = 1;
    static readonly TYPE_KNOCKOUT = 2;
    static readonly TYPE_WINNER = 4;

    // constructor
    constructor( competitionseason: Competitionseason, number: number ){
        this.setCompetitionseason(competitionseason);
        this.setNumber(number);
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

    setCompetitionseason( competitionseason: Competitionseason): void {
        this.competitionseason = competitionseason;
    };

    getNumber(): number {
        return this.number;
    };

    setNumber( number: number): void {
        this.number = number;
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

    getPoulePlaces(): PoulePlace[]{
        let poulePlaces: PoulePlace[] = [];
        for( let poule of this.getPoules() ){
            for( let place of poule.getPlaces() ){
                poulePlaces.push(place);
            }
        }
        return poulePlaces;
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
}
