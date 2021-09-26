import { Animations } from "../enumerations/ui/animations";
import { SubscriptionKeyEnums } from "../libraries/typeLibrary";
import { UIObject } from "../uiObjects/abstractUIObject";
import { GameObject } from "../uiObjects/gameObjects/abstractGameObject";

export class Animator {
  private gameObjectRemovingCompleteNotifier: (
    removedGameObject: GameObject
  ) => void;
  constructor(
    gameObjectRemovingCompleteNotifier: (removedGameObject: GameObject) => void
  ) {
    this.gameObjectRemovingCompleteNotifier =
      gameObjectRemovingCompleteNotifier;
  }
  public setupGameObjectAnimation(
    uiObject: UIObject<SubscriptionKeyEnums>
  ): boolean {
    switch (uiObject.getAnimaton()) {
      case Animations.zoomIn:
        return this.zoomInOutAnimation(uiObject, true);
      case Animations.zoomOut:
        return this.zoomInOutAnimation(uiObject, false);
      case Animations.fadeOut:
        return this.fadeOutAnimation(uiObject);
    }
  }

  private fadeOutAnimation(uiObject: UIObject<SubscriptionKeyEnums>): boolean {
    const returnValue: boolean = uiObject.modifyAlpha(-0.1);
    if (!returnValue && uiObject instanceof GameObject)
      this.gameObjectRemovingCompleteNotifier(uiObject);
    return returnValue;
  }

  private zoomInOutAnimation(
    uiObject: UIObject<SubscriptionKeyEnums>,
    zoomIn: boolean
  ): boolean {
    let returnValue: boolean;
    if (zoomIn) {
      returnValue = uiObject.resizeIfCurrentSizeIsNotMaxSize(10);
    } else {
      returnValue = uiObject.resizeIfCurrentSizeIsNotMaxSize(-10);
      if (!returnValue) {
        uiObject.modifyAlpha(-1);
        if (uiObject instanceof GameObject)
          this.gameObjectRemovingCompleteNotifier(uiObject);
      }
    }
    return returnValue;
  }
}
