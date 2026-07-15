const WORKER_CONSTANTS = {
  START: 'START',
  TICK: 'TICK',
  TIMER: 'TIMER',
  COMPLETE: 'COMPLETE',
  PAUSE: 'PAUSE',
  PAUSED: 'PAUSED',
  RESET: 'RESET',
  SET_DURATION: 'SET_DURATION'
};

let intervalId = null;
let isRunning = false;
let duration = 0;
let remainingMs = 0;
let lastTickAt = 0;

function stopTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function emitTick() {
  postMessage({ type: WORKER_CONSTANTS.TICK, remainingMs });
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  lastTickAt = performance.now();

  intervalId = setInterval(() => {
    const now = performance.now();
    const elapsed = now - lastTickAt;
    lastTickAt = now;
    remainingMs = Math.max(0, remainingMs - elapsed);
    emitTick();

    if (remainingMs <= 0) {
      stopTimer();
      isRunning = false;
      postMessage({ type: WORKER_CONSTANTS.COMPLETE, remainingMs: 0 });
    }
  }, 100);
}

self.onmessage = (event) => {
  const { command, payload } = event.data || {};

  switch (command) {
    case WORKER_CONSTANTS.SET_DURATION:
      duration = payload?.duration ?? 0;
      remainingMs = duration;
      stopTimer();
      isRunning = false;
      postMessage({ type: WORKER_CONSTANTS.RESET, remainingMs });
      break;

    case WORKER_CONSTANTS.START:
      if (remainingMs <= 0) {
        remainingMs = duration;
      }
      startTimer();
      break;

    case WORKER_CONSTANTS.PAUSE:
      stopTimer();
      isRunning = false;
      postMessage({ type: WORKER_CONSTANTS.PAUSED, remainingMs });
      break;

    case WORKER_CONSTANTS.RESET:
      stopTimer();
      isRunning = false;
      remainingMs = duration;
      postMessage({ type: WORKER_CONSTANTS.RESET, remainingMs });
      break;
  }
};
