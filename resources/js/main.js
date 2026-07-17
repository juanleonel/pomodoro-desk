import { APP_CONSTANTS } from './app.constants.js';
import { PrecisionTimer } from './precision-timer.js';

const DEFAULT_START_TIME = (25 * 60 * 1000);
const DEFAULT_BREACK_TIME = (5 * 60 * 1000);
const POMODORO_TIME_OUT = 1000;
const COLON = ':';
const START_LABEL = 'Start';
const PAUSE_LABEL = 'Pause';
const ZERO_STRING = '0';
const ZERO = 0;

const MODES = {
    BREAK: 'BREAK',
    POMODORO: 'POMODORO'
}

let mode = 'POMODORO';

const timer = new PrecisionTimer(DEFAULT_START_TIME);
timer.setSelectorToDisplay('timerDisplay');
Neutralino.init();

function handleStartOrPause(cont) {
    if (!timer.isRunning) {
        timer.start();
        cont.textContent = PAUSE_LABEL;
    } else {
        timer.pause();
        cont.textContent = START_LABEL;
    }

}

function resetTimer() {
    timer.reset();
    document.getElementById('start-button').textContent = START_LABEL;
}


function setAsPomodoro(context) {
    if (mode == MODES.POMODORO) {
        return;
    }

    if (mode == MODES.BREAK) {
        mode = MODES.POMODORO;
    }
    toggleButtonAsActive('btn-initial-break', context);
    resetTimer(context);
    timer.setDuration(DEFAULT_START_TIME)
    document.getElementById('start-button').textContent = START_LABEL;
    console.log(timer.duration)
}

function setAsBreak(context) {
    if (mode == MODES.BREAK) {
        return;
    }

    if (mode == MODES.POMODORO) {
        mode = MODES.BREAK
    }
    toggleButtonAsActive('btn-initial-focus', context);
    resetTimer(context);
    timer.setDuration(DEFAULT_BREACK_TIME);
    document.getElementById('start-button').textContent = START_LABEL;
    console.log(timer.duration)
}

function toggleButtonAsActive(idButton, context) {
    context.classList.toggle('active');
    const button = document.getElementById(idButton);
    button.classList.toggle('active');
}

function initDialogInfo() {
    document.getElementById('modal-title').textContent = APP_CONSTANTS.APP_NAME;
    document.getElementById('app-version').textContent = APP_CONSTANTS.VERSION;
    document.getElementById('app-desc').textContent = APP_CONSTANTS.DESCRIPTION;
    document.getElementById('app-developer').textContent = 'Desarrollado por';
    document.getElementById('app-user').textContent = APP_CONSTANTS.USER;
    document.getElementById('app-repository').textContent = APP_CONSTANTS.REPOSITORY;
}

window.addEventListener('beforeunload', () => {
    if (timer) {
        timer.destroy();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initDialogInfo();
    const modal = document.getElementById('about-modal');
    const openBtn = document.getElementById('btn-open-about');
    const closeBtns = modal.querySelectorAll('.js-close-modal, .btn-close');

    function openModal() {
        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
        setTimeout(() => modal.querySelector('.btn-close')?.focus(), 100);
    }

    function closeModal() {
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        openBtn?.focus();
    }

    openBtn?.addEventListener('click', openModal);
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
            closeModal();
        }
    });
});

window.resetTimer = resetTimer;
window.setAsBreak = setAsBreak;
window.setAsPomodoro = setAsPomodoro;
window.handleStartOrPause = handleStartOrPause;
