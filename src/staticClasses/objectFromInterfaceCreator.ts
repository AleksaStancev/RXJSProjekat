import * as Color from "color";
import { IColissionCheckStatus } from "../interfaces/iColissionCheckStatus";
import { ICoordinates } from "../interfaces/icoordinates";
import { IKeyAndCoordinates } from "../interfaces/iKeyAndCoordinates";
import { IOutterSquare } from "../interfaces/ui/iOutterSquare";
import { IPaintingStyle } from "../interfaces/ui/iPaintingStyle";
import { IPathAndPaintingStyle } from "../interfaces/ui/iPathAndPaintingStyle";
import { IShadowOffset } from "../interfaces/ui/iShadowOffset";
import { IText } from "../interfaces/ui/iText";
import { ITextAndTextPaintingStyle } from "../interfaces/ui/iTextAndTextPaintingStyle";
import { ITextPaintingStyle } from "../interfaces/ui/iTextPaintingStyle";
import { GameObject } from "../uiObjects/gameObjects/abstractGameObject";

export class ObjectFromInterfaceCreator {
  static createOutterSquare(
    squareleTopLeftCornerCoordinates: ICoordinates,
    outterSquareSideLength: number
  ): IOutterSquare {
    if (outterSquareSideLength < 0) outterSquareSideLength = 0;
    return {
      outterSquareTopLeftCornerCoordinates: squareleTopLeftCornerCoordinates,
      outterSquareSideLength: outterSquareSideLength,
    };
  }
  static createCoordinates(x: number, y: number): ICoordinates {
    return { x: x, y: y };
  }
  static createPaintingStyle(
    fillColors: Color[],
    strokeStyle: Color,
    shadowColor: Color,
    shadowBlur: number,
    shadowOffset: IShadowOffset
  ): IPaintingStyle {
    return {
      fillColors: fillColors,
      strokeStyle: strokeStyle,
      shadowColor: shadowColor,
      shadowBlur: shadowBlur,
      shadowOffset: shadowOffset,
    };
  }
  static createColissionCheckStatus(
    gameObjectCheckingForColission: GameObject,
    gameObjectsLeftToCheckColission: number
  ): IColissionCheckStatus {
    return {
      gameObjectCheckingForColission: gameObjectCheckingForColission,
      gameObjectsLeftToCheckColission: gameObjectsLeftToCheckColission,
      colissionCheckSuccessful: true,
    };
  }

  static createKeyAndCoordinates(
    key: string,
    coordinates: ICoordinates
  ): IKeyAndCoordinates {
    return { key: key, coordinates: coordinates };
  }

  static createPathAndPaintingStyle(
    path: Path2D,
    paintingStyle: IPaintingStyle
  ): IPathAndPaintingStyle {
    return { path: path, paintingStyle: paintingStyle };
  }

  static createTextPaintingStyle(
    fontName: string,
    fontSize: number,
    textAlign: CanvasTextAlign,
    fillStyle: Color,
    shadowColor: Color,
    strokeColor: Color,
    shadowBlur: number,
    shadowOffset: IShadowOffset
  ): ITextPaintingStyle {
    return {
      fontName: fontName,
      fontSize: fontSize,
      textAlign: textAlign,
      fillStyle: fillStyle,
      shadowColor: shadowColor,
      shadowBlur: shadowBlur,
      shadowOffset: shadowOffset,
      strokeStyle: strokeColor,
    };
  }

  static createTextAndTextPaintingStyle(
    text: IText,
    textPaintingStyle: ITextPaintingStyle
  ): ITextAndTextPaintingStyle {
    return { text: text, textPaintingStyle: textPaintingStyle };
  }

  static createText(textContent: string, textCoordinates: ICoordinates): IText {
    return { textContent: textContent, textCoordinates: textCoordinates };
  }

  static createShadowOffset(offsetX: number, offsetY: number): IShadowOffset {
    return { offsetX: offsetX, offsetY: offsetY };
  }
}
