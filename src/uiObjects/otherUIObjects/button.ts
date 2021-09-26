import Color from "color";
import { Animations } from "../../enumerations/ui/animations";
import { UIObjectSubscriptionKeyEnum } from "../../libraries/typeLibrary";
import { ObjectFromInterfaceCreator } from "../../staticClasses/objectFromInterfaceCreator";
import { UIObject } from "../abstractUIObject";

/*export class Button extends UIObject<UIObjectSubscriptionKeyType> {
  protected generatePaintingStyles(): void {
    throw new Error("Method not implemented.");
  }

  protected generateTextPaintingStyles(): void {
    throw new Error("Method not implemented.");
  }
  public getAnimaton(): Animations {
    throw new Error("Method not implemented.");
  }
  public resizeIfCurrentSizeIsNotMaxSize(resizeFactor: number): boolean {
    throw new Error("Method not implemented.");
  }
  constructor() {
    super();
    this.generatePaths();
  }
  protected generatePaths(): void {
    let path = new Path2D();

    path = new Path2D();
    path.moveTo(200, 250);
    path.lineTo(200, 265);
    path.lineTo(300, 265);
    path.lineTo(300, 250);
    path.closePath();
    this.pathsAndPaintingStyles.set(
      path,
      ObjectFromInterfaceCreator.createPaintingStyle(
        Color("gray"),
        Color("gray"),
        Color("transparent"),
        50,
        ObjectFromInterfaceCreator.createCoordinates(0, 5)
      )
    );
    path = new Path2D();
    path.moveTo(210, 210);
    path.lineTo(200, 250);
    path.lineTo(300, 250);
    path.lineTo(290, 210);
    path.closePath();
    this.pathsAndPaintingStyles.set(
      path,
      ObjectFromInterfaceCreator.createPaintingStyle(
        Color("darkgray"),
        Color("darkgray"),
        Color("transparent"),
        0,
        ObjectFromInterfaceCreator.createCoordinates(20, 0)
      )
    );

    let text = ObjectFromInterfaceCreator.createText(
      "Alo",
      ObjectFromInterfaceCreator.createCoordinates(250, 240)
    );

    let textStyle = ObjectFromInterfaceCreator.createTextPaintingStyle(
      "30px Ariel",
      "center",
      ObjectFromInterfaceCreator.createPaintingStyle(
        Color("blue"),
        Color("red"),
        Color("transparent"),
        0,
        ObjectFromInterfaceCreator.createCoordinates(0, 0)
      )
    );

    
  }
}
*/