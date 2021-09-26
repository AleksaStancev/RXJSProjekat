import { GameObject } from "../uiObjects/gameObjects/abstractGameObject";

export interface IColissionCheckStatus {
  gameObjectCheckingForColission: GameObject;
  gameObjectsLeftToCheckColission: number;
  colissionCheckSuccessful: boolean;
}
