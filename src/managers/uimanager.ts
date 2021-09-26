import Color from "color";
import { from } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FillStyle } from "../enumerations/ui/fillStyle";
import { CoordinatesEmittingObservables } from "../enumerations/observables/coordinatesemittingobservablesenum";
import { GameObjectEmittingSubjects } from "../enumerations/subjects/gameObjectEmittingSubjects";
import { NumberEmittingSubjects } from "../enumerations/subjects/numberEmittingSubjects";
import { Animator } from "../helperClasses/animator";
import { ICoordinates } from "../interfaces/icoordinates";
import { IOutterSquare } from "../interfaces/ui/iOutterSquare";
import { IPaintingStyle } from "../interfaces/ui/iPaintingStyle";
import { IPaintingStyleWithoutFillColors } from "../interfaces/ui/iPaintingStyleWithoutFillColors";
import { IPathAndPaintingStyle } from "../interfaces/ui/iPathAndPaintingStyle";
import { ITextAndTextPaintingStyle } from "../interfaces/ui/iTextAndTextPaintingStyle";
import { ITextPaintingStyle } from "../interfaces/ui/iTextPaintingStyle";
import {
  RenderValueTypes as RenderingDataTypes,
  SubscriptionKeyEnums,
} from "../libraries/typeLibrary";
import { ObservableAndSubjectProvider } from "../providers/observableAndSubjectProvider";
import { DOMManipulator } from "../staticClasses/dommanipulations";
import { Geometry } from "../staticClasses/geometry";
import { Utility } from "../staticClasses/utility";
import { UIObject } from "../uiObjects/abstractUIObject";
import { GameObject } from "../uiObjects/gameObjects/abstractGameObject";
import { AbstractManager } from "./abstractManager";

export class UIManager extends AbstractManager {
  private gameCanvas: HTMLCanvasElement;
  private static gameRenderingContext: CanvasRenderingContext2D;

  private scoreCanvas: HTMLCanvasElement;
  private scoreRenderingContext: CanvasRenderingContext2D;

  private animator: Animator;

  constructor(observableAndSubjectProvider: ObservableAndSubjectProvider) {
    super(observableAndSubjectProvider);

    this.animator = new Animator((removedGameObject: GameObject) =>
      this.gameObjectRemovingCompleteNotifier(removedGameObject)
    );

    this.subscribeToObservable(
      CoordinatesEmittingObservables,
      CoordinatesEmittingObservables.mouseMove,
      (mouseCoordinates: ICoordinates) => this.renderGradient(mouseCoordinates)
    );

    this.subscribeToSubject(
      GameObjectEmittingSubjects,
      GameObjectEmittingSubjects.renderGameObject,
      (gameObjectToRender: GameObject) => {
        gameObjectToRender.getAnimationInterruptSubject().next(null);
        this.renderUIObject(gameObjectToRender);
      }
    );

    this.subscribeToSubject(
      NumberEmittingSubjects,
      NumberEmittingSubjects.scoreChanged,
      (scoreToRender: number) =>
        this.renderText(this.scoreRenderingContext, scoreToRender.toString(), {
          x: 130,
          y: 30,
        })
    );

    this.subscribeToSubject(
      NumberEmittingSubjects,
      NumberEmittingSubjects.numberOfLivesChanged,
      (newNumberOfLives: number) =>
        this.renderText(
          this.scoreRenderingContext,
          newNumberOfLives.toString(),
          {
            x: window.innerWidth - 30,
            y: 30,
          }
        )
    );

    this.initializeScoreCanvasAndRenderingContext();

    this.initializeGameCanvasAndRenderingContext();

    // this.renderUIObject(new Button());
  }
  static checkIfPointIsInPath(
    path: Path2D,
    pointCoordinates: ICoordinates
  ): boolean {
    return UIManager.gameRenderingContext.isPointInPath(
      path,
      pointCoordinates.x,
      pointCoordinates.y
    );
  }

  private generateRadialGradient(
    outterSquare: IOutterSquare,
    colors: Color[],
    alpha: number
  ): CanvasGradient {
    const centerCoordinates: ICoordinates =
      Geometry.findOutterSquareCenter(outterSquare);
    const radialGradient: CanvasGradient =
      UIManager.gameRenderingContext.createRadialGradient(
        centerCoordinates.x - 10,
        centerCoordinates.y - 10,
        0,
        centerCoordinates.x,
        centerCoordinates.y,
        50
      );

    this.addColorsToGradient(radialGradient, colors, alpha);
    return radialGradient;
  }

  private addColorsToGradient(
    gradient: CanvasGradient,
    colors: Color[],
    alpha: number
  ): void {
    let colorOffset: number = 0;
    const colorOffsetChangeFactor: number = 1 / (colors.length - 1);
    from(colors).subscribe((color: Color) => {
      gradient.addColorStop(
        colorOffset,
        Utility.setColorAlphaAndGetRGBString(color, alpha)
      );
      colorOffset += colorOffsetChangeFactor;
      if (colorOffset > 1) colorOffset = 1;
    });
  }

  //static generateLinearGradient(): CanvasGradient {}
  private initializeGameCanvasAndRenderingContext(): void {
    this.gameCanvas = <HTMLCanvasElement>(
      DOMManipulator.createAndAppendElement(document.body, "canvas")
    );
    UIManager.gameRenderingContext = this.gameCanvas.getContext("2d");
    this.gameCanvas.height = window.innerHeight;
    this.gameCanvas.width = window.innerWidth;

    UIManager.gameRenderingContext.shadowBlur = 5;
    UIManager.gameRenderingContext.shadowOffsetX = 4;
    UIManager.gameRenderingContext.shadowOffsetY = 4;
  }

  private initializeScoreCanvasAndRenderingContext(): void {
    this.scoreCanvas = <HTMLCanvasElement>(
      DOMManipulator.createAndAppendElement(document.body, "canvas")
    );

    this.scoreCanvas.height = 100;
    this.scoreCanvas.width = window.innerWidth;
    this.scoreCanvas.style.position = "absolute";
    this.scoreCanvas.style.top = "0px";

    this.scoreRenderingContext = this.scoreCanvas.getContext("2d");

    this.scoreRenderingContext.font = "30px Ariel";
    this.scoreRenderingContext.fillStyle = "white";
    this.scoreRenderingContext.textAlign = "center";

    this.scoreRenderingContext.shadowBlur = 5;
    this.scoreRenderingContext.shadowColor = "black";
    this.scoreRenderingContext.shadowOffsetX = 4;
    this.scoreRenderingContext.shadowOffsetY = 4;

    this.renderText(this.scoreRenderingContext, "Score: ", { x: 50, y: 30 });
    this.renderText(this.scoreRenderingContext, "Lives: ", {
      x: window.innerWidth - 100,
      y: 30,
    });
  }

  private renderGradient(mouseCoordinates: ICoordinates): void {
    const xperc: number = Math.round(
      (mouseCoordinates.x / window.innerWidth) * 100
    );
    const yperc: number = Math.round(
      (mouseCoordinates.y / window.innerHeight) * 100
    );
    this.gameCanvas.style.background = Utility.getRadialGradientStringForCSS(
      xperc,
      yperc,
      "#3498db",
      "#9b59b6",
      5,
      40
    );
  }

  private renderUIObject(uiObject: UIObject<SubscriptionKeyEnums>): void {
    window.requestAnimationFrame(() => {
      const uiObjectAnimationLoopCondition =
        this.animator.setupGameObjectAnimation(uiObject);

      let renderValuesCount: number = uiObject.getRenderValuesCount();

      this.removeFromCanvas(uiObject.getOutterSquare());

      uiObject
        .getRenderingData$()
        .pipe(takeUntil(uiObject.getAnimationInterruptSubject()))
        .subscribe((renderData: RenderingDataTypes) => {
          this.renderDataFromUIObject(renderData, uiObject);
          renderValuesCount--;
          if (renderValuesCount === 0 && uiObjectAnimationLoopCondition)
            this.renderUIObject(uiObject);
        });
    });
  }

  private renderDataFromUIObject(
    renderData: RenderingDataTypes,
    uiObject: UIObject<SubscriptionKeyEnums>
  ): void {
    if (Utility.isPathAndPaintingStyle(renderData)) {
      this.renderPathFromUIObject(
        renderData,
        uiObject.getAlpha(),
        uiObject.getOutterSquare(),
        uiObject.getFillStyle()
      );
    } else if (Utility.isTextAndPaintingStyle(renderData)) {
      this.renderTextFromUIObject(renderData, uiObject.getAlpha());
    }
  }

  private removeFromCanvas(settings: IOutterSquare): void {
    UIManager.gameRenderingContext.clearRect(
      settings.outterSquareTopLeftCornerCoordinates.x,
      settings.outterSquareTopLeftCornerCoordinates.y,
      settings.outterSquareSideLength,
      settings.outterSquareSideLength
    );
  }

  private renderPathFromUIObject(
    pathAndPaintingStyle: IPathAndPaintingStyle,
    alpha: number,
    outterSquare: IOutterSquare,
    fillStyle: FillStyle
  ): void {
    this.setPaintingStyles(
      outterSquare,
      pathAndPaintingStyle.paintingStyle,
      alpha,
      fillStyle
    );
    UIManager.gameRenderingContext.stroke(pathAndPaintingStyle.path);
    UIManager.gameRenderingContext.fill(pathAndPaintingStyle.path);
  }

  private renderTextFromUIObject(
    textAndTextPaintingStyle: ITextAndTextPaintingStyle,
    alpha: number
  ): void {
    this.setTextPaintingStyle(
      textAndTextPaintingStyle.textPaintingStyle,
      alpha
    );
    UIManager.gameRenderingContext.fillText(
      textAndTextPaintingStyle.text.textContent,
      textAndTextPaintingStyle.text.textCoordinates.x,
      textAndTextPaintingStyle.text.textCoordinates.y
    );
  }

  private setPaintingStyles(
    outterSquare: IOutterSquare,
    paintingStyle: IPaintingStyle,
    alpha: number,
    fillStyle: FillStyle
  ): void {
    switch (fillStyle) {
      case FillStyle.radialGradient:
        UIManager.gameRenderingContext.fillStyle = this.generateRadialGradient(
          outterSquare,
          paintingStyle.fillColors,
          alpha
        );
        break;
      case FillStyle.solidColor:
        UIManager.gameRenderingContext.fillStyle =
          Utility.setColorAlphaAndGetRGBString(
            paintingStyle.fillColors[0],
            alpha
          );
        break;
      case FillStyle.linearGradient:
        break;
    }
    this.setPaintingStyleWithoutFillStyle(paintingStyle, alpha);
  }

  private setTextPaintingStyle(
    textPaintingStyle: ITextPaintingStyle,
    alpha: number
  ): void {
    UIManager.gameRenderingContext.font = Utility.getFontString(
      textPaintingStyle.fontName,
      textPaintingStyle.fontSize
    );

    UIManager.gameRenderingContext.textAlign = textPaintingStyle.textAlign;
    UIManager.gameRenderingContext.textBaseline = "middle";

    this.setPaintingStyleWithoutFillStyle(textPaintingStyle, alpha);
    UIManager.gameRenderingContext.fillStyle =
      Utility.setColorAlphaAndGetRGBString(textPaintingStyle.fillStyle, alpha);
  }

  private setPaintingStyleWithoutFillStyle(
    paintingStyleWithoutFillColors: IPaintingStyleWithoutFillColors,
    alpha: number
  ): void {
    UIManager.gameRenderingContext.shadowColor =
      Utility.setColorAlphaAndGetRGBString(
        paintingStyleWithoutFillColors.shadowColor,
        alpha / 2
      );
    UIManager.gameRenderingContext.strokeStyle =
      Utility.setColorAlphaAndGetRGBString(
        paintingStyleWithoutFillColors.strokeStyle,
        alpha
      );
    UIManager.gameRenderingContext.shadowBlur =
      paintingStyleWithoutFillColors.shadowBlur;
    UIManager.gameRenderingContext.shadowOffsetX =
      paintingStyleWithoutFillColors.shadowOffset.offsetX;
    UIManager.gameRenderingContext.shadowOffsetY =
      paintingStyleWithoutFillColors.shadowOffset.offsetY;
  }

  private renderText(
    renderingContext: CanvasRenderingContext2D,
    text: string,
    coordinates: ICoordinates
  ): void {
    window.requestAnimationFrame(() => {
      renderingContext.clearRect(coordinates.x - 30, 0, 100, 100);

      renderingContext.fillText(text, coordinates.x, coordinates.y);
    });
  }

  private gameObjectRemovingCompleteNotifier(
    removedGameObject: GameObject
  ): void {
    this.sendNextTo(
      GameObjectEmittingSubjects,
      GameObjectEmittingSubjects.gameObjectRemovedFromCanvas,
      removedGameObject
    );
  }
}
