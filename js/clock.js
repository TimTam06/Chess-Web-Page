export class Clock {
    constructor(time, increment) {
        this.duration = time * 60000;      // minutes → ms
        this.increment = increment * 1000; // seconds → ms

        this.timeRemaining = this.duration;
        this.timer = null;
        this.startTime = null;
    }

    startTimer() {
        this.startTime = Date.now();

        this.timer = setInterval(() => {this.remove1step()}, 250);
    }

    stopTimer() {
        clearInterval(this.timer);
        this.timer = null;
        this.timeRemaining += this.increment
    }

    remove1step() {
        const elapsed = Date.now() - this.startTime;

        this.timeRemaining = Math.max(0, this.duration - elapsed);

        if (this.timeRemaining === 0) {
            this.stopTimer();
        }

        console.log(this.getTime())
    }

    getTime() {
        const minutes = Math.floor(this.timeRemaining / 60000);
        const seconds = Math.floor(this.timeRemaining / 1000) % 60;

        return [minutes, seconds];
    }
}