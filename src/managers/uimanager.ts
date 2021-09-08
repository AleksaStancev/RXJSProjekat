import { merge, observable, Observable, Subject } from "rxjs";
import { setupAnimationAndGetLoopCondition } from "../libraries/animationlibrary";
import { createAndAppend } from "../libraries/dommanipulations";
import { Animations } from "../enumerations/animationsenum";
import { ICircle as ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";
import { CircleSubjects } from "../enumerations/circlesubjectsenum";
import { MouseEvents } from "../enumerations/mouseeventsenum";
import { CircleEvents } from "../enumerations/circleeventsenum";
import { mouseEvents } from "../maps/mouseeventsmap";
import { circleSubjects } from "../maps/circlesubjectsmap";
import { circleEvents } from "../maps/circleeventsmap";

export class UIManager {
  private canvas: HTMLCanvasElement;
  private renderingContext: CanvasRenderingContext2D;

  private animationLoopCondition: boolean;

  constructor() {
    mouseEvents
      .get(MouseEvents.mouseMove)
      .subscribe((mouseCoordinates) => this.renderGradient(mouseCoordinates));

    merge(
      circleSubjects.get(CircleSubjects.mouseEnteredCircle),
      circleEvents.get(CircleEvents.circleGenerated)
    ).subscribe((circleToRender) => this.renderCircle(circleToRender));
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

  renderGradient(mouseCoordinates: ICoordinates): void {
    const xperc: number = Math.round(
      (mouseCoordinates.x / window.innerWidth) * 100
    );
    const yperc: number = Math.round(
      (mouseCoordinates.y / window.innerHeight) * 100
    );
    document.body.style.background = `radial-gradient(circle at ${xperc}% ${yperc}%,#3498db 5%, #9b59b6 40%)`;
  }

  renderCircle(circle: ICircle): void {
    window.requestAnimationFrame(() => {
      this.renderingContext.clearRect(
        circle.coordinates.x - circle.radius,
        circle.coordinates.y - circle.radius,
        2 * circle.radius + 15,
        2 * circle.radius + 15
      );

      this.animationLoopCondition = setupAnimationAndGetLoopCondition(
        circle,
        this.renderingContext
      );

      this.renderingContext.stroke(circle.path);
      this.renderingContext.fill(circle.path);

      if (this.animationLoopCondition) this.renderCircle(circle);
    });
  }
}
