export default class TitleScreen {
    #screenId;

    constructor() {
        this.screen = document.querySelector('#screen-title');
        this.screenId = this.screen.id;
        this.btnPlay = this.screen.querySelector('.btn-play');
        this.btnHowToPlay = this.screen.querySelector('.btn-how-to-play');
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
}