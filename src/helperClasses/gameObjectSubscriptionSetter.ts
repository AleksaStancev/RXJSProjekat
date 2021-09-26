import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { GameObjectStatus } from "../enumerations/gameObjects/gameObjectStatus";
import { CoordinatesEmittingObservables } from "../enumerations/observables/coordinatesemittingobservablesenum";
import { KeyAndCoordinatesEmittingObservables } from "../enumerations/observables/keyAndCoordinatesEmittingObservables";
import { NumberEmittingObservables } from "../enumerations/observables/numberEmittingObservables";
import { ColissionCheckSubjects } from "../enumerations/subjects/colissionCheckSubjects";
import { GameObjectEmittingSubjects } from "../enumerations/subjects/gameObjectEmittingSubjects";
import { KeyPressWithMouseDownCollectingParametars } from "../gameObjectCollectingParametars/keyPressWithMouseDownCollectingParametars";
import { MouseClickCollectingParametars } from "../gameObjectCollectingParametars/mouseClickCollectingParametars";
import { MouseEnterCollectingParametars } from "../gameObjectCollectingParametars/mouseEnterCollectingParametars";
import { IColissionCheckStatus } from "../interfaces/iColissionCheckStatus";
import { ICoordinates } from "../interfaces/icoordinates";
import { GameObjectCollectingParametars } from "../interfaces/iGameObjectCollectingParametars";
import { IKeyAndCoordinates } from "../interfaces/iKeyAndCoordinates";
import { IPathAndPaintingStyle } from "../interfaces/ui/iPathAndPaintingStyle";
import {
  GameObjectSubscriptionObservableKeyTypes,
  GameObjectSubscriptionSubjectKeyTypes,
  GetEmittingValueTypeFromObservableType,
  GetEmittingValueTypeFromSubjectType,
  GetObservableEnumFromObservableType,
  GetSubjectEnumFromSubjectType,
} from "../libraries/typeLibrary";
import { UIManager } from "../managers/uiManager";
import { ObservableAndSubjectProvider } from "../providers/observableAndSubjectProvider";
import { Geometry } from "../staticClasses/geometry";
import { GameObject } from "../uiObjects/gameObjects/abstractGameObject";

export class GameObjectSubscriptionSetter {
  private observableAndSubjectProvider: ObservableAndSubjectProvider;
  constructor(observableAndSubjectProvider: ObservableAndSubjectProvider) {
    this.observableAndSubjectProvider = observableAndSubjectProvider;
  }

  public setSubscriptionsForGameObject(
    gameObjectForSettingSubscriptions: GameObject
  ): void {
    this.addCollectionHandlerToGameObject(gameObjectForSettingSubscriptions);

    this.addSubscriptionToSubjectToGameObject(
      gameObjectForSettingSubscriptions,
      ColissionCheckSubjects,
      ColissionCheckSubjects.colissionCheck,
      (colissionCheckStatus: IColissionCheckStatus) =>
        this.colissionCheckHandlerForGameObject(
          gameObjectForSettingSubscriptions,
          colissionCheckStatus
        )
    );

    this.addSubscriptionToObservableToGameObject(
      gameObjectForSettingSubscriptions,
      NumberEmittingObservables,
      NumberEmittingObservables.timeToLiveTimer,
      (timeToLiveTimerTick: number) =>
        this.timeToLiveTimerHandlerForGameObject(
          gameObjectForSettingSubscriptions,
          timeToLiveTimerTick
        )
    );
  }

  private addSubscriptionToObservableToGameObject<
    ObservableType extends GameObjectSubscriptionObservableKeyTypes
  >(
    gameObjectToAddSubscriptionTo: GameObject,
    observableType: ObservableType,
    enumValue: GetObservableEnumFromObservableType<ObservableType>,
    subscription: (
      emittedValue: GetEmittingValueTypeFromObservableType<ObservableType>
    ) => void
  ): void {
    gameObjectToAddSubscriptionTo.insertSubscription(
      enumValue,
      this.observableAndSubjectProvider.getSubscriptionToObservable(
        observableType,
        enumValue,
        subscription
      )
    );
  }

  private addSubscriptionToSubjectToGameObject<
    SubjectType extends GameObjectSubscriptionSubjectKeyTypes
  >(
    gameObjectToAddSubscriptionTo: GameObject,
    observableType: SubjectType,
    enumValue: GetSubjectEnumFromSubjectType<SubjectType>,
    subscription: (
      emittedValue: GetEmittingValueTypeFromSubjectType<SubjectType>
    ) => void
  ): void {
    gameObjectToAddSubscriptionTo.insertSubscription(
      enumValue,
      this.observableAndSubjectProvider.getSubscriptionToSubject(
        observableType,
        enumValue,
        subscription
      )
    );
  }

  private addCollectionHandlerToGameObject(
    gameObjectForSettingSubscriptions: GameObject
  ): void {
    const subjectToTakeUntill: Subject<any> = new Subject<any>();
    const collectingParametars: GameObjectCollectingParametars =
      gameObjectForSettingSubscriptions.getCollectingParametars();
    if (collectingParametars instanceof MouseEnterCollectingParametars) {
      this.addSubscriptionToObservableToGameObject(
        gameObjectForSettingSubscriptions,
        CoordinatesEmittingObservables,
        CoordinatesEmittingObservables.mouseMove,
        (mouseCoordinates: ICoordinates) =>
          this.mouseEnteredCollectingHandlerForGameObject(
            subjectToTakeUntill,
            gameObjectForSettingSubscriptions,
            mouseCoordinates
          )
      );
      return;
    }
    if (collectingParametars instanceof MouseClickCollectingParametars) {
      this.addSubscriptionToObservableToGameObject(
        gameObjectForSettingSubscriptions,
        CoordinatesEmittingObservables,
        CoordinatesEmittingObservables.mouseClicked,
        (mouseCoordinates: ICoordinates) =>
          this.mouseClickedCollectingHandlerForGameObject(
            subjectToTakeUntill,
            gameObjectForSettingSubscriptions,
            collectingParametars,
            mouseCoordinates
          )
      );
      return;
    }
    if (
      collectingParametars instanceof KeyPressWithMouseDownCollectingParametars
    ) {
      const keyToPress = collectingParametars.getKeyToPress();
      this.addSubscriptionToObservableToGameObject(
        gameObjectForSettingSubscriptions,
        KeyAndCoordinatesEmittingObservables,
        KeyAndCoordinatesEmittingObservables.keyPressWithMouseDown,
        (keyAndCoordinates: IKeyAndCoordinates) => {
          if (keyToPress === keyAndCoordinates.key)
            this.keyPressWithMouseDownCollectionHandlerForGameObject(
              subjectToTakeUntill,
              gameObjectForSettingSubscriptions,
              collectingParametars,
              keyAndCoordinates
            );
        }
      );
      return;
    }
  }

  private timeToLiveTimerHandlerForGameObject(
    gameObject: GameObject,
    timeToLiveTimerTickDecrementFactor: number
  ): void {
    gameObject.decrementTimeToLive(timeToLiveTimerTickDecrementFactor);
    if (gameObject.getTimeToLive() <= 0) {
      gameObject.setStatus(GameObjectStatus.Dead);
      this.observableAndSubjectProvider.sendNextTo(
        GameObjectEmittingSubjects,
        GameObjectEmittingSubjects.timeToLiveExpired,
        gameObject
      );
    }
  }

  private getPathsAndPaintingStylesFromGameObjectUntilSubjectEmitts(
    gameObject: GameObject,
    subjectToTakeUntill: Subject<any>
  ): Observable<IPathAndPaintingStyle> {
    return gameObject
      .getPathsAndPaintingStyles$()
      .pipe(takeUntil(subjectToTakeUntill));
  }

  private collectGameObject(
    gameObject: GameObject,
    subjectToTakeUntill: Subject<any>
  ): void {
    gameObject.setStatus(GameObjectStatus.Collected);
    this.observableAndSubjectProvider.sendNextTo(
      GameObjectEmittingSubjects,
      GameObjectEmittingSubjects.gameObjectCollected,
      gameObject
    );
    subjectToTakeUntill.next();
  }

  private mouseEnteredCollectingHandlerForGameObject(
    subjectToTakeUntill: Subject<any>,
    gameObject: GameObject,
    mouseCoordinates: ICoordinates
  ) {
    this.getPathsAndPaintingStylesFromGameObjectUntilSubjectEmitts(
      gameObject,
      subjectToTakeUntill
    ).subscribe((pathAndPaintingStyle: IPathAndPaintingStyle) => {
      if (
        UIManager.checkIfPointIsInPath(
          pathAndPaintingStyle.path,
          mouseCoordinates
        )
      )
        this.collectGameObject(gameObject, subjectToTakeUntill);
    });
  }

  private mouseClickedCollectingHandlerForGameObject(
    subjectToTakeUntill: Subject<any>,
    gameObject: GameObject,
    collectingParametars: MouseClickCollectingParametars,
    mouseCoordinates: ICoordinates
  ) {
    this.getPathsAndPaintingStylesFromGameObjectUntilSubjectEmitts(
      gameObject,
      subjectToTakeUntill
    ).subscribe((pathAndPaintingStyle: IPathAndPaintingStyle) => {
      if (
        UIManager.checkIfPointIsInPath(
          pathAndPaintingStyle.path,
          mouseCoordinates
        )
      ) {
        if (collectingParametars.registerMouseClick() === 0)
          this.collectGameObject(gameObject, subjectToTakeUntill);

        gameObject.updateTextsFromCollectingParametars();
        this.observableAndSubjectProvider.sendNextTo(
          GameObjectEmittingSubjects,
          GameObjectEmittingSubjects.renderGameObject,
          gameObject
        );
      }
    });
  }

  private keyPressWithMouseDownCollectionHandlerForGameObject(
    subjectToTakeUntill: Subject<any>,
    gameObject: GameObject,
    collectingParametars: KeyPressWithMouseDownCollectingParametars,
    keyAndCoordinates: IKeyAndCoordinates
  ): void {
    this.getPathsAndPaintingStylesFromGameObjectUntilSubjectEmitts(
      gameObject,
      subjectToTakeUntill
    ).subscribe((pathAndPaintingStyle: IPathAndPaintingStyle) => {
      if (
        UIManager.checkIfPointIsInPath(
          pathAndPaintingStyle.path,
          keyAndCoordinates.coordinates
        )
      ) {
        if (collectingParametars.registerKeyPressed() === 0)
          this.collectGameObject(gameObject, subjectToTakeUntill);

        gameObject.updateTextsFromCollectingParametars();
        this.observableAndSubjectProvider.sendNextTo(
          GameObjectEmittingSubjects,
          GameObjectEmittingSubjects.renderGameObject,
          gameObject
        );
      }
    });
  }

  private colissionCheckHandlerForGameObject(
    gameObject: GameObject,
    colissionCheckStatus: IColissionCheckStatus
  ): void {
    if (
      colissionCheckStatus.colissionCheckSuccessful &&
      Geometry.checkIfPointIsInOutterSquareOfGameObject(
        colissionCheckStatus.gameObjectCheckingForColission.getOutterSquare()
          .outterSquareTopLeftCornerCoordinates,
        gameObject.getOutterSquare()
      )
    )
      colissionCheckStatus.colissionCheckSuccessful = false;
    colissionCheckStatus.gameObjectsLeftToCheckColission--;
    this.observableAndSubjectProvider.sendNextTo(
      ColissionCheckSubjects,
      ColissionCheckSubjects.colissionCheckResponse,
      colissionCheckStatus
    );
  }
}
