class GameConfig {
    #numOfPlayers
    #numOfGrids
    #numOfRounds
    #playerTurnTimeLimit
    #isThereNoGameTimeLimit
    #gameTimeLimit
    #gameMode

    constructor() {
        this.#numOfGrids = 3;
        this.#numOfPlayers = 2;
        this.#numOfRounds = 5;
        this.#playerTurnTimeLimit = 5;
        this.#gameTimeLimit = 60;
        this.#isThereNoGameTimeLimit = false;
        this.#gameMode = 'Normal';
    }

    get numOfGrids() {
        return this.#numOfGrids;
    }

    set numOfGrids(value) {
        this.#numOfGrids = value;
    }

    get numOfPlayers() {
        return this.#numOfPlayers;
    }

    set numOfPlayers(value) {
        this.#numOfPlayers = value;
    }

    get numOfRounds() {
        return this.#numOfRounds;
    }

    set numOfRounds(value) {
        this.#numOfRounds = value;
    }

    get playerTurnTimeLimit() {
        return this.#playerTurnTimeLimit;
    }

    set playerTurnTimeLimit(value) {
        this.#playerTurnTimeLimit = value;
    }

    get gameTimeLimit() {
        return this.#gameTimeLimit;
    }

    set gameTimeLimit(value) {
        this.#gameTimeLimit = value;
    }

    get isThereNoGameTimeLimit() {
        return this.#isThereNoGameTimeLimit;
    }

    set isThereNoGameTimeLimit(value) {
        this.#isThereNoGameTimeLimit = value;
    }

    get gameMode() {
        return this.#gameMode;
    }

    set gameMode(value) {
        this.#gameMode = value;
    }
}

const instance = new GameConfig();
export default instance;