export default class Player {
    #name;
    #color;
    #score;
    #isEliminated;

    constructor(name, color) {
        this.#name = name;
        this.#color = color;
        this.#score = 0;
        this.#isEliminated = false;
    }

    get name() {
        return this.#name;
    }

    get color() {
        return this.#color;
    }

    get score() {
        return this.#score;
    }

    get isEliminated() {
        return this.#isEliminated;
    }

    reset() {
        this.#score = 0;
        this.#isEliminated = false;
    }

    eliminate() {
        this.#isEliminated = true;
    }

    earnPoint() {
        this.#score += 1;
    }
}