/**
 * Created by coen on 27-2-17.
 */

import { Round } from './round';
import { PoulePlace } from './pouleplace';
import { Team } from './team';
import { Game } from './game';

export class Poule {
    protected id: number;
    protected round: Round;
    protected number: number;
    protected name: string;
    protected places: PoulePlace[] = [];
    protected games: Game[] = [];

    static readonly classname = "Poule";

    // constructor
    constructor( round: Round, number: number = null ){
        if( number === null){
            number = round.getPoules().length + 1;
        }
        this.setRound(round);
        this.setNumber(number);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getRound(): Round {
        return this.round;
    };

    setRound( round: Round): void {
        // if( this.round != null ){ // remove from old round
        //     var index = this.round.getPoules().indexOf(this);
        //     if (index > -1) {
        //         this.round.getPoules().splice(index, 1);
        //     }
        // }
        this.round = round;
        this.round.getPoules().push(this);
    };

    getNumber(): number {
        return this.number;
    };

    setNumber( number: number): void {
        this.number = number;
    };

    getName(): string {
        return this.name;
    };

    setName(name: string): void {
        this.name = name;
    };

    getPlaces(): PoulePlace[] {
        return this.places;
    }

    getTeams(): Team[]{
        let teams: Team[] = [];
        for( let pouleplace of this.getPlaces() ){
            const team = pouleplace.getTeam();
            if( team != null ) {
                teams.push(team);
            }
        }
        return teams;
    }

    getGames(): Game[] {
        return this.games;
    }

    getGamesNotStarted(): Game[] {
        return this.getGames().filter( (gameIt) => gameIt.getState() === Game.STATE_CREATED );
    }

    needsRanking(): boolean {
        return ( this.getPlaces().length > 2 );
    }

    next(): Poule {
        const poules = this.getRound().getPoules();
        return poules[this.getNumber()];
    }

    addPlace( place: PoulePlace ) {
        if( place.getNumber() <= this.getPlaces().length ) {
            throw new Error('de pouleplek kan niet toegevoegd worden, omdat het nummer van de plek kleiner is dan het aantal huidige plekken');
        }
        place.setPoule( this );
        this.getPlaces().push( place );
    }

    removePlace( place: PoulePlace ): boolean {
        var index = this.places.indexOf(place);
        if (index == -1 ) {
            return false;
        }
        this.places.splice(index, 1);
        place.setPoule(null);
        this.places.forEach( function( placeIt ){
            if( placeIt.getNumber() > place.getNumber() ){
                placeIt.setNumber( placeIt.getNumber() - 1 );
            }
        });
        place.setNumber(null);
        return true;
    }

    movePlace( place: PoulePlace, toNumber: number ) {
        if( toNumber > this.places.length ){
            toNumber = this.places.length;
        }
        if( toNumber < 1 ){
            toNumber = 1;
        }

        // find index of place with same number
        const foundPlace = this.places.find( function( pouleplaceIt ) {
            return toNumber == pouleplaceIt.getNumber()
        });

        // remove item
        {
            const index = this.places.indexOf(place);
            if (index == -1) {
                return;
            }
            this.places.splice(index, 1);
        }

        // insert item
        {
            const index = this.places.indexOf(foundPlace);
            // insert item
            this.places.splice(index, 0, place);
        }

        // update numbers from foundPlace
        let number = 1;
        this.places.forEach( function( poulePlaceIt ){
            poulePlaceIt.setNumber( number++ );
        });

        return true;
    }
}
