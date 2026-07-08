import gameEngine from '../../core/GameEngine.js';
import gameConfig from '../../core/GameConfig.js'
import Grid from '../../core/Grid.js';

export default class GameplayScreen {
    constructor() {
        this.grids = [];
        this.screen = document.querySelector('#screen-gameplay');
        this.gameTimer = document.querySelector('#game-timer');
        this.currentPlayerDisplay = this.screen.querySelector('#current-player-turn-display');
        this.nextPlayerDisplay = this.screen.querySelector('#next-player-turn-display');
        this.gridContainer = this.screen.querySelector('#grid-container');
    }

    renderGrids() {
        const currentNumOfGrids = gameConfig.numOfGrids;
        for (let i = 1; i <= currentNumOfGrids; i++) {
            this.grids.push(new Grid(i));
            const gridElement = document.createElement('div');
            gridElement.id = `grid-${i}`;
            gridElement.classList.add('grid');
            const currentGrid = this.grids[i-1];

            for (let j = 0; j < 9; j++) {
                const row = Math.floor(j / 3);
                const col = j % 3;

                const cellElement = document.createElement('button');
                cellElement.classList.add('cell');
                gridElement.appendChild(cellElement);
                cellElement.addEventListener('click', () => {
                    currentGrid.markCell(j);
                    cellElement.classList.toggle('marked', true);
                    cellElement.textContent = 'X';
                    console.log(`Clicked grid-${currentGrid.id}: row ${row}, column ${col}`);
                    console.log(`Grid state: ${currentGrid.gridState.toString(2).padStart(9, '0')}`)

                    if (gameEngine.doesGridHaveThreeXInARow(currentGrid.gridState)) {
                        currentGrid.killGrid(gridElement); 
                        gridElement.classList.add('dead');
                        console.log(`Grid-${currentGrid.id} dead`)
                    }

                    gameEngine.currentTurnIndex = (gameEngine.currentTurnIndex + 1) % gameEngine.AllPlayersInOrder.length;
                    this.updateTurnDisplay();
                });
            }

            this.gridContainer.appendChild(gridElement);
        }
        
    }

    clearGrids() {
        this.grids = [];
        this.gridContainer.innerHTML = '';
    }

    updateTurnDisplay() {
        const currentPlayer = gameEngine.getCurrentPlayer();
        const nextPlayer = gameEngine.getNextPlayer();

        this.currentPlayerDisplay.innerHTML = `${currentPlayer.name}'s turn`;
        this.nextPlayerDisplay.innerHTML = `Next: ${nextPlayer.name}`;
    }

    convertToMMSSFormat(timeInSec) {
        const minutes = Math.floor(timeInSec / 60);
        const seconds = timeInSec % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        const displayString = `${formattedMinutes}:${formattedSeconds}`;

        return displayString;
    }
}