import { GameObjectCollectingParametars } from "../interfaces/iGameObjectCollectingParametars";

export class MouseClickCollectingParametars extends GameObjectCollectingParametars {
  private mouseClicksLeft: number;
  constructor(mouseClicksLeft: number) {
    super();
    this.mouseClicksLeft = mouseClicksLeft;
  }
  private checkIfMouseClicksLeftIsPositive(): boolean {
    return this.mouseClicksLeft > 0;
  }
  public registerMouseClick(): number {
    if (this.checkIfMouseClicksLeftIsPositive()) this.mouseClicksLeft--;
    return this.mouseClicksLeft;
  }
  public getDisplayText(): string {
    if (this.checkIfMouseClicksLeftIsPositive())
      return this.mouseClicksLeft.toString();
    return "";
  }
}
