import {
  GetEmittingValueTypeFromObservableType,
  GetEmittingValueTypeFromSubjectType,
  GetObservableEnumFromObservableType,
  GetSubjectEnumFromSubjectType,
  ManagersSubscriptionKeyEnum,
  ObservableType,
  SubjectType
} from "../libraries/typeLibrary";
import { ObservableAndSubjectProvider } from "../providers/observableAndSubjectProvider";
import { SubscriptionManager } from "./abstractSubscriptionManager";

export abstract class AbstractManager extends SubscriptionManager<ManagersSubscriptionKeyEnum> {
  private observableAndSubjectProvider: ObservableAndSubjectProvider;
  constructor(observableAndSubjectProvider: ObservableAndSubjectProvider) {
    super();
    this.observableAndSubjectProvider = observableAndSubjectProvider;
  }

  protected subscribeToObservable<
    ObservableToSubscribeToType extends ObservableType
  >(
    observableToSubscribeToType: ObservableToSubscribeToType,
    observableToSubscribeToEnumValue: GetObservableEnumFromObservableType<ObservableToSubscribeToType>,
    subscriptionFunction: (
      emittedValue: GetEmittingValueTypeFromObservableType<ObservableToSubscribeToType>
    ) => void
  ): void {
    const subscriptionToAdd =
      this.observableAndSubjectProvider.getSubscriptionToObservable(
        observableToSubscribeToType,
        observableToSubscribeToEnumValue,
        subscriptionFunction
      );
    this.addSubscription(observableToSubscribeToEnumValue, subscriptionToAdd);
  }

  protected subscribeToSubject<SubjectSubscribeToType extends SubjectType>(
    subjectToSubscribeToType: SubjectSubscribeToType,
    subjectToSubscribeToEnumValue: GetSubjectEnumFromSubjectType<SubjectSubscribeToType>,
    subscriptionFunction: (
      emittedValue: GetEmittingValueTypeFromSubjectType<SubjectSubscribeToType>
    ) => void
  ): void {
    const subscriptionToAdd =
      this.observableAndSubjectProvider.getSubscriptionToSubject(
        subjectToSubscribeToType,
        subjectToSubscribeToEnumValue,
        subscriptionFunction
      );
    this.addSubscription(subjectToSubscribeToEnumValue, subscriptionToAdd);
  }

  sendNextTo<SubjectToSendNextToType extends SubjectType>(
    subjectToSendNextToType: SubjectToSendNextToType,
    subjectToSendNextToEnumValue: GetSubjectEnumFromSubjectType<SubjectToSendNextToType>,
    subjectToSendNextToNextParametar: GetEmittingValueTypeFromSubjectType<SubjectToSendNextToType>
  ): void {
    this.observableAndSubjectProvider.sendNextTo(
      subjectToSendNextToType,
      subjectToSendNextToEnumValue,
      subjectToSendNextToNextParametar
    );
  }
}
