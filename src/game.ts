import { fromEvent, interval, Observable, Subject } from "rxjs";
import { delay, map, share } from "rxjs/operators";
import { Animations } from "./enumerations/animationsenum";
import { CircleSubjects } from "./enumerations/circleemittingsubjectsenum";
import { MouseEvents } from "./enumerations/icoordinatesemittingobservablesenum";
import { GameStateManager } from "./managers/gamestatemanager";
import { ICircle } from "./interfaces/icircle";
import { ICoordinates } from "./interfaces/icoordinates";
import {
  GetRandomCircle,
  GetRandomInt,
} from "./libraries/randomgenerationlibrary";
import { UIManager } from "./managers/uimanager";
import { circleEmittingSubjects } from "./observableMaps/circleemittingsubjectsmap";
import { iCoordinatesEmittingObservables } from "./observableMaps/icoordinatesemittingobservablesmap";
import { circleEmittingObservables } from "./observableMaps/circleemittingobservablesmap";

export class Game {
  private uiManager: UIManager;
  private gameState: GameStateManager;

  constructor() {
    this.uiManager = new UIManager();
    this.gameState = new GameStateManager();

  }

  startGame(): void {
    this.uiManager.renderCanvas();
  }
}
