import { Game } from 'voetbaljs/game';
import { RoundScoreConfig } from 'voetbaljs/round/scoreconfig';

export class GameScore {

    protected id: number;
    protected game: Game;
    protected number: number;
    protected home: number;
    protected away: number;
    protected extraTime: boolean;

    // constructor
    constructor(
        game: Game, number?: number
    ) {
        this.setGame(game);
        if (!number) {
            number = game.getScores().length;
        }
        this.setNumber(number);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getGame(): Game {
        return this.game;
    }

    private setGame(game: Game) {
        game.getScores().push(this);
        this.game = game;
    }

    getScoreConfig(): RoundScoreConfig {
        return this.game.getRound().getInputScoreConfig();
    }

    getNumber(): number {
        return this.number;
    }

    private setNumber(number: number): void {
        this.number = number;
    }

    getHome(): number {
        return this.home;
    }

    setHome(home: number): void {
        this.home = home;
    }

    getAway(): number {
        return this.away;
    }

    setAway(away: number): void {
        this.away = away;
    }

    get(homeAway: boolean): number {
        return homeAway === Game.HOME ? this.getHome() : this.getAway();
    }

    getExtraTime(): boolean {
        return this.extraTime;
    }

    setExtraTime(extraTime: boolean): void {
        this.extraTime = extraTime;
    }
}
