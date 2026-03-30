import gameConfig from '../../core/GameConfig.js'

export default class GameSetupScreen {
    constructor() {
        this.screen = document.querySelector('#screen-game-setup');
        this.settingsForm = this.screen.querySelector('#screen-game-setup-settings-container');
        this.gameSettingsContainer = this.settingsForm.querySelector('#game-settings-container');
        this.controlElements = this.settingsForm.querySelectorAll('.game-settings-option .controls');
        this.chkNoTimeLimit = this.settingsForm.querySelector('#checkbox-game-time-limit');

        this.btnBack = this.screen.querySelector('.btn-back');
        this.btnHowToPlay = this.screen.querySelector('.btn-how-to-play');
        this.btnStart = this.screen.querySelector('.btn-start');

        this.renderGameSetupValues();

        this.gameSettingsContainer.addEventListener('click', (event) => {
            const btn = event.target;
    
            if (!btn.matches('.btn-decrease') && !btn.matches('.btn-increase')) return;

            const controlsContainer = btn.closest('.controls');
            const displaySpan = controlsContainer.querySelector('span');
            const settingKey = controlsContainer.dataset.setting;
            const min = parseInt(controlsContainer.dataset.min);
            const max = parseInt(controlsContainer.dataset.max);
            const step = parseInt(controlsContainer.dataset.step);

            let currentValue = gameConfig[settingKey];
            let newValue;
            if (btn.matches('.btn-decrease') && currentValue !== min) {
                newValue = currentValue - step;
            }
            else if (btn.matches('.btn-increase') && currentValue !== max) {
                newValue = currentValue + step;
            } else return;

            gameConfig[settingKey] = newValue;

            this.updateArrowState(controlsContainer, min, max, newValue);

            let displayText = gameConfig[settingKey];
            if ('unit' in controlsContainer.dataset) {
                displayText += controlsContainer.dataset.unit;
            }
            displaySpan.textContent = displayText;
        })

        this.chkNoTimeLimit.addEventListener('change', (event) => {
            const gameTimeLimitStepperGroup = this.gameSettingsContainer.querySelector('.controls[data-setting="gameTimeLimit"] .stepper-group');
            const gameTimeLimitDisplayValue = gameTimeLimitStepperGroup.querySelector('span');

            if (event.target.checked) {
                gameConfig.isThereNoGameTimeLimit = true;
                gameTimeLimitStepperGroup.classList.toggle('disabled', true);
                gameTimeLimitDisplayValue.textContent = '∞';
            } else {
                gameConfig.isThereNoGameTimeLimit = false;
                gameTimeLimitStepperGroup.classList.toggle('disabled', false);
                gameTimeLimitDisplayValue.textContent = gameConfig.gameTimeLimit + 'sec';
            }

            this.chkNoTimeLimit.checked = gameConfig.isThereNoGameTimeLimit;
        })
    }

    renderGameSetupValues() {
        for (const controlElement of this.controlElements) {
            const settingKey = controlElement.dataset.setting;
            const displaySpan = controlElement.querySelector('span');

            if (controlElement.dataset.setting !== 'gameMode') {
                const min = parseInt(controlElement.dataset.min);
                const max = parseInt(controlElement.dataset.max);

                this.updateArrowState(controlElement, min, max, gameConfig[settingKey]);

                if ('unit' in controlElement.dataset) displaySpan.textContent = controlElement.dataset.unit;
                displaySpan.textContent = gameConfig[settingKey] + displaySpan.textContent;
            }
            else if (controlElement.dataset.setting == 'gameMode') {
                const radioGameModeNormal = controlElement.querySelector(`input[type="radio"][value="${gameConfig.gameMode}"]`);
                radioGameModeNormal.checked = true;
            }
        }

        this.chkNoTimeLimit.checked = gameConfig.isThereNoGameTimeLimit;
    }

    updateArrowState(controlElement, min, max, value) {
        const btnDecrease = controlElement.querySelector('button.btn-decrease');
        const btnIncrease = controlElement.querySelector('button.btn-increase');
        
        if (value === min) {
            btnDecrease.classList.toggle('disabled', true);
        } else {
            btnDecrease.classList.toggle('disabled', false);
        }

        if (value === max) {
            btnIncrease.classList.toggle('disabled', true);
        } else {
            btnIncrease.classList.toggle('disabled', false);
        }
    }
}