import Color from "color";
import { FillStyle } from "../enumerations/ui/fillStyle";
import { KeyPressWithMouseDownCollectingParametars } from "../gameObjectCollectingParametars/keyPressWithMouseDownCollectingParametars";
import { MouseClickCollectingParametars } from "../gameObjectCollectingParametars/mouseClickCollectingParametars";
import { MouseEnterCollectingParametars } from "../gameObjectCollectingParametars/mouseEnterCollectingParametars";
import { ICoordinates } from "../interfaces/icoordinates";
import { GameObjectCollectingParametars } from "../interfaces/iGameObjectCollectingParametars";
import { GameObject } from "../uiObjects/gameObjects/abstractGameObject";
import { Circle } from "../uiObjects/gameObjects/circle";
import { ObjectFromInterfaceCreator } from "./objectFromInterfaceCreator";

export class RandomGenerator {
  static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getRandomGameObject(): GameObject {
    const colors: Color[] = [];
    colors.push(new Color("#A7D30C"));
    colors.push(new Color("#019F62"));
    return new Circle(
      ObjectFromInterfaceCreator.createOutterSquare(
        ObjectFromInterfaceCreator.createCoordinates(
          this.getRandomInt(100, 1800),
          this.getRandomInt(100, 900)
        ),
        100
      ),
      3,
      colors,
      new Color("black"),
      new Color("black"),
      FillStyle.radialGradient,
      this.getRandomGameObjectCollectingParametars()
    );
  }

  static getRandomColor(): string {
    switch (this.getRandomInt(0, 1)) {
      case 0:
        return "185, 122, 149";
      case 1:
        return "246, 174, 153";
      default:
        return "255,255,255";
    }
  }

  static getRandomGameObjectCollectingParametars(): GameObjectCollectingParametars {
    switch (this.getRandomInt(0, 2)) {
      case 0:
        return new MouseEnterCollectingParametars();
      case 1:
        return new MouseClickCollectingParametars(this.getRandomInt(1, 3));
      case 2:
        return new KeyPressWithMouseDownCollectingParametars(
          this.getRandomKey(),
          this.getRandomInt(1, 3)
        );
    }
  }

  static getRandomKey(): string {
    const alphabet = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    return alphabet[this.getRandomInt(0, alphabet.length - 1)];
  }

  static getRandomCoordinates(): ICoordinates {
    return {
      x: this.getRandomInt(100, 1820),
      y: this.getRandomInt(100, 980),
    };
  }
}
