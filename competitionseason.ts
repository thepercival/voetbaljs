/**
 * Created by coen on 16-2-17.
 */

import { Association } from './association';
import { Competition } from './competition';
import { Season } from './season';

export class Competitionseason {
    protected id: any;
    protected association: Association;
    protected competition: Competition;
    protected season: Season;
    protected state: number;
    protected qualificationrule: number;

    static readonly classname = "Competitionseason";

    static readonly STATE_CREATED = 1;
    static readonly STATE_PUBLISHED = 2;

    static readonly QUALIFICATION_RULE_WC = 1;
    static readonly QUALIFICATION_RULE_EC = 2;

    // constructor
    constructor( association: Association, competition: Competition, season: Season ){
        this.setAssociation(association);
        this.setCompetition(competition);
        this.setSeason(season);
        this.setQualificationrule(Competitionseason.QUALIFICATION_RULE_WC);
    }

    getId(): any {
        return this.id;
    };

    setId( id: any): void {
        this.id = id;
    };

    getAssociation(): Association {
        return this.association;
    };

    setAssociation( association: Association): void {
        this.association = association;
    };

    getCompetition(): Competition {
        return this.competition;
    };

    setCompetition( competition: Competition): void {
        this.competition = competition;
    };

    getSeason(): Season {
        return this.season;
    };

    setSeason( season: Season): void {
        this.season = season;
    };
    
    getState(): number {
        return this.state;
    };

    setState( state: number): void {
        this.state = state;
    };

    getStateDescription(): string {
        if ( this.state == Competitionseason.STATE_CREATED ){
            return 'aangemaakt';
        }
        else if ( this.state == Competitionseason.STATE_PUBLISHED ){
            return 'gepubliceerd';
        }

        return null;
    };

    getQualificationrule(): number {
        return this.qualificationrule;
    };

    setQualificationrule( qualificationrule: number): void {
        this.qualificationrule = qualificationrule;
    };

    getName(): string {
        return this.getCompetition().getName() + ' ' + this.getSeason().getName();
    }


}
