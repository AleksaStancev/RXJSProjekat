import { fromEvent, interval, Observable, Subject, Subscription } from "rxjs";
import { delay, map, mapTo } from "rxjs/operators";
import { ICircle } from "../interfaces/icircle";
import { CircleEmittingObservables } from "../enumerations/circleemittingobservablesenum";
import {
  GetRandomCircle,
  GetRandomInt,
} from "../libraries/randomgenerationlibrary";
import { CircleEmittingSubjects } from "../enumerations/circleemittingsubjectsenum";
import { CoordinatesEmittingObservables } from "../enumerations/coordinatesemittingobservablesenum";
import { ICoordinates } from "../interfaces/icoordinates";
import { NumberEmittingObservables } from "../enumerations/numberemittingobservablesenum";
import { NumberEmittingSubjects } from "../enumerations/numberemittingsubjectsenum";
import { ControlSubjects } from "../enumerations/controlsubjectsenum";
import {
  SubjectAndObservableEmittingType as SubjectAndObservableEmittingValueType,
  GetSubjectOrObservableEnum,
  SubjectOrObservableType,
  GetEmittingValueType as GetEmittingValueType,
  SubjectOrObservableEnum,
  SubjectType,
  GetSubjectEnum,
  GetNextParametarType,
} from "../libraries/typelibrary";

export class ObservableAndSubjectProvider {
  private circleEmittingObservables: Map<
    CircleEmittingObservables,
    Observable<ICircle>
  >;

  private circleEmittingSubjects: Map<CircleEmittingSubjects, Subject<ICircle>>;

  private coordinatesEmittingObservables: Map<
    CoordinatesEmittingObservables,
    Observable<ICoordinates>
  >;
  private numberEmittingObservables: Map<
    NumberEmittingObservables,
    Observable<number>
  >;

  private numberEmittingSubjects: Map<NumberEmittingSubjects, Subject<number>>;

  private controlSubjects: Map<ControlSubjects, Subject<number>>;
  constructor() {
    this.setCircleEmittingObservables();

    this.setCircleEmittingSubjects();

    this.setCoordinatesEmittingObservables();

    this.setNumberEmittingObservables();
    this.setNumberEmittingSubjects();

    this.setControlSubjects();
  }

  getSubscriptionTo<
    SubjectOrObservableToSubscribeToType extends SubjectOrObservableType,
    SubjectOrObservableToSubscribeToEnum extends GetSubjectOrObservableEnum<SubjectOrObservableToSubscribeToType>,
    SubjectOrObservableToSubscribeToEmittinValueType extends GetEmittingValueType<SubjectOrObservableToSubscribeToType>
  >(
    subjectOrObservableToSubscribeToType: SubjectOrObservableToSubscribeToType,
    subjectOrObservableToSubscribeToEnumValue: SubjectOrObservableToSubscribeToEnum,
    subscriptionFunction: (
      emittedValue: SubjectOrObservableToSubscribeToEmittinValueType
    ) => void
  ): Subscription {
    let observableForSubscribing: Observable<SubjectAndObservableEmittingValueType>;
    switch (subjectOrObservableToSubscribeToType) {
      case ControlSubjects:
        observableForSubscribing =
          this.getSubjectOrObservableFromMapWithKeyValidation(
            this.controlSubjects,
            subjectOrObservableToSubscribeToEnumValue as ControlSubjects
          );
        break;
      case CircleEmittingSubjects:
        observableForSubscribing =
          this.getSubjectOrObservableFromMapWithKeyValidation(
            this.circleEmittingSubjects,
            subjectOrObservableToSubscribeToEnumValue as CircleEmittingSubjects
          );
        break;
      case NumberEmittingSubjects:
        observableForSubscribing =
          this.getSubjectOrObservableFromMapWithKeyValidation(
            this.numberEmittingSubjects,
            subjectOrObservableToSubscribeToEnumValue as NumberEmittingSubjects
          );
        break;
      case CircleEmittingObservables:
        observableForSubscribing =
          this.getSubjectOrObservableFromMapWithKeyValidation(
            this.circleEmittingObservables,
            subjectOrObservableToSubscribeToEnumValue as CircleEmittingObservables
          );
        break;
      case NumberEmittingObservables:
        observableForSubscribing =
          this.getSubjectOrObservableFromMapWithKeyValidation(
            this.numberEmittingObservables,
            subjectOrObservableToSubscribeToEnumValue as NumberEmittingObservables
          );
        break;
      case CoordinatesEmittingObservables:
        observableForSubscribing =
          this.getSubjectOrObservableFromMapWithKeyValidation(
            this.coordinatesEmittingObservables,
            subjectOrObservableToSubscribeToEnumValue as CoordinatesEmittingObservables
          );
        break;
      default:
        observableForSubscribing =
          new Observable<SubjectAndObservableEmittingValueType>();
        break;
    }
    return observableForSubscribing.subscribe(
      (emittedValue: SubjectOrObservableToSubscribeToEmittinValueType) =>
        subscriptionFunction(emittedValue)
    );
  }

  sendNextTo<
    SubjectToSendNextToType extends SubjectType,
    SubjectToSendNextToEnum extends GetSubjectEnum<SubjectToSendNextToType>,
    SubjectToSendNextToNextParametarType extends GetNextParametarType<SubjectToSendNextToType>
  >(
    subjectToSendNextToType: SubjectToSendNextToType,
    subjectToSendNextToEnumValue: SubjectToSendNextToEnum,
    subjectToSendNextToNextParametar: SubjectToSendNextToNextParametarType
  ): void {
    let subjectToNextTo: Subject<SubjectAndObservableEmittingValueType>;
    switch (subjectToSendNextToType) {
      case CircleEmittingSubjects:
        subjectToNextTo = this.getSubjectOrObservableFromMapWithKeyValidation(
          this.circleEmittingSubjects,
          subjectToSendNextToEnumValue as CircleEmittingSubjects
        );
        break;
      case ControlSubjects:
        subjectToNextTo = this.getSubjectOrObservableFromMapWithKeyValidation(
          this.controlSubjects,
          subjectToSendNextToEnumValue as ControlSubjects
        );
        break;
      case NumberEmittingSubjects:
        subjectToNextTo = this.getSubjectOrObservableFromMapWithKeyValidation(
          this.numberEmittingSubjects,
          subjectToSendNextToEnumValue as NumberEmittingSubjects
        );
        break;
      default:
        subjectToNextTo = new Subject<SubjectToSendNextToNextParametarType>();
        break;
    }
    subjectToNextTo.next(subjectToSendNextToNextParametar);
  }

  private getSubjectOrObservableFromMapWithKeyValidation<
    SubjectOrObservableToGetEnum extends SubjectOrObservableEnum,
    SubjectOrObservableToGetType extends Observable<SubjectAndObservableEmittingValueType>
  >(
    map: Map<SubjectOrObservableToGetEnum, SubjectOrObservableToGetType>,
    keyValue: SubjectOrObservableToGetEnum
  ): SubjectOrObservableToGetType {
    return map.has(keyValue) ? map.get(keyValue) : null;
  }

  private setCircleEmittingObservables(): void {
    this.circleEmittingObservables = new Map<
      CircleEmittingObservables,
      Observable<ICircle>
    >();

    this.circleEmittingObservables.set(
      CircleEmittingObservables.circleGenerated,
      interval(500).pipe(
        delay(GetRandomInt(0, 100)),
        map(() => GetRandomCircle())
      )
    );
  }

  private setCircleEmittingSubjects(): void {
    this.circleEmittingSubjects = new Map<
      CircleEmittingSubjects,
      Subject<ICircle>
    >();

    for (const value in CircleEmittingSubjects) {
      const numberValue = Number(value);
      if (!isNaN(numberValue))
        this.circleEmittingSubjects.set(numberValue, new Subject<ICircle>());
    }
  }

  private setCoordinatesEmittingObservables(): void {
    this.coordinatesEmittingObservables = new Map<
      CoordinatesEmittingObservables,
      Observable<ICoordinates>
    >();

    this.coordinatesEmittingObservables.set(
      CoordinatesEmittingObservables.mouseMove,
      fromEvent<MouseEvent>(document, "mousemove").pipe(
        map((mouseEvent: MouseEvent) => ({ x: mouseEvent.x, y: mouseEvent.y }))
      )
    );

    this.coordinatesEmittingObservables.set(
      CoordinatesEmittingObservables.mouseDown,
      fromEvent<MouseEvent>(document, "mousedown").pipe(
        map((mouseEvent: MouseEvent) => ({ x: mouseEvent.x, y: mouseEvent.y }))
      )
    );

    this.coordinatesEmittingObservables.set(
      CoordinatesEmittingObservables.mouseUp,
      fromEvent<MouseEvent>(document, "mouseup").pipe(
        map((mouseEvent: MouseEvent) => ({ x: mouseEvent.x, y: mouseEvent.y }))
      )
    );
  }

  private setNumberEmittingObservables(): void {
    this.numberEmittingObservables = new Map<
      NumberEmittingObservables,
      Observable<number>
    >();
    this.numberEmittingObservables.set(
      NumberEmittingObservables.timeToLiveTimer,
      interval(1000).pipe(mapTo(1))
    );
  }

  private setNumberEmittingSubjects(): void {
    this.numberEmittingSubjects = new Map<
      NumberEmittingSubjects,
      Subject<number>
    >();

    this.numberEmittingSubjects.set(
      NumberEmittingSubjects.scoreChanged,
      new Subject<number>()
    );

    this.numberEmittingSubjects.set(
      NumberEmittingSubjects.numberOfLivesChanged,
      new Subject<number>()
    );
  }
  private setControlSubjects(): void {
    this.controlSubjects = new Map<ControlSubjects, Subject<number>>();

    for (const value in ControlSubjects) {
      const numberValue = Number(value);
      if (!isNaN(numberValue))
        this.controlSubjects.set(numberValue, new Subject<number>());
    }
  }
}
