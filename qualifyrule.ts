/**
 * Created by coen on 15-10-17.
 */

import { Round } from './round';
import { PoulePlace } from './pouleplace';

export class QualifyRule {
    protected id: number;
    protected fromRound: Round;
    protected toRound: Round;
    protected configNr: number;
    protected fromPoulePlaces: PoulePlace[] = [];
    protected toPoulePlaces: PoulePlace[] = [];

    // constructor
    constructor(fromRound: Round, toRound: Round ) {
        this.setFromRound(fromRound);
        this.setToRound(toRound);
    }

    getId(): number {
        return this.id;
    };

    setId(id: number): void {
        this.id = id;
    };

    getFromRound(): Round {
        return this.fromRound;
    };

    setFromRound(round: Round): void {
        if( this.fromRound != null && this.fromRound != round ) {
            const index = this.fromRound.getToQualifyRules().indexOf( this );
            if (index > -1) {
                this.fromRound.getToQualifyRules().splice(index, 1);
            }
        }
        if ( round != null ){
            round.getToQualifyRules().push( this );
        }
        this.fromRound = round;
    };

    getToRound(): Round {
        return this.toRound;
    };

    setToRound(round: Round): void {
        if( this.toRound != null && this.toRound != round ) {
            const index = this.toRound.getFromQualifyRules().indexOf( this );
            if (index > -1) {
                this.toRound.getFromQualifyRules().splice(index, 1);
            }
        }
        if ( round != null ) {
            round.getFromQualifyRules().push(this);
        }
        this.toRound = round;
    };

    getFromPoulePlaces(): PoulePlace[] {
        return this.fromPoulePlaces;
    };

    addFromPoulePlace(poulePlace: PoulePlace): void {
        if( poulePlace == null ) { return; }
        poulePlace.setToQualifyRule( this.getWinnersOrLosers(), this );
        this.fromPoulePlaces.push( poulePlace );
    };

    removeFromPoulePlace(poulePlace: PoulePlace = null ): void {
        let fromPoulePlaces = this.getFromPoulePlaces();
        if( poulePlace == null ) {
            poulePlace = fromPoulePlaces[ fromPoulePlaces.length - 1 ];
        }
        const index = fromPoulePlaces.indexOf( poulePlace );
        if (index > -1) {
            this.getFromPoulePlaces().splice(index, 1);
            poulePlace.setToQualifyRule( this.getWinnersOrLosers(), null );
        }
    };

    getToPoulePlaces(): PoulePlace[] {
        return this.toPoulePlaces;
    };

    addToPoulePlace(poulePlace: PoulePlace): void {
        if( poulePlace == null ) { return; }
        poulePlace.setFromQualifyRule( this );
        this.toPoulePlaces.push( poulePlace );
    };

    removeToPoulePlace( poulePlace: PoulePlace = null): void {
        let toPoulePlaces = this.getToPoulePlaces();
        if( poulePlace == null ) {
            poulePlace = toPoulePlaces[ toPoulePlaces.length - 1 ];
        }
        const index = this.getToPoulePlaces().indexOf( poulePlace );
        if (index > -1) {
            this.getToPoulePlaces().splice(index, 1);
            poulePlace.setFromQualifyRule( null );
        }
    };

    isMultiple(): boolean {
        return this.fromPoulePlaces.length > this.toPoulePlaces.length;
    }

    getWinnersOrLosers(): number {
        return this.getToRound().getWinnersOrLosers();
    }
}

