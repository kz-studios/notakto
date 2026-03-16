export default class UIManager {
    constructor() {
        const btnHowToPlay = document.querySelector('#btn-how-to-play');
        const dlgHowToPlay = document.querySelector('#dialog-how-to-play');
        const btnCloseHowToPlayDlg = document.querySelector('#btn-close-how-to-play');

        btnHowToPlay.addEventListener('click', () => {
            dlgHowToPlay.showModal();
        })

        btnCloseHowToPlayDlg.addEventListener('click', () => {
            dlgHowToPlay.close();
        })
    }
}