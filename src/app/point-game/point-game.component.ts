import {
  afterNextRender,
  afterRender,
  Component,
  effect,
  ElementRef,
  HostListener,
  OnChanges,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

const PIXELS_MOVEMENT = 50;
const POINT_SIZE = 20;
const CONTAINER_SIZE = 500;
const enum AXIS {
  'HORIZONTAL' = 0,
  'VERTICAL' = 1,
}

@Component({
  selector: 'app-point-game',
  standalone: true,
  imports: [],
  template: `
    <h2>
      You have touched the blue dot <strong>{{ score() }}</strong> time(s)!
    </h2>
    <div class="container">
      <div #playingArea class="playing-area">
        <div #point class="point"></div>
        <div #pointToTouch class="point toTouch"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .playing-area {
        flex: 0 0 ${CONTAINER_SIZE}px;
        align-self: center;
        justify-self: center;
        position: relative;
        height: ${CONTAINER_SIZE}px;
        width: ${CONTAINER_SIZE}px;
        border: 1px solid #f9f9fe;
        background: #f0f0f4;
        border-radius: 13px;
      }

      .point {
        height: ${POINT_SIZE}px;
        width: ${POINT_SIZE}px;
        border-radius: 50%;
        position: absolute;
        background: red;
        transition: 0.15s ease-out;
        z-index: 10;
      }

      .toTouch {
        background: blue;
        z-index: 5;
        transition: 0.75s ease-in;
      }
    `,
  ],
})
export class PointGameComponent {
  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent,
  ) {
    switch (event.key) {
      case 'ArrowLeft': // left
        this.moveHorizontal(-PIXELS_MOVEMENT);
        break;
      case 'ArrowUp': // up
        this.moveVertical(-PIXELS_MOVEMENT);
        break;
      case 'ArrowRight': // right
        this.moveHorizontal(PIXELS_MOVEMENT);
        break;
      case 'ArrowDown': // down
        this.moveVertical(PIXELS_MOVEMENT);
        break;
    }
  }
  position = signal<[number, number]>([0, 0]);
  positionPointToTouch = signal<[number, number]>([
    CONTAINER_SIZE - POINT_SIZE,
    CONTAINER_SIZE - POINT_SIZE,
  ]);
  score = signal<number>(0);
  private readonly possiblePositions = new Array(
    CONTAINER_SIZE / PIXELS_MOVEMENT,
  )
    .fill(0)
    .map((v, i) => i * PIXELS_MOVEMENT);
  private readonly possibleX = Array.from(this.possiblePositions);
  private readonly possibleY = Array.from(this.possiblePositions);

  @ViewChild('point', { static: false }) point!: ElementRef;
  @ViewChild('pointToTouch', { static: false }) pointToTouch!: ElementRef;
  @ViewChild('playingArea', { static: false }) playingArea!: ElementRef;
  constructor() {
    afterRender(() => {
      this.drawPoint();
      this.drawPointToTouch();
    });
    afterNextRender(() => {
      this.initBoard();
    });
  }

  moveHorizontal(amount: number) {
    const maxX = this.point.nativeElement.parentNode.clientWidth;
    this.movePoint(AXIS.HORIZONTAL, amount, maxX);
  }
  moveVertical(amount: number) {
    const maxY = this.point.nativeElement.parentNode.clientHeight;
    this.movePoint(AXIS.VERTICAL, amount, maxY);
  }

  private initBoard() {
    this.playingArea.nativeElement.setAttribute(
      'style',
      `border:3px solid #dedede;`,
    );
    const instructions = document.createElement('div');
    instructions.innerHTML =
      '<p style="font-weight: bolder; font-size:1.2rem;">Using your arrow keys, move the red dot to catch the blue one</p>';
    this.playingArea.nativeElement.parentNode.append(instructions);
  }
  private movePoint(axis: number, amount: number, maxAxisPosition: number) {
    this.position.mutate((position) => {
      const currentAxisValue = position[axis];
      const newAxisValue = currentAxisValue + amount;
      if (newAxisValue >= maxAxisPosition) {
        position[axis] = maxAxisPosition - POINT_SIZE;
      } else if (currentAxisValue === maxAxisPosition - POINT_SIZE) {
        position[axis] = newAxisValue + POINT_SIZE;
      } else if (newAxisValue < 0) {
        position[axis] = 0;
      } else {
        position[axis] = newAxisValue;
      }
      this.hasTouchedPoint();
    });
  }

  private hasTouchedPoint() {
    const [x, y] = this.position();
    const [xx, yy] = this.positionPointToTouch();
    if (x === xx && y === yy) {
      this.score.update((s) => (s += 1));
      this.movePointToTouch();
    }
  }

  private movePointToTouch() {
    const newX = Math.floor(Math.random() * this.possibleX.length);
    const newY = Math.floor(Math.random() * this.possibleY.length);
    this.positionPointToTouch.set([this.possibleX[newX], this.possibleY[newY]]);
  }

  private drawPoint() {
    const [x, y] = this.position();
    this.point.nativeElement.setAttribute(
      'style',
      `transform: translateY(${y}px) translateX(${x}px)`,
    );
  }
  private drawPointToTouch() {
    const [x, y] = this.positionPointToTouch();
    this.pointToTouch.nativeElement.setAttribute(
      'style',
      `transform: translateY(${y}px) translateX(${x}px)`,
    );
  }
}
