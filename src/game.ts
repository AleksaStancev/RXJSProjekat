
import { ControlSubjects } from "./enumerations/subjects/controlsubjectsenum";
import { GameStateManager } from "./managers/gamestatemanager";

import { UIManager } from "./managers/uimanager";
import { ObservableAndSubjectProvider } from "./providers/observableandsubjectprovider";

export class Game {
  private observableAndSubjectManager: ObservableAndSubjectProvider;
  private uiManager: UIManager;
  private gameState: GameStateManager;

  constructor() {
    this.observableAndSubjectManager = new ObservableAndSubjectProvider();
    this.uiManager = new UIManager(this.observableAndSubjectManager);
    this.gameState = new GameStateManager(this.observableAndSubjectManager);

    /*this.observableAndSubjectManager
      .getControlSubject(ControlSubjects.startCircleGeneration)
      .next();*/

    this.observableAndSubjectManager.sendNextTo(
      ControlSubjects,
      ControlSubjects.startCircleGeneration,
      1
    );
  }

  startGame(): void {}
}
