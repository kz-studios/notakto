import HowToPlay from './dialogs/HowToPlay.js';

export default class DialogManager {
    constructor() {
        this.dlgHowToPlay = new HowToPlay();
    }

    openDialog(dialogId) {
        if (dialogId === 'how-to-play') {
            this.dlgHowToPlay.openDialog();
        }
        // TODO: Add more dialog events
    }
}