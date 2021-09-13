import { createAndAppend } from "../libraries/dommanipulations";
import { ICircle as ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";
import { CircleEmittingSubjects } from "../enumerations/circleemittingsubjectsenum";
import { CoordinatesEmittingObservables } from "../enumerations/coordinatesemittingobservablesenum";
import { NumberEmittingSubjects } from "../enumerations/numberemittingsubjectsenum";
import { IRemoveFromCanvasSettings } from "../interfaces/iremovefromcanvassettings";
import { ObservableAndSubjectProvider } from "../providers/observableandsubjectprovider";
import { IRadialGradientSettings } from "../interfaces/iradialgradientsettings";
import { Animations } from "../enumerations/animationsenum";
import { IRadialGradientOffsetAndColor } from "../interfaces/iradialgradientoffsetandcolor";
import { from } from "rxjs";
import { AbstractManager } from "./abstractmanager";

export class UIManager extends AbstractManager {
  private gameCanvas: HTMLCanvasElement;
  private gameRenderingContext: CanvasRenderingContext2D;

  private scoreCanvas: HTMLCanvasElement;
  private scoreRenderingContext: CanvasRenderingContext2D;

  private circleAnimationLoopCondition: boolean;
  private removeFromCanvasSettings: IRemoveFromCanvasSettings;

  constructor(observableAndSubjectProvider: ObservableAndSubjectProvider) {
    super(observableAndSubjectProvider);

    this.subscribeTo(
      CoordinatesEmittingObservables,
      CoordinatesEmittingObservables.mouseMove,
      (mouseCoordinates: ICoordinates) => this.renderGradient(mouseCoordinates)
    );

    this.subscribeTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.renderCircle,
      (circleToRender) => this.renderCircle(circleToRender)
    );

    this.subscribeTo(
      NumberEmittingSubjects,
      NumberEmittingSubjects.scoreChanged,
      (scoreToRender: number) =>
        this.renderText(scoreToRender.toString(), { x: 130, y: 30 })
    );

    this.subscribeTo(
      NumberEmittingSubjects,
      NumberEmittingSubjects.numberOfLivesChanged,
      (newNumberOfLives: number) =>
        this.renderText(newNumberOfLives.toString(), {
          x: window.innerWidth - 30,
          y: 30,
        })
    );

    this.renderCanvas();
    this.removeFromCanvasSettings = {
      rectangleSideLenght: 0,
      rectangleTopLeftCoordinates: { x: 0, y: 0 },
    };
  }

  private renderCanvas(): void {
    this.scoreCanvas = <HTMLCanvasElement>(
      createAndAppend(document.body, "canvas")
    );
    this.gameCanvas = <HTMLCanvasElement>(
      createAndAppend(document.body, "canvas")
    );
    this.gameRenderingContext = this.gameCanvas.getContext("2d");
    this.gameCanvas.height = window.innerHeight;
    this.gameCanvas.width = window.innerWidth;

    this.gameRenderingContext.shadowBlur = 5;
    this.gameRenderingContext.shadowOffsetX = 4;
    this.gameRenderingContext.shadowOffsetY = 4;

    this.scoreCanvas.height = 100;
    this.scoreCanvas.width = window.innerWidth;

    this.scoreRenderingContext = this.scoreCanvas.getContext("2d");

    this.scoreRenderingContext.font = "30px Ariel";
    this.scoreRenderingContext.fillStyle = "white";
    this.scoreRenderingContext.textAlign = "center";
    this.scoreRenderingContext.globalAlpha = 1;
    this.scoreCanvas.style.position = "absolute";
    this.scoreCanvas.style.top = "0px";

    this.renderText("Score: ", { x: 50, y: 30 });
    this.renderText("Lives: ", { x: window.innerWidth - 100, y: 30 });
  }

  private renderGradient(mouseCoordinates: ICoordinates): void {
    const xperc: number = Math.round(
      (mouseCoordinates.x / window.innerWidth) * 100
    );
    const yperc: number = Math.round(
      (mouseCoordinates.y / window.innerHeight) * 100
    );
    this.gameCanvas.style.background = `radial-gradient(circle at ${xperc}% ${yperc}%,#3498db 5%, #9b59b6 40%)`;
  }

  private renderCircle(circle: ICircle): void {
    window.requestAnimationFrame(() => {
      this.setupCircleAnimation(circle);

      this.removeFromCanvas(this.removeFromCanvasSettings);
      this.gameRenderingContext.stroke(circle.path);
      this.gameRenderingContext.fill(circle.path);

      if (this.circleAnimationLoopCondition) this.renderCircle(circle);
    });
  }

  private renderText(text: string, coordinates: ICoordinates): void {
    window.requestAnimationFrame(() => {
      this.scoreRenderingContext.clearRect(coordinates.x - 30, 0, 50, 50);

      this.scoreRenderingContext.fillText(text, coordinates.x, coordinates.y);
    });
  }

  private removeFromCanvas(settings: IRemoveFromCanvasSettings): void {
    this.gameRenderingContext.clearRect(
      settings.rectangleTopLeftCoordinates.x,
      settings.rectangleTopLeftCoordinates.y,
      settings.rectangleSideLenght,
      settings.rectangleSideLenght
    );
  }

  private setupCircleAnimation(circle: ICircle): void {
    switch (circle.animation) {
      case Animations.zoomIn:
        return this.zoomInOutAnimation(circle, true);
      case Animations.zoomOut:
        return this.zoomInOutAnimation(circle, false);
      case Animations.fadeOut:
        return this.fadeOutAnimation(circle);
    }
  }

  private setPaintingStyles(
    fillStyle: string | CanvasGradient,
    shadowColor: string,
    strokeStyle: string
  ): void {
    this.gameRenderingContext.fillStyle = fillStyle;
    this.gameRenderingContext.shadowColor = shadowColor;
    this.gameRenderingContext.strokeStyle = strokeStyle;
  }

  private setCirclePath(circle: ICircle): void {
    circle.path = new Path2D();
    circle.path.arc(
      circle.coordinates.x,
      circle.coordinates.y,
      circle.radius,
      0,
      Math.PI * 2
    );
  }

  private setRemoveFromCanvasSettingsForCircle(
    circle: ICircle,
    radiusCorrectionFactor: number,
    sideLenghtCorrectionFactor: number
  ): void {
    const correctedRadius = circle.radius + radiusCorrectionFactor;
    this.removeFromCanvasSettings.rectangleSideLenght =
      2 * correctedRadius + sideLenghtCorrectionFactor;
    this.removeFromCanvasSettings.rectangleTopLeftCoordinates = {
      x: circle.coordinates.x - correctedRadius,
      y: circle.coordinates.y - correctedRadius,
    };
  }

  private getRadialGradient(
    radialGradientSettigs: IRadialGradientSettings
  ): CanvasGradient {
    const radialGradient = this.gameRenderingContext.createRadialGradient(
      radialGradientSettigs.innerCircleCoordinates.x,
      radialGradientSettigs.innerCircleCoordinates.y,
      radialGradientSettigs.innerCircleRadius,
      radialGradientSettigs.outterCircleCoordinates.x,
      radialGradientSettigs.outterCircleCoordinates.y,
      radialGradientSettigs.outterCircleRadius
    );
    from(radialGradientSettigs.offsetsAndColors).subscribe(
      (offsetAndColor: IRadialGradientOffsetAndColor) =>
        radialGradient.addColorStop(offsetAndColor.offset, offsetAndColor.color)
    );
    return radialGradient;
  }

  private circleRemovingCompleteNotifier(removedCircle: ICircle) {
    this.sendNextTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.circleRemovedFromCanvas,
      removedCircle
    );
  }

  private fadeOutAnimation(circle: ICircle): void {
    circle.alpha -= 0.05;

    this.setRemoveFromCanvasSettingsForCircle(circle, 0, 15);

    this.setPaintingStyles(
      `rgba(${circle.gradient},${circle.alpha})`,
      `rgba(64,64,64,${circle.alpha})`,
      `rgba(1,159,98,${circle.alpha})`
    );

    this.circleAnimationLoopCondition = circle.alpha > 0;
    if (!this.circleAnimationLoopCondition)
      this.circleRemovingCompleteNotifier(circle);
  }
  private zoomInOutAnimation(circle: ICircle, zoomIn: boolean) {
    this.setCirclePath(circle);

    const radialGradientSettings: IRadialGradientSettings = {
      innerCircleCoordinates: {
        x: circle.coordinates.x - 10,
        y: circle.coordinates.y - 10,
      },
      innerCircleRadius: 10,
      outterCircleCoordinates: circle.coordinates,
      outterCircleRadius: 50,
      offsetsAndColors: [
        { offset: 0, color: "#A7D30C" },
        { offset: 1, color: "#019F62" },
      ],
    };
    const radialGradient = this.getRadialGradient(radialGradientSettings);

    if (zoomIn) {
      this.setPaintingStyles(radialGradient, `rgba(64,64,64,1)`, "#019F62");
      this.setRemoveFromCanvasSettingsForCircle(circle, 0, 0);
      circle.radius += 10;
      this.circleAnimationLoopCondition = circle.radius < 50;
      return;
    }

    circle.radius -= 10;
    this.setRemoveFromCanvasSettingsForCircle(circle, 21, 10);
    if (circle.radius > 0) {
      this.setPaintingStyles(radialGradient, `rgba(64,64,64,1)`, "#019F62");
      this.circleAnimationLoopCondition = true;
      return;
    }
    this.setPaintingStyles(`rgba(0,0,0,0)`, `rgba(0,0,0,0)`, `rgba(0,0,0,0)`);
    this.circleAnimationLoopCondition = false;
    this.circleRemovingCompleteNotifier(circle);
    return;
  }
}
