export default class PauseMenu {
    constructor() {
        this.dialogEl = document.querySelector('#dialog-pause-menu');
        this.btnContinueGame = this.dialogEl.querySelector('#btn-continue-game');
        this.btnHowToPlay = this.dialogEl.querySelector('#btn-how-to-play-pause-menu-dialog');
        this.btnExitToGameSetup = this.dialogEl.querySelector('#btn-exit-to-game-setup-screen');
        this.btnClose = this.dialogEl.querySelector('#btn-close-pause-menu-dialog');

        this.btnContinueGame.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('resume-timer', {
                bubbles: true
            }))
            this.closeDialog();
        })
    }

    openDialog() {
        this.dialogEl.showModal();
    }

    closeDialog() {
        this.dialogEl.close();
    }
}