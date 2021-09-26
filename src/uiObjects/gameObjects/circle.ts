import Color from "color";
import { first } from "rxjs/operators";
import { FillStyle } from "../../enumerations/ui/fillStyle";
import { ICoordinates } from "../../interfaces/icoordinates";
import { GameObjectCollectingParametars } from "../../interfaces/iGameObjectCollectingParametars";
import { IOutterSquare } from "../../interfaces/ui/iOutterSquare";
import { IPaintingStyle } from "../../interfaces/ui/iPaintingStyle";
import { Geometry } from "../../staticClasses/geometry";
import { ObjectFromInterfaceCreator } from "../../staticClasses/objectFromInterfaceCreator";
import { GameObject } from "./abstractGameObject";
export class Circle extends GameObject {
  private centerCoordinates: ICoordinates;
  private radius: number;

  constructor(
    outterSquare: IOutterSquare,
    timeToLive: number,
    fillColors: Color[],
    shadowColor: Color,
    outlineColor: Color,
    fillStyle: FillStyle,
    collectingParametars: GameObjectCollectingParametars
  ) {
    super(
      outterSquare,
      1,
      timeToLive,
      collectingParametars,
      fillStyle,
      outterSquare.outterSquareSideLength - 19
    );
    this.radius = 0;
    this.centerCoordinates = Geometry.findOutterSquareCenter(this.outterSquare);
    const path: Path2D = Geometry.getArcPath(
      this.centerCoordinates,
      this.radius,
      0,
      2 * Math.PI
    );
    const paintingStyle: IPaintingStyle =
      ObjectFromInterfaceCreator.createPaintingStyle(
        fillColors,
        outlineColor,
        shadowColor,
        5,
        ObjectFromInterfaceCreator.createShadowOffset(4, 4)
      );

    this.insertPathAndPaintingStyle(path, paintingStyle);

    const text = ObjectFromInterfaceCreator.createText(
      collectingParametars.getDisplayText(),
      this.centerCoordinates
    );
    const textPaintingStyle =
      ObjectFromInterfaceCreator.createTextPaintingStyle(
        "Ariel",
        40,
        "center",
        Color("red"),
        Color("black"),
        Color("blue"),
        5,
        ObjectFromInterfaceCreator.createShadowOffset(5, 5)
      );

    this.insertTextAndTextPaintingStyle(text, textPaintingStyle);
  }

  protected generatePaths(): void {
    const path = Geometry.getArcPath(
      this.centerCoordinates,
      this.radius,
      0,
      Math.PI * 2
    );

    this.getPathsAndPaintingStyles$()
      .pipe(first())
      .subscribe((pathAndPaintingStyle) => {
        this.updatePath(pathAndPaintingStyle.path, path);
      });
  }
  protected changeSize(resizeFactor: number): number {
    return 2 * (this.radius += resizeFactor);
  }

  protected getSize(): number {
    return this.radius;
  }
  public updateTextsFromCollectingParametars(): void {
    this.getTextsAndPaintingStyles$()
      .pipe(first())
      .subscribe((textAndPaintingStyle) =>
        this.updateText(
          textAndPaintingStyle.text,
          ObjectFromInterfaceCreator.createText(
            this.collectingParametars.getDisplayText(),
            textAndPaintingStyle.text.textCoordinates
          )
        )
      );
  }
}
