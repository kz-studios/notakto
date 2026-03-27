import Grid from "../../core/Grid.js";
import GameEngine from "../../core/GameEngine.js";

export default class GameplayScreen {
    constructor() {
        this.numOfGrids = 5;
        this.grids = [];
        this.screen = document.querySelector('#screen-gameplay');
        this.gridContainer = this.screen.querySelector('#grid-container');
    }

    renderGrids() {
        for (let i = 1; i <= this.numOfGrids; i++) {
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
                    cellElement.innerHTML = '<h1>X</h1>'
                    console.log(`Clicked grid-${currentGrid.id}: row ${row}, column ${col}`);
                    console.log(`Grid state: ${currentGrid.gridState.toString(2).padStart(9, '0')}`)
                });
            }

            this.gridContainer.appendChild(gridElement);
        }
        
    }

    clearGrids() {
        this.grids = [];
        this.gridContainer.innerHTML = '';
    }
}