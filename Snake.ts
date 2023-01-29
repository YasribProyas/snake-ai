import p5, { Vector } from "p5";

export class SnakeBody {
    bodySize: number;
    position: Vector;

    constructor(position: Vector, bodySize: number = 10) {
        this.bodySize = bodySize;
        this.position = position;
    }
    draw(p: p5) {
        p.fill(0, 0, 0, 255);
        p.rect(this.position.x * this.bodySize, this.position.y * this.bodySize, this.bodySize, this.bodySize);
    }
}

export default class Snake {
    length: number;
    bodySize: number;
    body: SnakeBody[];
    direction: Vector;
    directionQueue: Vector | null;

    constructor(length: number = 3, bodySize: number = 10) {
        this.length = length;
        this.bodySize = bodySize;
        this.body =
            Array(length)
                .fill(0)
                .map((sb, i) => new SnakeBody(new Vector(i, 0)), bodySize);

        this.direction = new Vector(1, 0);
        this.directionQueue = null;
    }

    public get head(): SnakeBody {
        return this.body[0];
    }


    update() {

        if (this.directionQueue) {
            if (this.direction.dot(this.directionQueue) == 0) {
                this.direction = this.directionQueue;
            }
            this.directionQueue = null;
        }

        let lastPos = Object.assign(new Vector(), this.body[0].position);

        this.head.position.add(this.direction);

        // console.log(lastPos, this.body[0].position);

        this.body.filter((sb, i) => i > 0).forEach(sb => {
            let tlpos = Object.assign(new Vector(), sb.position);
            sb.position = Object.assign(new Vector(), lastPos);
            lastPos = tlpos;
        });
    }

    draw(p: p5) {
        this.body.forEach(sb => {
            sb.draw(p);
        });
    }

    eat() {
        this.body.push(new SnakeBody(this.body[this.length - 1].position, this.bodySize))
        this.length = this.body.length;
    }

}


