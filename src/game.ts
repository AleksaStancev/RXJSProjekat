import { fromEvent, interval, Observable, Subject } from "rxjs";
import { delay, map, share } from "rxjs/operators";
import { Animations } from "./enumerations/animationsenum";
import { CircleEvents } from "./enumerations/circleeventsenum";
import { CircleSubjects } from "./enumerations/circlesubjectsenum";
import { MouseEvents } from "./enumerations/mouseeventsenum";
import { GameStateManager } from "./managers/gamestatemanager";
import { ICircle } from "./interfaces/icircle";
import { ICoordinates } from "./interfaces/icoordinates";
import {
  getRandomCircle,
  getRandomInt,
} from "./libraries/randomgenerationlibrary";
import { UIManager } from "./managers/uimanager";
import { circleSubjects } from "./maps/circlesubjectsmap";
import { mouseEvents } from "./maps/mouseeventsmap";
import { circleEvents } from "./maps/circleeventsmap";

export class Game {
  private uiManager: UIManager;
  private gameState: GameStateManager;

  constructor() {
    this.gameState = new GameStateManager();
    this.uiManager = new UIManager();
  }

  startGame(): void {
    this.uiManager.renderCanvas();
  }
}
