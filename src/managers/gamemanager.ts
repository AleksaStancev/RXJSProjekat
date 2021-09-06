import { from, fromEvent, generate, interval, Observable } from "rxjs";
import {
  concatMap,
  delay,
  filter,
  first,
  map,
  take,
  toArray,
} from "rxjs/operators";
import { Animations } from "../enumerations/animationsenum";
import { ICircle } from "../interfaces/icircle";
import { IGameState } from "../interfaces/igamestate";
import { ObservableProvider } from "../observableprovider";
import { UIManager } from "./uimanager";

export class GameManager {
  private uiManager: UIManager;
  private observableProvider: ObservableProvider;

  private gameState: IGameState;

  private circles$: Observable<ICircle>;

  constructor() {
    this.uiManager = new UIManager();
    this.observableProvider = new ObservableProvider();

    this.gameState = {
      circles: [],
      points: 0,
    };
  }

  startGame(): void {
    this.uiManager.renderCanvas();

    this.observableProvider.mouseMoveEvents$.subscribe((mouseEvent) =>
      this.uiManager.renderGradient(mouseEvent.x, mouseEvent.y)
    );

    this.observableProvider.circleGenerator$.subscribe((circle) => {
      this.gameState.circles.push(circle);
      this.uiManager.renderCircle(circle);
    });

    this.observableProvider.mouseMoveEvents$
      .pipe(concatMap((mouseEvent) => this.generateCircles$(mouseEvent)))
      .subscribe((touchedCircle) => {
        touchedCircle.animation = Animations.fadeOut;
        this.uiManager.renderCircle(touchedCircle);
        this.circles$
          .pipe(
            filter((circle) => circle !== touchedCircle),
            toArray()
          )
          .subscribe(
            (remainingCircles) => (this.gameState.circles = remainingCircles)
          );
      });
  }

  private checkIfMouseIsInCircle(
    mouseEvent: MouseEvent,
    circle: ICircle
  ): boolean {
    return (
      mouseEvent.x > circle.x - circle.radius &&
      mouseEvent.x < circle.x + circle.radius &&
      mouseEvent.y > circle.y - circle.radius &&
      mouseEvent.y < circle.y + circle.radius
    );
  }

  private generateCircles$(mouseEvent: MouseEvent): Observable<ICircle> {
    this.circles$ = from(this.gameState.circles);
    return this.circles$.pipe(
      first((circle) => this.checkIfMouseIsInCircle(mouseEvent, circle), null),
      filter((circle) => circle !== null)
    );
  }
}
