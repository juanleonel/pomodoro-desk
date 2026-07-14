import { POMODORO_COMMANDS, WORKER_CONSTANTS } from './app.constants.js'

export class PrecisionTimer {
  constructor(durationMs) {
    this.init(durationMs)
  }

  init(durationMs) {
    this.duration = durationMs;
    this.worker = new Worker(new URL('./timer.worker.js', import.meta.url));
    this.isRunning = false;

    this.worker.onmessage = (event) => {
      const { type, remainingMs } = event.data;

      switch(type) {
        case WORKER_CONSTANTS.TICK:
          this._renderTime(remainingMs);
          break;
        case WORKER_CONSTANTS.COMPLETE:
          this.isRunning = false;
          this._onComplete();
          break;
        case WORKER_CONSTANTS.PAUSED:
          this.isRunning = false;
          break;
        case WORKER_CONSTANTS.RESET:
          this.isRunning = false;
          this._renderTime(this.duration);
          break;
      }
    };

    this._updateDuration(durationMs)
  }

  setDuration(durationMs) {
    this.duration = durationMs;
    this._updateDuration(durationMs);
  }

  setSelectorToDisplay(identifier) {
    this.selector = identifier;
  }

  start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.worker.postMessage({ command: POMODORO_COMMANDS.START });
  }

  pause() {
    if (!this.isRunning) {
      return;
    }
    this.worker.postMessage({ command: POMODORO_COMMANDS.PAUSE });
  }

  reset() {
    this.worker.postMessage({ command: POMODORO_COMMANDS.RESET });
  }

  getMinutesAndSecondsAsString(miliseconds) {
    const totalSeconds = Math.ceil(miliseconds / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');

    return {
      minutes,
      seconds
    }
  }

  _renderTime(ms) {
    const { minutes, seconds } = this.getMinutesAndSecondsAsString(ms);
    const display = document.getElementById(this.selector);

    if (display) {
      display.textContent = `${minutes}:${seconds}`;
    }
  }

  _onComplete() {
    if (window.neu?.os) {
      window.neu.os.showNotification('Tiempo terminado!', 'Sesión Pomodoro completada.');
    }
    console.log('temporizador finalizado');
  }

  _updateDuration(durationMs) {
    this.worker.postMessage({
      command: WORKER_CONSTANTS.SET_DURATION,
      payload: { duration: durationMs }
    });
  }

  destroy() {
    this.worker.terminate();
  }
}
