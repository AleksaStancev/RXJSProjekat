import { ControlSubjects } from "./enumerations/subjects/controlSubjects";
import { GameStateManager } from "./managers/gameStateManager";
import { UIManager } from "./managers/uiManager";
import { ObservableAndSubjectProvider } from "./providers/observableAndSubjectProvider";


export class Game {
  private observableAndSubjectManager: ObservableAndSubjectProvider;
  private uiManager: UIManager;
  private gameState: GameStateManager;

  constructor() {
    this.observableAndSubjectManager = new ObservableAndSubjectProvider();
    this.uiManager = new UIManager(this.observableAndSubjectManager);
    this.gameState = new GameStateManager(this.observableAndSubjectManager);

    this.observableAndSubjectManager.sendNextTo(
      ControlSubjects,
      ControlSubjects.startGameObjectGeneration,
      null
    );
  }

  startGame(): void {}
}
