import {
  fromEvent,
  interval,
  merge,
  Observable,
  Subject,
  Subscription,
} from "rxjs";
import { delay, map, mapTo, switchMap, takeUntil } from "rxjs/operators";
import { CoordinatesEmittingObservables } from "../enumerations/observables/coordinatesemittingobservablesenum";
import { GameObjectEmittingObservables } from "../enumerations/observables/gameObjectEmittingObservables";
import { KeyAndCoordinatesEmittingObservables } from "../enumerations/observables/keyAndCoordinatesEmittingObservables";
import { NumberEmittingObservables } from "../enumerations/observables/numberEmittingObservables";
import { ColissionCheckSubjects } from "../enumerations/subjects/colissionCheckSubjects";
import { ControlSubjects } from "../enumerations/subjects/controlSubjects";
import { GameObjectEmittingSubjects } from "../enumerations/subjects/gameObjectEmittingSubjects";
import { NumberEmittingSubjects } from "../enumerations/subjects/numberEmittingSubjects";
import { ICoordinates } from "../interfaces/icoordinates";
import {
  GetEmittingValueTypeFromObservableType as GetEmittingValueTypeFromObservableType,
  GetEmittingValueTypeFromSubjectType,
  GetObservableEnumFromObservableType,
  GetSubjectEnumFromSubjectType,
  ObservableEmittingTypes,
  ObservableEnum,
  ObservableType,
  SubjectEmittingTypes,
  SubjectEnum,
  SubjectType,
} from "../libraries/typeLibrary";
import { ObjectFromInterfaceCreator } from "../staticClasses/objectFromInterfaceCreator";
import { RandomGenerator } from "../staticClasses/randomGenerator";
import { Utility } from "../staticClasses/utility";

export class ObservableAndSubjectProvider {
  private subjects: Map<SubjectEnum, Subject<SubjectEmittingTypes>>;
  private observables: Map<ObservableEnum, Observable<ObservableEmittingTypes>>;

  constructor() {
    this.subjects = new Map<SubjectEnum, Subject<SubjectEmittingTypes>>();
    this.observables = new Map<
      ObservableEnum,
      Observable<ObservableEmittingTypes>
    >();

    this.setGameObjectEmittingObservables();

    this.setSubjectForEachEnumValueForPassedSubjectType(
      GameObjectEmittingSubjects
    );

    this.setCoordinatesEmittingObservables();

    this.setNumberEmittingObservables();
    this.setNumberEmittingSubjects();

    this.setSubjectForEachEnumValueForPassedSubjectType(ControlSubjects);
    this.setSubjectForEachEnumValueForPassedSubjectType(ColissionCheckSubjects);
    this.setKeyAndCoordinatesEmittingObservables();
  }

  getSubscriptionToObservable<ObservableToSubscribeTo extends ObservableType>(
    observableToSubscribeToType: ObservableToSubscribeTo,
    observableToSubscribeToEnumValue: GetObservableEnumFromObservableType<ObservableToSubscribeTo>,
    subscriptionFunction: (
      emittedValue: GetEmittingValueTypeFromObservableType<ObservableToSubscribeTo>
    ) => void
  ): Subscription {
    return this.getObservableFromMapWithKeyValidation(
      observableToSubscribeToType,
      observableToSubscribeToEnumValue
    )?.subscribe(
      (
        emittedValue: GetEmittingValueTypeFromObservableType<ObservableToSubscribeTo>
      ) => subscriptionFunction(emittedValue)
    );
  }

  getSubscriptionToSubject<SubjectToSubscribeTo extends SubjectType>(
    subjectToSubscribeToType: SubjectToSubscribeTo,
    subjectToSubscribeToEnumValue: GetSubjectEnumFromSubjectType<SubjectToSubscribeTo>,
    subscriptionFunction: (
      emittedValue: GetEmittingValueTypeFromSubjectType<SubjectToSubscribeTo>
    ) => void
  ): Subscription {
    return this.getSubjectFromMapWithKeyValidation(
      subjectToSubscribeToType,
      subjectToSubscribeToEnumValue
    )?.subscribe(
      (
        emittedValue: GetEmittingValueTypeFromSubjectType<SubjectToSubscribeTo>
      ) => subscriptionFunction(emittedValue)
    );
  }

  sendNextTo<SubjectToSendNextToType extends SubjectType>(
    subjectToSendNextToType: SubjectToSendNextToType,
    subjectToSendNextToEnumValue: GetSubjectEnumFromSubjectType<SubjectToSendNextToType>,
    subjectToSendNextToNextParametar: GetEmittingValueTypeFromSubjectType<SubjectToSendNextToType>
  ): void {
    this.getSubjectFromMapWithKeyValidation(
      subjectToSendNextToType,
      subjectToSendNextToEnumValue
    )?.next(subjectToSendNextToNextParametar);
  }

  private getObservableFromMapWithKeyValidation<
    PassedObservableType extends ObservableType
  >(
    observableType: PassedObservableType,
    keyValue: GetObservableEnumFromObservableType<PassedObservableType>
  ): Observable<GetEmittingValueTypeFromObservableType<PassedObservableType>> {
    return <
      Observable<GetEmittingValueTypeFromObservableType<PassedObservableType>>
    >Utility.getFromMapWithKeyValidation(this.observables, keyValue);
  }

  private getSubjectFromMapWithKeyValidation<
    PassedSubjectType extends SubjectType
  >(
    subjectType: PassedSubjectType,
    keyValue: GetSubjectEnumFromSubjectType<PassedSubjectType>
  ): Subject<GetEmittingValueTypeFromSubjectType<PassedSubjectType>> {
    return <Subject<GetEmittingValueTypeFromSubjectType<PassedSubjectType>>>(
      Utility.getFromMapWithKeyValidation(this.subjects, keyValue)
    );
  }

  private setGameObjectEmittingObservables(): void {
    this.addToObservables(
      GameObjectEmittingObservables,
      GameObjectEmittingObservables.gameObjectGenerated,
      interval(1000).pipe(
        delay(RandomGenerator.getRandomInt(0, 500)),
        map((_) => RandomGenerator.getRandomGameObject())
      )
    );
  }

  private setCoordinatesEmittingObservables(): void {
    this.addToObservables(
      CoordinatesEmittingObservables,
      CoordinatesEmittingObservables.mouseMove,
      fromEvent<MouseEvent>(document, "mousemove").pipe(
        map((mouseEvent: MouseEvent) => ({ x: mouseEvent.x, y: mouseEvent.y }))
      )
    );

    this.addToObservables(
      CoordinatesEmittingObservables,
      CoordinatesEmittingObservables.mouseDown,
      fromEvent<MouseEvent>(document, "mousedown").pipe(
        map((mouseEvent: MouseEvent) => ({ x: mouseEvent.x, y: mouseEvent.y }))
      )
    );

    this.addToObservables(
      CoordinatesEmittingObservables,
      CoordinatesEmittingObservables.mouseUp,
      fromEvent<MouseEvent>(document, "mouseup").pipe(
        map((mouseEvent: MouseEvent) => ({ x: mouseEvent.x, y: mouseEvent.y }))
      )
    );

    this.addToObservables(
      CoordinatesEmittingObservables,
      CoordinatesEmittingObservables.mouseClicked,
      fromEvent<MouseEvent>(document, "click").pipe(
        map((mouseEvent: MouseEvent) => ({ x: mouseEvent.x, y: mouseEvent.y }))
      )
    );
  }

  private setNumberEmittingObservables(): void {
    this.addToObservables(
      NumberEmittingObservables,
      NumberEmittingObservables.timeToLiveTimer,
      interval(1000).pipe(mapTo(1))
    );
  }

  private setKeyAndCoordinatesEmittingObservables(): void {
    this.addToObservables(
      KeyAndCoordinatesEmittingObservables,
      KeyAndCoordinatesEmittingObservables.keyPressWithMouseDown,
      this.getObservableFromMapWithKeyValidation(
        CoordinatesEmittingObservables,
        CoordinatesEmittingObservables.mouseDown
      ).pipe(
        switchMap((mouseDownCoordinates: ICoordinates) =>
          fromEvent<KeyboardEvent>(document, "keydown").pipe(
            takeUntil(
              merge(
                this.getObservableFromMapWithKeyValidation(
                  CoordinatesEmittingObservables,
                  CoordinatesEmittingObservables.mouseMove
                ),
                this.getObservableFromMapWithKeyValidation(
                  CoordinatesEmittingObservables,
                  CoordinatesEmittingObservables.mouseUp
                )
              )
            ),
            map((keyDown) =>
              ObjectFromInterfaceCreator.createKeyAndCoordinates(
                keyDown.key,
                mouseDownCoordinates
              )
            )
          )
        )
      )
    );
  }

  private setNumberEmittingSubjects(): void {
    this.addToSubjects(
      NumberEmittingSubjects,
      NumberEmittingSubjects.scoreChanged,
      new Subject<number>()
    );

    this.addToSubjects(
      NumberEmittingSubjects,
      NumberEmittingSubjects.numberOfLivesChanged,
      new Subject<number>()
    );
  }

  private setSubjectForEachEnumValueForPassedSubjectType<
    PassedSubjectType extends SubjectType
  >(passedSubjectType: PassedSubjectType): void {
    for (const value in passedSubjectType) {
      const numberValue = Number(value);
      if (!isNaN(numberValue))
        this.addToSubjects(
          passedSubjectType,
          numberValue as GetSubjectEnumFromSubjectType<PassedSubjectType>,
          new Subject<GetEmittingValueTypeFromSubjectType<PassedSubjectType>>()
        );
    }
  }

  private addToSubjects<PassedSubjectType extends SubjectType>(
    subjectType: PassedSubjectType,
    subjectEnum: GetSubjectEnumFromSubjectType<PassedSubjectType>,
    subject: Subject<GetEmittingValueTypeFromSubjectType<PassedSubjectType>>
  ): void {
    this.subjects.set(subjectEnum, subject);
  }

  private addToObservables<PassedObservableType extends ObservableType>(
    observableType: PassedObservableType,
    observableEnum: GetObservableEnumFromObservableType<PassedObservableType>,
    observable: Observable<
      GetEmittingValueTypeFromObservableType<PassedObservableType>
    >
  ): void {
    this.observables.set(observableEnum, observable);
  }
}
