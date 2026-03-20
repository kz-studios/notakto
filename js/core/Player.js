export default class Player {
    constructor(name, color) {
        this._name = name;
        this._color = color;
        this._score = 0;
        this._isEliminated = false;
    }

    get name() {
        return this._name;
    }

    get color() {
        return this._color;
    }

    get score() {
        return this._score;
    }

    get isEliminated() {
        return this._isEliminated;
    }

    reset() {
        this._score = 0;
        this._isEliminated = false;
    }

    eliminate() {
        this._isEliminated = true;
    }

    earnPoint() {
        this._score += 1;
    }
}