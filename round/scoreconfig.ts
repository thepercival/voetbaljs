import { Round } from '../round';

export class RoundScoreConfig {
    protected id: number;
    protected round: Round;
    protected parent: RoundScoreConfig;
    protected name: string;
    protected start: number;
    protected goal: number;
    protected child: RoundScoreConfig;

    // constructor
    constructor(round: Round, parent: RoundScoreConfig ) {
        this.setRound(round);
        this.setParent(parent);
    }

    getId(): number {
        return this.id;
    };

    setId(id: number) {
        this.id = id;
    };

    getName(): string {
        return this.name;
    };

    setName(name: string): void {
        this.name = name;
    };

    getStart(): number {
        return this.start;
    };

    setStart(start: number) {
        this.start = start;
    };

    getGoal(): number {
        return this.goal;
    };

    setGoal(goal: number) {
        this.goal = goal;
    };

    getRound(): Round {
        return this.round;
    };

    private setRound( round: Round) {
        this.round = round;
    };

    getParent(): RoundScoreConfig {
        return this.parent;
    };

    private setParent( parent: RoundScoreConfig) {
        this.parent = parent;
        if( this.parent != null ) {
            this.parent.setChild( this );
        }
    };

    getRoot() {
        const parent = this.getParent();
        if( parent != null ) {
            return parent.getRoot();
        }
        return this;
    }

    getChild(): RoundScoreConfig {
        return this.child;
    };

    setChild( child: RoundScoreConfig) {
        this.child = child;
    };


}

