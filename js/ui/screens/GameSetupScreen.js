import gameEngine from '../../core/GameEngine.js'
import gameConfig from '../../core/GameConfig.js'
import PlayerCard from '../components/GameSetupPlayerCard.js';
import Player from '../../core/Player.js';

export default class GameSetupScreen {
    #screenId;

    constructor() {
        this.screen = document.querySelector('#screen-game-setup');
        this.screenId = this.screen.id;
        this.settingsForm = this.screen.querySelector('#screen-game-setup-settings-container');
        this.gameSettingsContainer = this.settingsForm.querySelector('#game-settings-container');
        this.playerCardsContainer = this.settingsForm.querySelector('#player-cards-row-container');
        this.playerCards = [];
        this.controlElements = this.settingsForm.querySelectorAll('.game-settings-option .controls');
        this.chkNoTimeLimit = this.settingsForm.querySelector('#checkbox-game-time-limit');

        this.btnBack = this.screen.querySelector('#btn-back-game-setup-screen');
        this.btnHowToPlay = this.screen.querySelector('#btn-how-to-play-game-setup-screen');
        this.btnStart = this.screen.querySelector('#btn-start-game-setup-screen');

        this.btnBack.addEventListener('click', () => {
            this.screen.dispatchEvent(new CustomEvent('request-navigation', { 
                detail: { target: 'screen-title' } 
            }));
        });

        this.btnHowToPlay.addEventListener('click', () => {
            this.screen.dispatchEvent(new CustomEvent('request-dialog', { 
                detail: { dialog: 'how-to-play' },
                bubbles: true 
            }));
        });

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

        this.playerCardsContainer.addEventListener('card-move-request', (event) => {
            const direction = event.detail.direction;
            const cardElement = event.detail.cardElement;
            let targetCard;
            
            if (direction === 'left') {
                targetCard = cardElement.previousElementSibling;
            } else if (direction === 'right') {
                const next = cardElement.nextElementSibling;
                targetCard = next?.nextElementSibling;
            }

            if (targetCard !== undefined) {
                cardElement.parentNode.insertBefore(cardElement, targetCard);
            }

            const currentPlayerCardsDOMOrder = Array.from(this.playerCardsContainer.children);

            const newlySortedPlayers = currentPlayerCardsDOMOrder.map(domNode => {
                return this.playerCards.find(instance => instance.card === domNode);
            });

            this.playerCards = newlySortedPlayers;
            this.updateMovementControls();
        });

        this.settingsForm.addEventListener('submit', (e) => {
            const visibleCards = this.playerCards.filter(card => !card.isHidden);
            const nameInputs = visibleCards.map(card => card.card.querySelector('.game-setup-player-card-name-field input'));

            this.validateDuplicates(nameInputs);

            if (!this.settingsForm.checkValidity()) {
                e.preventDefault();
                this.settingsForm.reportValidity();
                return;
            }

            e.preventDefault(); 
            gameEngine.registerPlayers(this.queuePlayersToBeRegistered());

            this.screen.dispatchEvent(new CustomEvent('setup-complete'));
        });

        this.settingsForm.addEventListener('input', (event) => {
            if (event.target.matches('.game-setup-player-card-name-field input')) {
                const visibleCards = this.playerCards.filter(card => !card.isHidden);
                const nameInputs = visibleCards.map(card => card.card.querySelector('.game-setup-player-card-name-field input'));
                
                this.validateDuplicates(nameInputs);
            }
        });
    }

    get id() {
        return this.screenId;
    }

    show() {
        this.screen.classList.replace('hidden', 'active');
    }

    hide() {
        this.screen.classList.replace('active', 'hidden');
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
        for (let i = 1; i <= 5; i++) {
            const playerCard = new PlayerCard(i);
            this.playerCards.push(playerCard);
            this.playerCardsContainer.appendChild(playerCard.card);
        }
    }

    syncPlayerCardVisibility() {
        this.playerCards.forEach((card, index) => {
            const cardNumber = index + 1;
            card.setHidden(cardNumber > gameConfig.numOfPlayers);
        })
        this.updateMovementControls();
    }

    updateColorAvailability() {
        const takenColors = this.playerCards
            .filter(card => !card.isHidden && card.getSelectedColor() !== '')
            .map(card => card.getSelectedColor());

        this.playerCards.forEach(card => {
            card.disableTakenColors(takenColors);
        });
    }

    updateMovementControls() {
        const visibleCards = this.playerCards.filter(card => !card.isHidden);
        const firstCard = visibleCards[0];
        const lastCard = visibleCards[visibleCards.length - 1];

        this.playerCards.forEach(card => {
            card.setMoveLeftDisabled(card === firstCard);
            card.setMoveRightDisabled(card === lastCard);
        })
    }

    queuePlayersToBeRegistered() {
        return this.playerCards
            .filter(card => !card.isHidden)
            .map(card => {
                const playerName = card.getNameInput();
                const playerColor = card.getSelectedColor();
                return new Player(playerName, playerColor); 
            })
    }

    validateDuplicates(inputs) {
        const seenNames = new Set();

        inputs.forEach(input => {
            const name = input.value.trim().toLowerCase();
            
            if (name === '') return; 

            if (seenNames.has(name)) {
                input.setCustomValidity("Players can't have same names.");
            } else {
                input.setCustomValidity("");
                seenNames.add(name);
            }
        });
    }
}