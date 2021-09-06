import { fromEvent, interval, Observable } from "rxjs";
import { delay, map, take } from "rxjs/operators";
import { Animations } from "./enumerations/animationsenum";
import { ICircle } from "./interfaces/icircle";

export class ObservableProvider {
  //events
  public readonly mouseMoveEvents$: Observable<MouseEvent>;

  //generators
  public readonly circleGenerator$: Observable<ICircle>;

  constructor() {
    this.mouseMoveEvents$ = fromEvent<MouseEvent>(document, "mousemove");

    this.circleGenerator$ = interval(500).pipe(
      delay(this.getRandomInt(0, 500)),
      map(() => this.getRandomCircle())
    );
  }

  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomCircle(): ICircle {
    return {
      x: this.getRandomInt(0, 1920),
      y: this.getRandomInt(0, 1080),
      radius: 0,
      gradient: this.getRandomColor(),
      alpha: 1,
      path: new Path2D(),
      animation: Animations.zoomIn,
    };
  }

  private getRandomColor(): string {
    switch (this.getRandomInt(0, 1)) {
      case 0:
        return "185, 122, 149";
      case 1:
        return "246, 174, 153";
      default:
        return "255,255,255";
    }
  }
}
