import { GameObjectCollectingParametars } from "../interfaces/iGameObjectCollectingParametars";

export class KeyPressWithMouseDownCollectingParametars extends GameObjectCollectingParametars {
  private keyToPress: string;
  private keyPressesLeft: number;
  constructor(keyToPress: string, keyPressesLeft: number) {
    super();
    this.keyToPress = keyToPress;
    this.keyPressesLeft = keyPressesLeft;
  }

  public getKeyToPress(): string {
    return this.keyToPress;
  }

  public registerKeyPressed(): number {
    if (this.keyPressesLeft > 0) this.keyPressesLeft--;
    return this.keyPressesLeft;
  }

  public getDisplayText(): string {
    return this.keyPressesLeft > 0
      ? this.keyToPress.toUpperCase() + this.keyPressesLeft.toString()
      : "";
  }
}
