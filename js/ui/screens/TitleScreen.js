export default class TitleScreen {
    #screenId;

    constructor() {
        this.screen = document.querySelector('#screen-title');
        this.screenId = this.screen.id;
        this.btnPlay = this.screen.querySelector('#btn-play-title-screen');
        this.btnHowToPlay = this.screen.querySelector('#btn-how-to-play-title-screen');

        this.btnPlay.addEventListener('click', () => {
            this.screen.dispatchEvent(new CustomEvent('request-navigation', { 
                detail: { target: 'screen-game-setup' } 
            }));
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
}