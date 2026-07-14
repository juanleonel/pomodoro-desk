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
  postMessage({ type: 'TICK', remainingMs });
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
      postMessage({ type: 'COMPLETE', remainingMs: 0 });
    }
  }, 100);
}

self.onmessage = (event) => {
  const { command, payload } = event.data || {};

  switch (command) {
    case 'SET_DURATION':
      duration = payload?.duration ?? 0;
      remainingMs = duration;
      stopTimer();
      isRunning = false;
      postMessage({ type: 'RESET', remainingMs });
      break;

    case 'START':
      if (remainingMs <= 0) {
        remainingMs = duration;
      }
      startTimer();
      break;

    case 'PAUSE':
      stopTimer();
      isRunning = false;
      postMessage({ type: 'PAUSED', remainingMs });
      break;

    case 'RESET':
      stopTimer();
      isRunning = false;
      remainingMs = duration;
      postMessage({ type: 'RESET', remainingMs });
      break;
  }
};
