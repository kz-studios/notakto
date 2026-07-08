import TitleScreen from './screens/TitleScreen.js';
import GameSetupScreen from './screens/GameSetupScreen.js';
import GameplayScreen from './screens/GameplayScreen.js';
import gameEngine from '../core/GameEngine.js';
import gameConfig from '../core/GameConfig.js'

export default class ScreenManager {
    constructor() {
        this.titleScreen = new TitleScreen();
        this.gameSetupScreen = new GameSetupScreen();
        this.gameplayScreen = new GameplayScreen();
        this.screens = document.querySelectorAll('.screen');

        this.titleScreen.btnPlay.addEventListener('click', () => {
            this.switch('screen-game-setup');
        })

        this.gameSetupScreen.btnBack.addEventListener('click', () => {
            this.switch('screen-title');
        })

        this.gameSetupScreen.settingsForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            
            this.gameplayScreen.clearGrids();
            this.gameplayScreen.renderGrids();
            this.gameplayScreen.updateTurnDisplay();

            if (!gameConfig.isThereNoGameTimeLimit) {
                const duration = gameConfig.gameTimeLimit;
                
                gameEngine.startGameTimer(duration, (timeLeft) => {
                    const formattedTime = this.gameplayScreen.convertToMMSSFormat(timeLeft);
                    this.gameplayScreen.gameTimer.innerHTML = formattedTime;
                });
            } else {
                this.gameplayScreen.gameTimer.innerHTML = '∞'; 
            }

            this.switch('screen-gameplay');
        })

        // DEV: Quick exit from screens
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                for (let i = 1; i < this.screens.length; i++) {
                    if (this.screens[i].classList.contains('active')) {
                        this.switch(this.screens[i-1].id);
                        break;
                    }
                }
            }
        });
    }

    switch(targetScreen) {
        for (const screen of this.screens) {
            if (screen.id === targetScreen) {
                screen.classList.replace('hidden', 'active');
            } else {
                screen.classList.replace('active', 'hidden');
            }
        }
    }
}