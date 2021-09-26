import { from, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { SubscriptionKeyEnums } from "../libraries/typeLibrary";

export abstract class SubscriptionManager<
  SubscriptionKeyType extends SubscriptionKeyEnums
> {
  private subscriptions: Map<SubscriptionKeyType, Subscription>;

  constructor() {
    this.subscriptions = new Map<SubscriptionKeyType, Subscription>();
  }

  protected addSubscription(
    subjectOrObservableEnum: SubscriptionKeyType,
    subscription: Subscription
  ): void {
    if (subscription !== null)
      this.subscriptions.set(subjectOrObservableEnum, subscription);
  }
  protected removeSubscription(
    subjectOrObservableEnum: SubscriptionKeyType
  ): void {
    if (this.subscriptions.has(subjectOrObservableEnum))
      this.subscriptions.get(subjectOrObservableEnum).unsubscribe();
  }
  protected removeAllSubscriptionsExcept(
    subscriptionsToSkip: SubscriptionKeyType[]
  ): void {
    let subscriptions$ = from(this.subscriptions.keys());
    if (subscriptionsToSkip.length > 0)
      subscriptions$ = subscriptions$.pipe(
        filter(
          (subscription: SubscriptionKeyType) =>
            !subscriptionsToSkip.includes(subscription)
        )
      );
    subscriptions$.subscribe((subscription: SubscriptionKeyType) =>
      this.removeSubscription(subscription)
    );
  }
}
