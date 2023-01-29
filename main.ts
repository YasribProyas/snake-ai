import './style.css';
import p5, { Color, Vector } from "p5";
import Grid from './Grid';
import Snake from './Snake';
import Apple from './Apple';

const app = document.getElementById("app");
const height = 400;
const width = 400;

const walled = true;
const grid = new Grid(height, width, 10);
const snake = new Snake();

let apple = new Apple(grid.gridSize);

if (app) {

  new p5(function (p: p5) {


    p.setup = function () {

      p.createCanvas(height, width);
      // p.frameRate(2);
      p.frameRate(10);

      refresh(p);

    }

    p.draw = function () {
      refresh(p);
      apple.draw(p);


      if (snake.head.position.equals(apple.position)) {
        snake.eat();
        apple = new Apple(grid.gridSize);
      }

      if (!snake.dead) {
        // #region snakeWall
        if (snake.head.position.x >= grid.gridSize.x) {
          if (walled) snake.die();
          else { snake.head.position.x = 0; }
        }
        else if (snake.head.position.x < 0) {
          if (walled) snake.die();
          snake.head.position.x = grid.gridSize.x
        };
        if (snake.head.position.y >= grid.gridSize.y) {
          if (walled) snake.die();
          snake.head.position.y = 0;
        }
        else if (snake.head.position.y < 0) {
          if (walled) snake.die();
          snake.head.position.y = grid.gridSize.y;
        }
        // #endregion snakeWall
        snake.update();
      }

      snake.draw(p);

    }

    p.mouseClicked = function () {
      if (p.isLooping()) {
        p.noLoop();
      } else {
        p.loop();
      }
    }

    p.keyPressed = function () {
      switch (p.keyCode) {
        case p.UP_ARROW:
          snake.directionQueue = new Vector(0, -1);
          break;

        case p.RIGHT_ARROW:
          snake.directionQueue = new Vector(1, 0);
          break;

        case p.DOWN_ARROW:
          snake.directionQueue = new Vector(0, 1);
          break;

        case p.LEFT_ARROW:
          snake.directionQueue = new Vector(-1, 0);
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