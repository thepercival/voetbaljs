import { Competitionseason } from './competitionseason';

export class Referee {
    protected id: number;
    protected competitionseason: Competitionseason;
    protected stars: number;
    protected name: string;

    static readonly classname = "Referee";

    static readonly MIN_LENGTH_NAME = 1;
    static readonly MAX_LENGTH_NAME = 15;

    // constructor
    constructor( competitionseason: Competitionseason, stars: number ){
        this.setCompetitionseason(competitionseason);
        this.setStars(stars);
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getCompetitionseason(): Competitionseason {
        return this.competitionseason;
    }

    setCompetitionseason( competitionseason: Competitionseason): void {
        this.competitionseason = competitionseason;
        this.competitionseason.getReferees().push(this);
    };

    getStars(): number {
        return this.stars;
    };

    setStars( stars: number): void {
        this.stars = stars;
    };

    getName(): string {
        return this.name;
    };

    setName(name: string): void {
        this.name = name;
    };
}