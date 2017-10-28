/**
 * Created by coen on 20-3-17.
 */

import { PoulePlace } from './pouleplace';
import { Field } from './field';
import { Referee } from './referee';

export class Game {
    protected id: number;
    protected roundNumber: number;
    protected subNumber: number;
    protected field: Field;
    protected referee: Referee;
    protected homePoulePlace: PoulePlace;
    protected awayPoulePlace: PoulePlace;
    protected startDateTime: Date;
    protected state: number;

    static readonly STATE_CREATED = 1;
    static readonly STATE_INPLAY = 2;
    static readonly STATE_PLAYED = 4;

    static readonly classname = "Game";

    // constructor
    constructor( homePouleplace: PoulePlace, awayPouleplace: PoulePlace, roundNumber: number, subNumber: number ){
        this.setRoundNumber(roundNumber);
        this.setSubNumber(subNumber);
        this.setHomePoulePlace(homePouleplace);
        this.setAwayPoulePlace(awayPouleplace);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getRoundNumber(): number {
        return this.roundNumber;
    };

    setRoundNumber( roundNumber: number): void {
        this.roundNumber = roundNumber;
    };

    getSubNumber(): number {
        return this.subNumber;
    };

    setSubNumber( subNumber: number): void {
        this.subNumber = subNumber;
    };

    getField(): Field {
        return this.field;
    };

    setField( field: Field): void {
        this.field = field;
    };

    getReferee(): Referee {
        return this.referee;
    };

    setReferee( referee: Referee): void {
        this.referee = referee;
    };

    getStartDateTime(): Date {
        return this.startDateTime;
    };

    setStartDateTime(startDateTime: Date): void {
        this.startDateTime = startDateTime;
    };

    getHomePoulePlace(): PoulePlace {
        return this.homePoulePlace;
    };

    setHomePoulePlace(homePoulePlace: PoulePlace): void {
        this.homePoulePlace = homePoulePlace;
    };

    getAwayPoulePlace(): PoulePlace {
        return this.awayPoulePlace;
    };

    setAwayPoulePlace(awayPoulePlace: PoulePlace): void {
        this.awayPoulePlace = awayPoulePlace;
    };

    getState(): number {
        return this.state;
    };

    setState( state: number): void {
        this.state = state;
    };
}