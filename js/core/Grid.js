export default class Grid {
    #id;
    #isAlive;
    #gridState;

    constructor(id) {
        this.#id = id;
        this.#isAlive = null;
        this.#gridState = null;

        this.reset();
    }

    get id() {
        return this.#id;
    }

    get isAlive() {
        return this.#isAlive;
    }

    get gridState() {
        return this.#gridState;
    }

    reset() {
        this.#isAlive = true;
        this.#gridState = 0b000000000;
    }

    markCell(index) {
        const bitToToggle = 0b000000001 << index;
        console.log(`Marked cell ${bitToToggle} of ${this.#id}`);
        this.#gridState |= bitToToggle;
    }

    killGrid() {
        this.#isAlive = false;
    }
}