import gameConfig from '../../core/GameConfig.js'

export default class GameSetupScreen {
    constructor() {
        this.screen = document.querySelector('#screen-game-setup');
        this.settingsForm = this.screen.querySelector('#screen-game-setup-settings-container');
        this.gameSettingsContainer = this.settingsForm.querySelector('#game-settings-container');
        this.playerCardsContainer = this.settingsForm.querySelector('#player-cards-row-container');
        this.controlElements = this.settingsForm.querySelectorAll('.game-settings-option .controls');
        this.chkNoTimeLimit = this.settingsForm.querySelector('#checkbox-game-time-limit');

        this.btnBack = this.screen.querySelector('.btn-back');
        this.btnHowToPlay = this.screen.querySelector('.btn-how-to-play');
        this.btnStart = this.screen.querySelector('.btn-start');

        this.renderGameSetupValues();
        this.generatePlayerCards();
        this.syncPlayerCardVisibility();
        this.updateColorAvailability();

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

            this.syncPlayerCardVisibility();

            if (settingKey === 'numOfPlayers') this.updateColorAvailability();
            
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
            const isChecked = event.target.checked;

            gameConfig.isThereNoGameTimeLimit = isChecked;
            gameTimeLimitStepperGroup.classList.toggle('disabled', isChecked);
            gameTimeLimitDisplayValue.textContent = isChecked ? '∞' : gameConfig.gameTimeLimit + 'sec';
        });

        this.playerCardsContainer.addEventListener('change', (event) => {
            if (event.target.tagName === 'SELECT') {
                this.updateColorAvailability();
            }
        });
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
        
        btnDecrease.classList.toggle('disabled', value === min);
        btnIncrease.classList.toggle('disabled', value === max);
    }

    generatePlayerCards() {
        const colors = ["Red", "Blue", "Green", "Yellow", "Black"];

        for (let i = 1; i <= 5; i++) {
            const playerCard = document.createElement('div');
            playerCard.classList.add('game-setup-player-card');

            const titleRow = document.createElement('div');
            titleRow.classList.add('card-row');
            titleRow.textContent = `Card ${i}`;

            const nameRow = document.createElement('div');
            nameRow.classList.add('card-row');

            const nameLabel = document.createElement('label');
            nameLabel.textContent = "Name:";

            const nameInput = document.createElement('input');
            nameInput.type = "text";

            nameRow.append(nameLabel, nameInput);

            const colorRow = document.createElement('div');
            colorRow.classList.add('card-row');

            const colorLabel = document.createElement('label');
            const colorSelectId = `player-color-${i}`;

            colorLabel.textContent = "Color:";
            colorLabel.setAttribute("for", colorSelectId);

            const colorSelect = document.createElement('select');
            colorSelect.name = "colors";
            colorSelect.id = colorSelectId;

            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = "Select color";
            defaultOption.disabled = true;
            defaultOption.selected = true;

            colorSelect.appendChild(defaultOption);

            colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color.toLowerCase();
                option.textContent = color;
                colorSelect.appendChild(option);
            });

            colorRow.append(colorLabel, colorSelect);

            playerCard.append(titleRow, nameRow, colorRow);

            this.playerCardsContainer.appendChild(playerCard);
        }
    }

    syncPlayerCardVisibility() {
        const playerCards = this.playerCardsContainer.querySelectorAll('.game-setup-player-card');

        playerCards.forEach((card, index) => {
            const cardNumber = index + 1;
            card.classList.toggle('hidden', cardNumber > gameConfig.numOfPlayers);
        });
    }

    updateColorAvailability() {
        const visibleSelects = this.playerCardsContainer.querySelectorAll('.game-setup-player-card:not(.hidden) select');
        const takenColors = [];

        visibleSelects.forEach(select => {
            if (select.value !== "") takenColors.push(select.value);
        });

        const allSelects = this.playerCardsContainer.querySelectorAll('select');

        allSelects.forEach(select => {
            const isHidden = select.closest('.game-setup-player-card').classList.contains('hidden');

            if (isHidden && takenColors.includes(select.value)) {
                select.value = "";
            }

            const options = select.querySelectorAll('option');

            options.forEach(option => {
                if (option.value === "") return;

                option.disabled = takenColors.includes(option.value) && option.value !== select.value;
            });
        });
    }
}