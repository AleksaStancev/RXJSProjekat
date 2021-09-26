import { ICoordinates } from "../interfaces/icoordinates";
import { IOutterSquare } from "../interfaces/ui/iOutterSquare";
import { ObjectFromInterfaceCreator } from "./objectFromInterfaceCreator";

export class Geometry {
  public static checkIfPointIsInOutterSquareOfGameObject(
    pointCoordinates: ICoordinates,
    gameObjectOutterSquare: IOutterSquare
  ): boolean {
    return (
      pointCoordinates.x >=
        gameObjectOutterSquare.outterSquareTopLeftCornerCoordinates.x - 120 &&
      pointCoordinates.x <=
        gameObjectOutterSquare.outterSquareTopLeftCornerCoordinates.x +
          gameObjectOutterSquare.outterSquareSideLength +
          120 &&
      pointCoordinates.y >=
        gameObjectOutterSquare.outterSquareTopLeftCornerCoordinates.y - 120 &&
      pointCoordinates.y <=
        gameObjectOutterSquare.outterSquareTopLeftCornerCoordinates.y +
          gameObjectOutterSquare.outterSquareSideLength +
          120
    );
  }

  public static checkIfCoordinatesAreEqual(
    firstCoordinates: ICoordinates,
    secondCoordinates: ICoordinates
  ) {
    return (
      firstCoordinates.x === secondCoordinates.x &&
      firstCoordinates.y === secondCoordinates.y
    );
  }

  public static getArcPath(
    centerCoordinates: ICoordinates,
    radius: number,
    startingAngle: number,
    endingAngle: number
  ): Path2D {
    const path = new Path2D();
    path.arc(
      centerCoordinates.x,
      centerCoordinates.y,
      radius,
      startingAngle,
      endingAngle
    );
    return path;
  }

  public static findOutterSquareCenter(
    outterSquare: IOutterSquare
  ): ICoordinates {
    const halfSideLength = outterSquare.outterSquareSideLength / 2;
    return ObjectFromInterfaceCreator.createCoordinates(
      outterSquare.outterSquareTopLeftCornerCoordinates.x + halfSideLength,
      outterSquare.outterSquareTopLeftCornerCoordinates.y + halfSideLength
    );
  }
}
