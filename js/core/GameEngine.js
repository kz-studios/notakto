class GameEngine {
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
        this.AllPlayersInOrder = [];
        this.currentTurnIndex = 0;

        this.gameTimerId = null;
    }

    doesGridHaveThreeXInARow(gridState) {
        for (const killingMask of this.killingMasks) {
            if ((gridState & killingMask) === killingMask) return true;
        }
        return false;
    }

    registerPlayers(players) {
        this.AllPlayersInOrder = players;
    }

    getCurrentPlayer() {
        return this.AllPlayersInOrder[this.currentTurnIndex];
    }

    getNextPlayer() {
        const players = this.AllPlayersInOrder;
        const nextPlayer = (() => {
            for (let i = 1; i <= players.length; i++) {
                const p = players[(this.currentTurnIndex + i) % players.length];
                if (!p.isEliminated) return p;
            }
            return null;
        })();

        return nextPlayer;
    }

    startGameTimer(duration, onTick) {
        let timeLeft = duration;

        onTick(timeLeft);

        this.gameTimerId = setInterval(() => {
            timeLeft--;
            onTick(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(this.gameTimerId);
                // TODO: Game over logic
            }
        }, 1000)
    }

    stopGameTimer() {
        clearInterval(this.gameTimerId);
        this.gameTimerId = null;
    }
}

const instance = new GameEngine();
export default instance;