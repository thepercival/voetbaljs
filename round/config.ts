import { Round } from '../round';

export class RoundConfig {
    protected id: number;
    protected round: Round;
    protected nrOfHeadtoheadMatches: number;
    protected qualifyRule: number;
    protected winPointsPerGame: number;
    protected winPointsExtraTime: number;
    protected hasExtraTime: boolean;
    protected nrOfMinutesPerGame: number;
    protected nrOfMinutesExtraTime: number;
    protected nrOfMinutesInBetween: number;

    // constructor
    constructor(round: Round ) {
        this.setRound(round);
    }

    getId(): number {
        return this.id;
    };

    setId(id: number) {
        this.id = id;
    };

    getRound(): Round {
        return this.round;
    };

    private setRound( round: Round) {
        this.round = round;
        if( round != null ) {
            round.setConfig( this );
        }
    };

    getNrOfHeadtoheadMatches(): number {
        return this.nrOfHeadtoheadMatches;
    };

    setNrOfHeadtoheadMatches( nrOfHeadtoheadMatches: number) {
        this.nrOfHeadtoheadMatches = nrOfHeadtoheadMatches;
    };

    getQualifyRule(): number {
        return this.qualifyRule;
    };

    setQualifyRule(qualifyRule: number) {
        this.qualifyRule = qualifyRule;
    };

    getWinPointsPerGame(): number {
        return this.winPointsPerGame;
    };

    setWinPointsPerGame(winPointsPerGame: number) {
        this.winPointsPerGame = winPointsPerGame;
    };

    getWinPointsExtraTime(): number {
        return this.winPointsExtraTime;
    };

    setWinPointsExtraTime(winPointsExtraTime: number) {
        this.winPointsExtraTime = winPointsExtraTime;
    };

    getHasExtraTime(): boolean {
        return this.hasExtraTime;
    };

    setHasExtraTime(hasExtraTime: boolean) {
        this.hasExtraTime = hasExtraTime;
    };

    getNrOfMinutesPerGame(): number {
        return this.nrOfMinutesPerGame;
    };

    setNrOfMinutesPerGame(nrOfMinutesPerGame: number) {
        this.nrOfMinutesPerGame = nrOfMinutesPerGame;
    };

    getNrOfMinutesExtraTime(): number {
        return this.nrOfMinutesExtraTime;
    };

    setNrOfMinutesExtraTime(nrOfMinutesExtraTime: number) {
        this.nrOfMinutesExtraTime = nrOfMinutesExtraTime;
    };

    getNrOfMinutesInBetween(): number {
        return this.nrOfMinutesInBetween;
    };

    setNrOfMinutesInBetween(nrOfMinutesInBetween: number) {
        this.nrOfMinutesInBetween = nrOfMinutesInBetween;
    };

    getMaximalNrOfMinutesPerGame( withMinutesInBetween: boolean = false ): number {
        let nrOfMinutes = this.getNrOfMinutesPerGame();
        if ( this.getHasExtraTime()) {
            nrOfMinutes += this.getNrOfMinutesExtraTime();
        }
        if( withMinutesInBetween === true ) {
            nrOfMinutes += this.getNrOfMinutesInBetween();
        }
        return nrOfMinutes;
    }
}

