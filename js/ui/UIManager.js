import ScreenManager from './ScreenManager.js';
import DialogManager from './DialogManager.js';

export default class UIManager {
    constructor() {
        this.screenManager = new ScreenManager();
        this.dialogManager = new DialogManager();

        document.addEventListener('request-dialog', (event) => {
            this.dialogManager.openDialog(event.detail.dialog);
        });
    }
}