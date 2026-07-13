const DEFAULT_START_TIME = 25;
const DEFAULT_BREACK_TIME = 5;
const DEFAULT_BREACK_LONG_TIME = 15;
const POMODORO_TIME_OUT = 1000;
const COLON = ':';
const START_LABEL = 'Start';
const PAUSE_LABEL = 'Pause';
const ZERO_STRING = '0'
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

const timerDisplay = document.getElementById('timerDisplay');

Neutralino.init();

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('about-modal');
    const openBtn = document.getElementById('btn-open-about'); // Tu botón trigger
    const closeBtns = modal.querySelectorAll('.js-close-modal, .btn-close');

    // Abrir modal
    function openModal() {
        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
        // Opcional: enfocar el botón de cerrar para accesibilidad
        setTimeout(() => modal.querySelector('.btn-close')?.focus(), 100);
    }

    // Cerrar modal
    function closeModal() {
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
        // Devolver foco al botón que lo abrió (mejora UX)
        openBtn?.focus();
    }

    // Event Listeners
    openBtn?.addEventListener('click', openModal);
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Cerrar al hacer clic en el fondo oscuro
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
            closeModal();
        }
    });
});

function setAsPomodoro(context) {
    if (mode == MODES.POMODORO) {
        return;
    }

    if (mode == MODES.BREAK) {
        mode = MODES.POMODORO;
    }
    toggleButtonAsActive('btn-initial-break', context);
    resetTimer(context);
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
}

function toggleButtonAsActive(idButton, context) {
    context.classList.toggle('active');
    const button = document.getElementById(idButton);
    button.classList.toggle('active');
}

function displayTime() {
    let minutes = Math.floor(timerMinutes);
    let seconds = timerSeconds < 10 ? ZERO_STRING + timerSeconds : timerSeconds;
    timerDisplay.textContent = minutes + COLON + seconds;
}

function handleStartOrPause(context) {
    if (!isSelected) {
        startTimer(context);
        isSelected = true;
        context.textContent = PAUSE_LABEL;
    } else if (isSelected) {
        isSelected = false;
        pauseTimer(context);
        context.textContent = START_LABEL
    }
}

function startTimer(context) {
    clearInterval(intervalId);
    timerMinutes = getInitialValuesMode().timerMinutes; // timerMinutesTemp ? timerMinutesTemp : DEFAULT_START_TIME;
    timerSeconds = getInitialValuesMode().timerSeconds; //timerSecondsTemp ? timerSecondsTemp : ZERO;
    console.log(timerMinutes, timerSeconds)
    displayTime();
    intervalId = setInterval(() => {
        if (timerMinutes === ZERO && timerSeconds === ZERO) {
            clearInterval(intervalId);
            alert('Time\'s up! Take a break.');
            resetTimer();
        } else {
            timerSeconds--;
            if (timerSeconds < ZERO) {
                timerSeconds = 59;
                timerMinutes--;
            }
            displayTime();
        }
    }, POMODORO_TIME_OUT);
}

function pauseTimer(context) {
    timerMinutesTemp = timerMinutes;
    timerSecondsTemp = timerSeconds;
    clearInterval(intervalId);
}

function resetTimer(context) {
    clearInterval(intervalId);
    timerMinutes = ZERO;
    timerSeconds = ZERO;
    timerSecondsTemp = null;
    timerMinutesTemp = null;
    displayTime();

    if (isSelected) {
        const button = document.getElementById('start-button');

        if (button?.textContent == PAUSE_LABEL) {
            button.textContent = START_LABEL;
        }
    }
    isSelected = false;
}

function getInitialValuesMode() {
    if (mode == MODES.POMODORO) {
        const timerMinutesValue = timerMinutesTemp ?? DEFAULT_START_TIME;
        const timerSecondsValue = timerSecondsTemp ?? ZERO;

        return {
            timerMinutes: timerMinutesValue,
            timerSeconds: timerSecondsValue
        }
    }

    return {
        timerMinutes: timerMinutesTemp ?? DEFAULT_BREACK_TIME,
        timerSeconds: timerSecondsTemp ?? ZERO
    }
}
