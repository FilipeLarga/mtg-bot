import Game from "./Game";

type GuildThreads = {
    id: number
    threads: Map<number, Game>
}

class GameManager {
    private x: number;

    constructor() {
        this.x = 0;
    }

    increment() {
        this.x++;
        console.log('incremented to: ' + this.x);
    }
}

export default new GameManager();