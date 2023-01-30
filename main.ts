import './style.css';
import p5, { Color, Vector } from "p5";
import Grid from './Grid';
import Snake from './Snake';
import Apple from './Apple';

const app = document.getElementById("app");
const height = 400;
const width = 400;

const walled = false;
const grid = new Grid(height, width, 10);
let snakes: Snake[];

let bestSnake: Snake;
// let snake: Snake;
const snakeCount = 100;

// let apple = new Apple(grid.gridSize);
let apples = new Array(snakeCount).fill(0).map(s => new Apple(grid.gridSize));

if (app) {

  new p5(function (p: p5) {


    p.setup = function () {

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
  grid.draw(p);
}
function reload(p: p5) {
  snakes = new Array(snakeCount).fill(0).map(s => new Snake(randomColor(p)));
  bestSnake = snakes[0];
  snakes[0].isBestSnake = true;
  let savedBrain = localStorage.getItem("bestSnake");
  if (savedBrain) {
    bestSnake.brain = JSON.parse(savedBrain);
  }
}


function randomColor(p: p5) {
  return p.color(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), 100);
}

function save() {
  localStorage.setItem("bestSnake", JSON.stringify(bestSnake.brain));
}