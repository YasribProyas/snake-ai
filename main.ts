import './style.css';
import p5, { Color, Vector } from "p5";
import Grid from './Grid';
import Snake from './Snake';
import Apple from './Apple';
import NeuralNetwork from './NeuralNetwork';

const app = document.getElementById("app");
const height = 400;
const width = 400;

const walled = false;
const grid = new Grid(height, width, 10);
let snakes: Snake[];

let bestSnake: Snake;
// let snake: Snake;
const snakeCount = 200;

// let apple = new Apple(grid.gridSize);
let apples = new Array(snakeCount).fill(0).map(s => new Apple(grid.gridSize));

if (app) {

  new p5(function (p: p5) {


    p.setup = function () {
      p.lerp
      p.createCanvas(height, width);
      // p.createCanvas(height + 100, width + 100);
      // p.frameRate(2);
      p.frameRate(10);
      // p.colorMode(p.RGB);
      refresh(p);
      // snakes = new Array(10).fill(new Snake(p.color(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), 100)));
      reload(p);


      let saveBtn = p.createButton("save best snake").mouseClicked(save);
    }




    p.draw = function () {
      refresh(p);
      // console.log(snakes);

      snakes.forEach((snake, si) => {

        if (snake.head.position.equals(apples[si].position)) {
          snake.eat();
          apples[si] = new Apple(grid.gridSize);

          let newBestSnake = snakes.reduce((pv, cv, ci) => {
            if (pv.body.length > cv.body.length) return pv;
            return cv;
          });
          if (newBestSnake != bestSnake) {
            if (bestSnake) bestSnake.isBestSnake = false;
            bestSnake = newBestSnake;
            bestSnake.isBestSnake = true;
          }
        }

        snake.draw(p);
        if (!snake.dead) {
          // #region snakeWall
          if (snake.head.position.x >= grid.gridSize.x) {
            if (walled) snake.die();
            else { snake.head.position.x = 0; }
          }
          else if (snake.head.position.x < 0) {
            if (walled) snake.die();
            else
              snake.head.position.x = grid.gridSize.x - 1
          };
          if (snake.head.position.y >= grid.gridSize.y) {
            if (walled) snake.die();
            else
              snake.head.position.y = 0;
          }
          else if (snake.head.position.y < 0) {
            if (walled) snake.die();
            else
              snake.head.position.y = grid.gridSize.y - 1;
          }
          // #endregion snakeWall
          snake.update(apples[si], grid.gridSize);
          apples[si].draw(p);
        }

        // if (bestSnake)
        //   bestSnake.color = p.color(255, 0, 0, 255);
      });

    }

    // p.mouseClicked = function () {
    //   if (p.isLooping()) {
    //     p.noLoop();
    //   } else {
    //     p.loop();
    //   }
    // }

    p.keyPressed = function () {
      switch (p.keyCode) {
        // case p.UP_ARROW:
        //   snake.directionQueue = new Vector(0, -1);
        //   break;

        // case p.RIGHT_ARROW:
        //   snake.directionQueue = new Vector(1, 0);
        //   break;

        // case p.DOWN_ARROW:
        //   snake.directionQueue = new Vector(0, 1);
        //   break;

        // case p.LEFT_ARROW:
        //   snake.directionQueue = new Vector(-1, 0);
        //   break;

        case p.ENTER:
          if (p.isLooping()) {
            p.noLoop();
          } else {
            p.loop();
          }
          break;
        case p.BACKSPACE:
          // snake = new Snake(randomColor(p));
          // snakes = new Array(10).fill(new Snake(p.color(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), 100)));
          // snakes = new Array(snakeCount).fill(0).map(s => new Snake(randomColor(p)));
          reload(p);

          break;
        default:
          break;
      }

    }

  }, app);

}

function refresh(p: p5) {
  p.clear(0, 0, 0, 0);
  // p.background(p.color(255));
  // grid.draw(p);
}
function reload(p: p5) {
  snakes = new Array(snakeCount).fill(0).map(s => new Snake(randomColor(p)));
  bestSnake = snakes[0];
  snakes[0].isBestSnake = true;
  let savedBrain = JSON.parse(localStorage.getItem("bestSnake") || "null");
  if (savedBrain) {
    // bestSnake.brain = JSON.parse(savedBrain);
    snakes.map((snake, i) => {
      if (i != 0) NeuralNetwork.mutate(snake.brain, 0.2);
      return snake.brain = savedBrain;
    });
  }
}


function randomColor(p: p5) {
  return p.color(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), 100);
}

function save() {
  localStorage.setItem("bestSnake", JSON.stringify(bestSnake.brain));
}

/*
{"levels":[{"inputCount":2,"outputCount":6,"inputs":[0.12374368670764581,0.21213203435596426],"outputs":[0,0,0,1,0,0],"biases":[0.5497808812925364,0.004504958846176521,0.3277404152318084,-0.2538024271942452,0.28552945236246385,0.6344857609145391],"weights":[[0.3783707859829639,0.3003857387055162,0.7950038796983954,-0.571275124959572,0.7904799487905758,-0.34397041777753623],[0.7672150925607855,-0.5211707236930692,0.6638732063874793,0.47798951399905265,0.09712979730656013,-0.15263524911245918]]},{"inputCount":6,"outputCount":4,"inputs":[0,0,0,1,0,0],"outputs":[0,1,0,0],"biases":[0.18853345844360403,-0.8191933882937779,-0.3523345311277426,-0.2873003194271644],"weights":[[0.34768673146816775,0.5328771411560123,0.21481202896187712,0.8729318836401552],[0.34817834974068385,-0.25928804475314404,0.2807031438599106,-0.8468644779923413],[0.7390516837422694,-0.749477642523908,0.03532730979268761,-0.13814478109428574],[0.04692278507438319,0.9180116931157936,-0.45859236382202884,-0.8502374553117509],[-0.4009122599038597,-0.26549029209936315,0.5486352039266484,-0.8497010366938218],[-0.6161580345196294,-0.3375965442211397,-0.36223287480809097,-0.17143262978963536]]}]}
*/