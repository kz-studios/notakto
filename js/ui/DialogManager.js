import HowToPlay from './dialogs/HowToPlay.js';
import PauseMenu from './dialogs/PauseMenu.js';

export default class DialogManager {
    constructor() {
        this.dlgHowToPlay = new HowToPlay();
        this.dlgPauseMenu = new PauseMenu();
    }

    openDialog(dialogId) {
        if (dialogId === 'how-to-play') {
            this.dlgHowToPlay.openDialog();
        } else if (dialogId === 'pause-menu') {
            this.dlgPauseMenu.openDialog();
        }
        // TODO: Add more dialog events
    }
}