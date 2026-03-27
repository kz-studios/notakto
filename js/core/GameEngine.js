export default class GameEngine {
    constructor() {
        this.killingMasks = [
            0b000000111,
            0b000111000,
            0b111000000,
            0b001001001,
            0b010010010,
            0b100100100,
            0b100010001,
            0b001010100
        ];
    }

    doesGridHaveThreeXInARow(gridState) {
        for (const killingMask of this.killingMasks) {
            if ((gridState & killingMask) === killingMask) return true;
        }
        return false;
    }
}