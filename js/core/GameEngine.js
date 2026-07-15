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
        this.onTickCallback = null;
        this.timeLeft = 0;
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
        this.stopGameTimer();

        this.timeLeft = duration;
        this.onTickCallback = onTick;
        this.onTickCallback(this.timeLeft);

        this.resumeGameTimer();
    }

    resumeGameTimer() {
        if (this.gameTimerId !== null) return;

        this.gameTimerId = setInterval(() => {
            this.timeLeft--;
            this.onTickCallback(this.timeLeft);

            if (this.timeLeft <= 0) {
                this.stopGameTimer();
                // TODO: Game over logic
            }
        }, 1000);
    }

    pauseGameTimer() {
        if (this.gameTimerId !== null) {
            clearInterval(this.gameTimerId);
            this.gameTimerId = null;
        }
    }

    stopGameTimer() {
        this.pauseGameTimer();
        this.timeLeft = 0;
        this.onTickCallback = null;
    }
}

const instance = new GameEngine();
export default instance;