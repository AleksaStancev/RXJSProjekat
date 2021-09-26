import { GameObjectStatus } from "../../enumerations/gameObjects/gameObjectStatus";
import { ColissionCheckSubjects } from "../../enumerations/subjects/colissionCheckSubjects";
import { Animations } from "../../enumerations/ui/animations";
import { FillStyle } from "../../enumerations/ui/fillStyle";
import { GameObjectCollectingParametars } from "../../interfaces/iGameObjectCollectingParametars";
import { IOutterSquare } from "../../interfaces/ui/iOutterSquare";
import { GameObjectSubscriptionsKeyEnum } from "../../libraries/typeLibrary";
import { UIObject } from "../abstractUIObject";
1;

export abstract class GameObject extends UIObject<GameObjectSubscriptionsKeyEnum> {
  protected timeToLive: number;
  protected status: GameObjectStatus;
  protected collectingParametars: GameObjectCollectingParametars;

  constructor(
    outterSquare: IOutterSquare,
    startingAlpha: number,
    timeToLive: number,
    collectingParametars: GameObjectCollectingParametars,
    fillStyle: FillStyle,
    sizeLimit: number
  ) {
    super(outterSquare, startingAlpha, fillStyle, sizeLimit);

    this.status = GameObjectStatus.Alive;
    this.timeToLive = timeToLive;

    this.collectingParametars = collectingParametars;
  }
  public abstract updateTextsFromCollectingParametars(): void;

  public removeSubscriptionsBeforeRemovingFromCanvas(): void {
    this.removeAllSubscriptionsExcept([ColissionCheckSubjects.colissionCheck]);
  }

  public removeSubscriptionsAfterRemovingFromCanvas(): void {
    this.removeSubscription(ColissionCheckSubjects.colissionCheck);
  }

  public getTimeToLive(): number {
    return this.timeToLive;
  }

  public decrementTimeToLive(decrementFactor: number): void {
    this.timeToLive -= Math.abs(decrementFactor);
  }

  public setStatus(newStatus: GameObjectStatus): void {
    if (newStatus in GameObjectStatus) this.status = newStatus;
  }
  public getStatus(): GameObjectStatus {
    return this.status;
  }

  public getCollectingParametars(): GameObjectCollectingParametars {
    return this.collectingParametars;
  }

  public getAnimaton(): Animations {
    switch (this.status) {
      case GameObjectStatus.Alive:
        return Animations.zoomIn;
      case GameObjectStatus.Collected:
        return Animations.fadeOut;
      case GameObjectStatus.Dead:
        return Animations.zoomOut;
      case GameObjectStatus.Terminated:
        return Animations.fadeOut;
    }
  }
}
