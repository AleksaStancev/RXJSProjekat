import { Observable } from "rxjs";
import { setupAnimationAndGetLoopCondition } from "../libraries/animationlibrary";
import { createAndAppend } from "../libraries/dommanipulations";
import { Animations } from "../enumerations/animationsenum";
import { ICircle as ICircle } from "../interfaces/icircle";

export class UIManager {
  private canvas: HTMLCanvasElement;
  private renderingContext: CanvasRenderingContext2D;

  private loopCondition: boolean;
  private renderedRects: ICircle[];

  private mouseMoveEvents$: Observable<MouseEvent>;

  constructor() {
    this.renderedRects = [];
  }

  renderCanvas(): void {
    this.canvas = <HTMLCanvasElement>createAndAppend(document.body, "canvas");
    this.renderingContext = this.canvas.getContext("2d");
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    this.renderingContext.shadowBlur = 5;
    this.renderingContext.shadowOffsetX = 4;
    this.renderingContext.shadowOffsetY = 4;
  }

  renderGradient(x: number, y: number): void {
    const xperc: number = Math.round((x / window.innerWidth) * 100);
    const yperc: number = Math.round((y / window.innerHeight) * 100);
    document.body.style.background = `radial-gradient(circle at ${xperc}% ${yperc}%,#3498db 5%, #9b59b6 40%)`;
  }

  renderCircle(circle: ICircle): void {
    window.requestAnimationFrame(() => {
      this.renderingContext.clearRect(
        circle.x - circle.radius,
        circle.y - circle.radius,
        2 * circle.radius + 15,
        2 * circle.radius + 15
      );

      this.loopCondition = setupAnimationAndGetLoopCondition(
        circle,
        this.renderingContext
      );

      this.renderingContext.stroke(circle.path);
      this.renderingContext.fill(circle.path);

      if (this.loopCondition) this.renderCircle(circle);
    });
  }
}
