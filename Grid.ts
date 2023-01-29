import p5, { Vector } from "p5";

export default class Grid {
    height: number;
    width: number;
    gap: number
    // gridSize: Vector;
    constructor(height: number, width: number, gap: number = 10) {
        this.height = height;
        this.width = width;
        this.gap = gap;
        // this.gridSize = new Vector(
        //     Math.floor(this.gridSize.x / this.gap),
        //     Math.floor(this.gridSize.y / this.gap)
        // )
    }

    public get gridSize(): Vector {
        return new Vector(
            Math.floor(this.width / this.gap),
            Math.floor(this.height / this.gap)
        )
    }

    draw(p: p5) {
        p.stroke(0, 0, 0, 255 * .5);
        for (let x = 0 as number; x <= this.width; x += this.gap) {
            p.line(x, 0, x, this.width);
        }
        for (let y = 0 as number; y <= this.width; y += this.gap) {
            p.line(0, y, this.height, y);
        }
    }
}