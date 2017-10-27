import { Round } from '../round';

export class RoundScoreConfig {
    protected id: number;
    protected round: Round;
    // protected nrofheadtoheadmatches: number;
    // protected qualifyRule: number;
    // protected winPointsPerGame: number;
    // protected winPointsExtraTime: number;
    // protected hasExtraTime: boolean;
    // protected nrOfMinutesPerGame: number;
    // protected nrOfMinutesExtraTime: number;
    // protected nrOfMinutesInBetween: number;

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
    };

    // getNrofheadtoheadmatches(): number {
    //     return this.nrofheadtoheadmatches;
    // };
    //
    // setNrofheadtoheadmatches(nrofheadtoheadmatches: number) {
    //     this.nrofheadtoheadmatches = nrofheadtoheadmatches;
    // };
    //
    // getQualifyRule(): number {
    //     return this.qualifyRule;
    // };
    //
    // setQualifyRule(qualifyRule: number) {
    //     this.qualifyRule = qualifyRule;
    // };
    //
    // getWinPointsPerGame(): number {
    //     return this.winPointsPerGame;
    // };
    //
    // setWinPointsPerGame(winPointsPerGame: number) {
    //     this.winPointsPerGame = winPointsPerGame;
    // };
    //
    // getWinPointsExtraTime(): number {
    //     return this.winPointsExtraTime;
    // };
    //
    // setWinPointsExtraTime(winPointsExtraTime: number) {
    //     this.winPointsExtraTime = winPointsExtraTime;
    // };


}

