/**
 * Created by coen on 27-2-17.
 */

import { Poule } from './poule';
import { Team } from './team';
import { Game } from './game';
import { QualifyRule } from './qualifyrule';

export class PoulePlace {
    protected id: number;
    protected poule: Poule;
    protected number: number;
    protected name: string;
    protected team: Team;
    protected toPoulePlace: PoulePlace;
    protected fromQualifyRule: QualifyRule;
    protected toQualifyRules: QualifyRule[] = [];

    static readonly classname = "PoulePlace";

    // constructor
    constructor(poule: Poule, number: number = null) {
        if (number === null) {
            number = poule.getPlaces().length + 1;
        }
        this.setNumber(number);
        poule.addPlace(this);
    }

    getId(): number {
        return this.id;
    };

    setId(id: number): void {
        this.id = id;
    };

    getPoule(): Poule {
        return this.poule;
    };

    setPoule(poule: Poule) {
        this.poule = poule;
    };

    getNumber(): number {
        return this.number;
    };

    setNumber(number: number): void {
        this.number = number;
    };

    getName(): string {
        return this.name;
    };

    setName(name: string): void {
        this.name = name;
    };

    getTeam(): Team {
        return this.team;
    }

    setTeam(team: Team): void {
        this.team = team;
    };

    // getToPoulePlace(): PoulePlace {
    //     return this.toPoulePlace;
    // }
    //
    // setToPoulePlace( toPoulePlace: PoulePlace): void {
    //     this.toPoulePlace = toPoulePlace;
    // };

    getFromQualifyRule(): QualifyRule {
        return this.fromQualifyRule;
    }

    setFromQualifyRule(qualifyRule: QualifyRule): void {
        this.fromQualifyRule = qualifyRule;
    };

    getToQualifyRules(): QualifyRule[] {
        return this.toQualifyRules;
    }

    getToQualifyRule(winnersOrLosers: number): QualifyRule {
        return this.toQualifyRules.find(function (qualifyRuleIt) {
            return qualifyRuleIt.getWinnersOrLosers() == this
        }, winnersOrLosers);
    }

    setToQualifyRule(winnersOrLosers: number, qualifyRule: QualifyRule): void {
        const toQualifyRuleOld = this.getToQualifyRule(winnersOrLosers);
        if (toQualifyRuleOld != null) {
            // toQualifyRuleOld.removeFromPoulePlace( this );
            const index = this.toQualifyRules.indexOf(toQualifyRuleOld);
            if (index > -1) {
                this.toQualifyRules.splice(index, 1);
            }
        }
        if (qualifyRule) {
            this.toQualifyRules.push(qualifyRule);
        }
    };

    getGames(): Game[] {
        return this.getPoule().getGames().filter((gameIt) => gameIt.getHomePoulePlace() == this || gameIt.getAwayPoulePlace() == this);
    }
}