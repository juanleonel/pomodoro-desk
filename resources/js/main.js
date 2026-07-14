import { PrecisionTimer } from "./precision-timer.js";

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

let timerMinutes = 0;
let timerSeconds = 0;
let intervalId;
let isSelected = false;
let mode = 'POMODORO';
let timerMinutesTemp = null;
let timerSecondsTemp = null;

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

// Al final de main.js o donde inicialices la app
window.addEventListener('beforeunload', () => {
    if (timer) {
        timer.destroy();
    }
});


// document.addEventListener('DOMContentLoaded', () => {
//     const modal = document.getElementById('about-modal');
//     const openBtn = document.getElementById('btn-open-about'); // Tu botón trigger
//     const closeBtns = modal.querySelectorAll('.js-close-modal, .btn-close');

//     // Abrir modal
//     function openModal() {
//         modal.classList.add('is-visible');
//         modal.setAttribute('aria-hidden', 'false');
//         // Opcional: enfocar el botón de cerrar para accesibilidad
//         setTimeout(() => modal.querySelector('.btn-close')?.focus(), 100);
//     }

//     // Cerrar modal
//     function closeModal() {
//         modal.classList.remove('is-visible');
//         modal.setAttribute('aria-hidden', 'true');
//         // Devolver foco al botón que lo abrió (mejora UX)
//         openBtn?.focus();
//     }

//     // Event Listeners
//     openBtn?.addEventListener('click', openModal);
    
//     closeBtns.forEach(btn => {
//         btn.addEventListener('click', closeModal);
//     });

//     // Cerrar al hacer clic en el fondo oscuro
//     modal.addEventListener('click', (e) => {
//         if (e.target === modal) closeModal();
//     });

//     // Cerrar con tecla Escape
//     document.addEventListener('keydown', (e) => {
//         if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
//             closeModal();
//         }
//     });
// });


window.resetTimer = resetTimer;
window.setAsBreak = setAsBreak;
window.setAsPomodoro = setAsPomodoro;
window.handleStartOrPause = handleStartOrPause;
