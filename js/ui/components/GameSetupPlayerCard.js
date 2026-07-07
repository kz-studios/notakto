export default class GameSetupPlayerCard {
    #isHidden

    constructor(playerIndex) {
        const template = document.querySelector('#game-setup-player-card-template');
        const clone = template.content.cloneNode(true);

        this.#isHidden = false;

        this.card = clone.querySelector('.game-setup-player-card');
        this.card.id = `game-setup-player-card-${playerIndex}`;
        this.fieldsContainer = this.card.querySelector('.game-setup-player-card-fields-container');
        this.cardTitle = this.fieldsContainer.querySelector('.game-setup-player-card-title');
        this.cardTitle.innerText = `Player ${playerIndex}`;
        this.nameInputField = this.fieldsContainer.querySelector('input');
        this.colorSelectField = this.fieldsContainer.querySelector('select');
        this.leftButton = this.card.querySelector('.game-setup-player-card-left-btn');
        this.rightButton = this.card.querySelector('.game-setup-player-card-right-btn');

        this.leftButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            this.#requestMove('left');
        });

        this.rightButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.#requestMove('right');
        });
    }

    #requestMove(direction) {
        const moveEvent = new CustomEvent('card-move-request', {
            bubbles: true,
            detail: {
                direction: direction,
                cardElement: this.card 
            }
        });
        
        this.card.dispatchEvent(moveEvent);
    }

    getNameInput() {
        const nameInputValue = this.nameInputField.value;
        return nameInputValue;
    }

    getSelectedColor() {
        const selectedColor = this.colorSelectField.value;
        return selectedColor;
    }

    get isHidden() {
        return this.#isHidden;
    }

    setHidden(isHidden) {
        this.#isHidden = isHidden;
        this.card.classList.toggle('hidden', isHidden);

        this.nameInputField.disabled = isHidden;
        this.colorSelectField.disabled = isHidden;
    }

    disableTakenColors(takenColorsArray) {
        if (this.isHidden && takenColorsArray.includes(this.getSelectedColor())) {
            this.colorSelectField.value = "";
        }

        for (const option of this.colorSelectField.options) {
            if (option.value === "") continue; 

            const isTaken = takenColorsArray.includes(option.value);
            const isNotMine = option.value !== this.getSelectedColor();
            
            option.disabled = isTaken && isNotMine;
        }
    }

    setMoveLeftDisabled(isDisabled) {
        this.leftButton.disabled = isDisabled;
    }

    setMoveRightDisabled(isDisabled) {
        this.rightButton.disabled = isDisabled;
    }
}