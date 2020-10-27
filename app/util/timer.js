'use strict';


class CTimer {
    /**
     * 
     * @param {function} callback 
     * @param {number} interval ms
     */
    constructor(callback, interval) {
        this.state = 0;//0-stop 1-runing 2-pause 
        this.callback = callback;
        this.interval = interval;
        this.start();
    }

    start() {
        if (this.state !== 1) {
            this.timer = setInterval(this.callback, this.interval);
            this.state = 1;
        }
    }

    pause() {
        if (this.state === 1) {
            clearInterval(this.timer);
            this.state = 2;
        }
    }

    resume() {
        if (this.state === 2) {
            this.start();
        }
    }

    stop() {
        if (this.state !== 0) {
            clearInterval(this.timer);
            this.state = 0;
        }
    }

    isStop() {
        return (this.state === 0);
    }

    isRuning() {
        return (this.state === 1);
    }

    isPaused() {
        return (this.state === 2);
    }
}

module.exports = CTimer;