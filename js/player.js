import { Clock } from "./clock.js"; 

export class Player {
    constructor(color) {
        this.color = color;
        this.clock = new Clock(1, 0)
    }
}