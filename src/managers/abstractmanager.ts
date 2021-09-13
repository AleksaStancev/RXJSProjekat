import { from, Subscription } from "rxjs";
import {
  GetSubjectOrObservableEnum,
  SubjectOrObservableEnum,
  SubjectOrObservableType,
  GetEmittingValueType,
  SubjectType,
  GetNextParametarType,
  GetSubjectEnum,
} from "../libraries/typelibrary";
import { ObservableAndSubjectProvider } from "../providers/observableandsubjectprovider";

export abstract class AbstractManager {
  private subscriptions: Map<SubjectOrObservableEnum, Subscription>;

  private observableAndSubjectProvider: ObservableAndSubjectProvider;

  constructor(observableAndSubjectProvider: ObservableAndSubjectProvider) {
    this.subscriptions = new Map<SubjectOrObservableEnum, Subscription>();
    this.observableAndSubjectProvider = observableAndSubjectProvider;
  }

  protected subscribeTo<
    SubjectOrObservableToSubscribeToType extends SubjectOrObservableType,
    SubjectOrObservableToSubscribeToEnum extends GetSubjectOrObservableEnum<SubjectOrObservableToSubscribeToType>,
    SubjectOrObservableToSubscribeToEmittingValueType extends GetEmittingValueType<SubjectOrObservableToSubscribeToType>
  >(
    subjectOrObservableToSubscribeToType: SubjectOrObservableToSubscribeToType,
    subjectOrObservableToSubscribeToEnumValue: SubjectOrObservableToSubscribeToEnum,
    subscriptionFunction: (
      emittedValue: SubjectOrObservableToSubscribeToEmittingValueType
    ) => void
  ): void {
    this.subscriptions.set(
      subjectOrObservableToSubscribeToEnumValue,
      this.getSubscriptionTo(
        subjectOrObservableToSubscribeToType,
        subjectOrObservableToSubscribeToEnumValue,
        subscriptionFunction
      )
    );
  }

  protected getSubscriptionTo<
    SubjectOrObservableToSubscribeToType extends SubjectOrObservableType,
    SubjectOrObservableToSubscribeToEnum extends GetSubjectOrObservableEnum<SubjectOrObservableToSubscribeToType>,
    SubjectOrObservableToSubscribeToEmittingValueType extends GetEmittingValueType<SubjectOrObservableToSubscribeToType>
  >(
    subjectOrObservableToSubscribeToType: SubjectOrObservableToSubscribeToType,
    subjectOrObservableToSubscribeToEnumValue: SubjectOrObservableToSubscribeToEnum,
    subscriptionFunction: (
      emittedValue: SubjectOrObservableToSubscribeToEmittingValueType
    ) => void
  ): Subscription {
    return this.observableAndSubjectProvider.getSubscriptionTo(
      subjectOrObservableToSubscribeToType,
      subjectOrObservableToSubscribeToEnumValue,
      subscriptionFunction
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
    this.observableAndSubjectProvider.sendNextTo(
      subjectToSendNextToType,
      subjectToSendNextToEnumValue,
      subjectToSendNextToNextParametar
    );
  }

  protected unsubscribeFrom(
    subjectObservableOrEnum: SubjectOrObservableEnum
  ): void {
    if (this.subscriptions.has(subjectObservableOrEnum))
      this.subscriptions.get(subjectObservableOrEnum).unsubscribe();
  }

  protected unsubscribeFromAll(): void {
    from(this.subscriptions.values()).subscribe((subscription: Subscription) =>
      subscription.unsubscribe()
    );
  }
}
