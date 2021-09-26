import { from } from "rxjs";
import { filter, toArray } from "rxjs/operators";
import { GameObjectStatus } from "../enumerations/gameObjects/gameObjectStatus";
import { GameObjectEmittingObservables } from "../enumerations/observables/gameObjectEmittingObservables";
import { ColissionCheckSubjects } from "../enumerations/subjects/colissionCheckSubjects";
import { ControlSubjects } from "../enumerations/subjects/controlSubjects";
import { GameObjectEmittingSubjects } from "../enumerations/subjects/gameObjectEmittingSubjects";
import { NumberEmittingSubjects } from "../enumerations/subjects/numberEmittingSubjects";
import { GameObjectSubscriptionSetter } from "../helperClasses/gameObjectSubscriptionSetter";
import { IColissionCheckStatus } from "../interfaces/iColissionCheckStatus";
import { ObservableAndSubjectProvider } from "../providers/observableAndSubjectProvider";
import { ObjectFromInterfaceCreator } from "../staticClasses/objectFromInterfaceCreator";
import { GameObject } from "../uiObjects/gameObjects/abstractGameObject";
import { AbstractManager } from "./abstractManager";

export class GameStateManager extends AbstractManager {
  private gameObjects: GameObject[];
  private points: number;
  private lives: number;

  private gameObjectSubscriptionSetter: GameObjectSubscriptionSetter;

  constructor(observableAndSubjectProvider: ObservableAndSubjectProvider) {
    super(observableAndSubjectProvider);
    this.gameObjects = [];
    this.points = 0;
    this.lives = 3;

    this.gameObjectSubscriptionSetter = new GameObjectSubscriptionSetter(
      observableAndSubjectProvider
    );

    this.sendNextTo(
      NumberEmittingSubjects,
      NumberEmittingSubjects.scoreChanged,
      this.points
    );

    this.sendNextTo(
      NumberEmittingSubjects,
      NumberEmittingSubjects.numberOfLivesChanged,
      this.lives
    );

    this.subscribeToSubject(
      GameObjectEmittingSubjects,
      GameObjectEmittingSubjects.gameObjectRemovedFromCanvas,
      (gameObject: GameObject) => this.removeGameObjectFromGameState(gameObject)
    );

    this.subscribeToSubject(
      ControlSubjects,
      ControlSubjects.startGameObjectGeneration,
      (_) => this.startGameObjectGenerationHandler()
    );

    this.subscribeToSubject(
      ControlSubjects,
      ControlSubjects.stopGameObjectGeneration,
      (_) =>
        this.removeSubscription(
          GameObjectEmittingObservables.gameObjectGenerated
        )
    );

    this.subscribeToSubject(
      ColissionCheckSubjects,
      ColissionCheckSubjects.colissionCheckResponse,
      (newGameObject: IColissionCheckStatus) =>
        this.collisionCheckResponseHandler(newGameObject)
    );

    this.subscribeToSubject(
      GameObjectEmittingSubjects,
      GameObjectEmittingSubjects.gameObjectCollected,
      (collectedObject: GameObject) =>
        this.gameObjectCollectedHandler(collectedObject)
    );

    this.subscribeToSubject(
      GameObjectEmittingSubjects,
      GameObjectEmittingSubjects.timeToLiveExpired,
      (deadObject: GameObject) => this.timeToLiveExpiredHandler(deadObject)
    );
  }

  private addGameObjectToGameState(gameObjectToAdd: GameObject): void {
    this.gameObjectSubscriptionSetter.setSubscriptionsForGameObject(
      gameObjectToAdd
    );
    this.gameObjects.push(gameObjectToAdd);
    this.sendNextTo(
      GameObjectEmittingSubjects,
      GameObjectEmittingSubjects.renderGameObject,
      gameObjectToAdd
    );
  }

  private removeGameObjectFromGameState(gameObjectToRemove: GameObject): void {
    from(this.gameObjects)
      .pipe(
        filter((gameObject: GameObject) => gameObject !== gameObjectToRemove),
        toArray()
      )
      .subscribe((newGameObjects: GameObject[]) => {
        gameObjectToRemove.removeSubscriptionsAfterRemovingFromCanvas();
        this.gameObjects = newGameObjects;
      });
  }

  private removeAllGameObjectsFromGameState(): void {
    from(this.gameObjects).subscribe((gameObject: GameObject) => {
      {
        gameObject.setStatus(GameObjectStatus.Terminated);
        gameObject.removeAllSubscriptions();
        this.sendNextTo(
          GameObjectEmittingSubjects,
          GameObjectEmittingSubjects.renderGameObject,
          gameObject
        );
      }
    });
  }

  private timeToLiveExpiredHandler(deadGameObject: GameObject): void {
    this.lives--;
    this.sendNextTo(
      NumberEmittingSubjects,
      NumberEmittingSubjects.numberOfLivesChanged,
      this.lives
    );
    this.removeGameObjectHandler(deadGameObject);
    if (this.lives === 0) {
      this.sendNextTo(
        ControlSubjects,
        ControlSubjects.stopGameObjectGeneration,
        null
      );
      this.removeAllGameObjectsFromGameState();
      this.gameObjects = [];
    }
  }

  private collisionCheckResponseHandler(
    colissionCheckStatus: IColissionCheckStatus
  ): void {
    if (
      colissionCheckStatus.gameObjectsLeftToCheckColission === 0 &&
      colissionCheckStatus.colissionCheckSuccessful
    )
      this.addGameObjectToGameState(
        colissionCheckStatus.gameObjectCheckingForColission
      );
  }

  private gameObjectCollectedHandler(collectedGameObject: GameObject): void {
    this.removeGameObjectHandler(collectedGameObject);
    this.points++;
    this.sendNextTo(
      NumberEmittingSubjects,
      NumberEmittingSubjects.scoreChanged,
      this.points
    );
  }

  private removeGameObjectHandler(gameObjectToRemove: GameObject): void {
    gameObjectToRemove.removeSubscriptionsBeforeRemovingFromCanvas();
    this.sendNextTo(
      GameObjectEmittingSubjects,
      GameObjectEmittingSubjects.renderGameObject,
      gameObjectToRemove
    );
  }

  private startGameObjectGenerationHandler(): void {
    this.subscribeToObservable(
      GameObjectEmittingObservables,
      GameObjectEmittingObservables.gameObjectGenerated,
      (newGameObject: GameObject) => {
        this.gameObjectGeneratedHandler(newGameObject);
      }
    );
  }

  private gameObjectGeneratedHandler(newGameObject: GameObject): void {
    if (this.gameObjects.length > 0) {
      this.sendNextTo(
        ColissionCheckSubjects,
        ColissionCheckSubjects.colissionCheck,
        ObjectFromInterfaceCreator.createColissionCheckStatus(
          newGameObject,
          this.gameObjects.length
        )
      );
    } else this.addGameObjectToGameState(newGameObject);
  }
}
