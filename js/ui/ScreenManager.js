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
        this.screens = [this.titleScreen, this.gameSetupScreen, this.gameplayScreen];
        this.currentScreen = this.titleScreen;

        this.gameSetupScreen.settingsForm.addEventListener('submit', (event) => {
            event.preventDefault(); 
            
            this.gameplayScreen.clearGrids();
            this.gameplayScreen.renderGrids();
            this.gameplayScreen.updateTurnDisplay();
        this.titleScreen.screen.addEventListener('request-navigation', (event) => {
            this.switch(event.detail.target);
        });

            if (!gameConfig.isThereNoGameTimeLimit) {
                const duration = gameConfig.gameTimeLimit;
                
                gameEngine.startGameTimer(duration, (timeLeft) => {
                    const formattedTime = this.gameplayScreen.convertToMMSSFormat(timeLeft);
                    this.gameplayScreen.gameTimer.innerHTML = formattedTime;
                });
            } else {
                this.gameplayScreen.gameTimer.innerHTML = '∞'; 
            }
        this.gameSetupScreen.screen.addEventListener('request-navigation', (event) => {
            this.switch(event.detail.target);
        });

            this.switch('screen-gameplay');
        })

        // DEV: Quick exit from screens
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const currentIndex = this.screens.indexOf(this.currentScreen);
                
                if (currentIndex > 0) {
                    this.switch(this.screens[currentIndex - 1].id);
                }
            }
        });
    }

    switch(targetScreen) {
        for (const screen of this.screens) {
            if (screen.id === targetScreen) {
                this.currentScreen = screen;
                screen.show();
            } else {
                screen.hide();
            }
        }
    }
}