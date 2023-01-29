import p5, { Color, Vector } from "p5";
import Apple from "./Apple";
import NeuralNetwork from "./NeuralNetwork";

export class SnakeBody {
    bodySize: number;
    position: Vector;

    constructor(position: Vector, bodySize: number = 10) {
        this.bodySize = bodySize;
        this.position = position;
    }
    draw(p: p5) {
        // p.fill(0, 0, 0, 255);
        p.rect(this.position.x * this.bodySize, this.position.y * this.bodySize, this.bodySize, this.bodySize);
    }
}

export default class Snake {
    length: number;
    bodySize: number;
    body: SnakeBody[];
    direction: Vector;
    directionQueue: Vector | null;
    dead: boolean;
    brain: NeuralNetwork;
    color: Color;
    constructor(color: Color, length: number = 3, bodySize: number = 10) {
        this.length = length;
        this.bodySize = bodySize;
        this.body =
            Array(length)
                .fill(0)
                .map((sb, i) => new SnakeBody(new Vector(0 - i, 0)), bodySize);

        this.direction = new Vector(1, 0);
        this.directionQueue = null;
        this.dead = false;
        this.brain = new NeuralNetwork([2, 6, 4]);
        this.color = color;
    }

    public get head(): SnakeBody {
        return this.body[0];
    }


    update(apple: Apple, gridSize: Vector) {

        const distance = [
            Math.abs((apple.position.x - this.head.position.x) / gridSize.mag()),
            Math.abs((apple.position.y - this.head.position.y) / gridSize.mag()),
        ];
        //up-down-left-right
        const outputs = NeuralNetwork.feedForward(distance, this.brain);
        this.directionQueue = new Vector(outputs[3] - outputs[2], outputs[1] - outputs[0]);
        // console.log(outputs, this.directionQueue);

        if (this.directionQueue && this.directionQueue.mag() != 0) {
            if (this.direction.dot(this.directionQueue) == 0) {
                this.direction = this.directionQueue;
            }
            this.directionQueue = null;
        }

        let lastPos = Object.assign(new Vector(), this.body[0].position);

        this.head.position.add(this.direction);

        // console.log(lastPos, this.body[0].position);

        this.body.filter((sb, i) => i > 0).forEach(sb => {

            if (sb.position.equals(this.head.position)) this.die();
            // console.log(sb.position, this.head.position);


            let tlpos = Object.assign(new Vector(), sb.position);
            sb.position = Object.assign(new Vector(), lastPos);
            lastPos = tlpos;
        });
    }

    draw(p: p5) {
        // this.color = p.color(255, 204, 0);
        p.fill(this.color);
        this.body.forEach(sb => {
            sb.draw(p);
        });
    }

    eat() {
        this.body.push(new SnakeBody(this.body[this.length - 1].position, this.bodySize))
        this.length = this.body.length;
    }

    die() {
        console.log("dead");
        this.dead = true;

        this.update = () => { };
    }
}


