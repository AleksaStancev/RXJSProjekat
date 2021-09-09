import { merge, observable, Observable, Subject } from "rxjs";
import { setupAnimationAndGetLoopCondition } from "../libraries/animationlibrary";
import { createAndAppend } from "../libraries/dommanipulations";
import { Animations } from "../enumerations/animationsenum";
import { ICircle as ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";
import { CircleSubjects } from "../enumerations/circleemittingsubjectsenum";
import { MouseEvents } from "../enumerations/icoordinatesemittingobservablesenum";
import { iCoordinatesEmittingObservables } from "../observableMaps/icoordinatesemittingobservablesmap";
import { circleEmittingSubjects } from "../observableMaps/circleemittingsubjectsmap";
import { circleEmittingObservables } from "../observableMaps/circleemittingobservablesmap";
import { delay } from "rxjs/operators";
import { numberEmittingSubjects } from "../observableMaps/numberemittingsubjectsmap";
import { NumberEmittingSubjects } from "../enumerations/numberemittingsubjectsenum";
import { IRemoveFromCanvasSettings } from "../interfaces/iremovefromcanvassettings";
import { IRemoveCircleFromCanvasSettings } from "../interfaces/iremovecirclefromcanvassettings";

export class UIManager {
  private gameCanvas: HTMLCanvasElement;
  private gameRenderingContext: CanvasRenderingContext2D;

  private scoreCanvas: HTMLCanvasElement;
  private scoreRenderingContext: CanvasRenderingContext2D;

  private animationLoopCondition: boolean;

  constructor() {
    iCoordinatesEmittingObservables
      .get(MouseEvents.mouseMove)
      .subscribe((mouseCoordinates) => this.renderGradient(mouseCoordinates));

    circleEmittingSubjects
      .get(CircleSubjects.renderCircle)
      .subscribe((circleToRender) => this.renderCircle(circleToRender));

    numberEmittingSubjects
      .get(NumberEmittingSubjects.scoreChanged)
      .subscribe((score: number) =>
        this.renderText(score.toString(), { x: 130, y: 30 })
      );

    numberEmittingSubjects
      .get(NumberEmittingSubjects.numberOfLivesChanged)
      .subscribe((lives: number) =>
        this.renderText(lives.toString(), {
          x: window.innerWidth - 30,
          y: 30,
        })
      );
  }

  renderCanvas(): void {
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

  renderGradient(mouseCoordinates: ICoordinates): void {
    const xperc: number = Math.round(
      (mouseCoordinates.x / window.innerWidth) * 100
    );
    const yperc: number = Math.round(
      (mouseCoordinates.y / window.innerHeight) * 100
    );
    this.gameCanvas.style.background = `radial-gradient(circle at ${xperc}% ${yperc}%,#3498db 5%, #9b59b6 40%)`;
  }

  private RemoveFromCanvas(settings: IRemoveFromCanvasSettings): void {
    this.gameRenderingContext.clearRect(
      settings.rectangleTopLeftCoordinates.x,
      settings.rectangleTopLeftCoordinates.y,
      settings.rectangleSideLenght,
      settings.rectangleSideLenght
    );
  }

  renderCircle(circle: ICircle): void {
    window.requestAnimationFrame(() => {
      let removeCircleFromCanvasSettings: IRemoveCircleFromCanvasSettings = {
        deleteAfterDrawing: true,
        deleteAfterDrawingSettings: {
          rectangleSideLenght: 0,
          rectangleTopLeftCoordinates: { x: 0, y: 0 },
        },
        deleteBeforeDrawing: true,
        deleteBeforeDrawingSettings: {
          rectangleSideLenght: 0,
          rectangleTopLeftCoordinates: { x: 0, y: 0 },
        },
      };

      this.animationLoopCondition = setupAnimationAndGetLoopCondition(
        circle,
        this.gameRenderingContext,
        removeCircleFromCanvasSettings
      );

      if (removeCircleFromCanvasSettings.deleteBeforeDrawing)
        this.RemoveFromCanvas(
          removeCircleFromCanvasSettings.deleteBeforeDrawingSettings
        );
      this.gameRenderingContext.stroke(circle.path);
      this.gameRenderingContext.fill(circle.path);
      if (removeCircleFromCanvasSettings.deleteAfterDrawing)
        this.RemoveFromCanvas(
          removeCircleFromCanvasSettings.deleteAfterDrawingSettings
        );

      if (this.animationLoopCondition) this.renderCircle(circle);
    });
  }

  renderText(text: string, coordinates: ICoordinates): void {
    window.requestAnimationFrame(() => {
      this.scoreRenderingContext.clearRect(coordinates.x - 30, 0, 50, 50);

      this.scoreRenderingContext.fillText(text, coordinates.x, coordinates.y);
    });
  }
}
