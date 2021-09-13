import { from, Subscription } from "rxjs";
import { filter, toArray } from "rxjs/operators";
import { Animations } from "../enumerations/animationsenum";
import { CircleEmittingObservables } from "../enumerations/observables/circleemittingobservablesenum";
import { CoordinatesEmittingObservables } from "../enumerations/observables/coordinatesemittingobservablesenum";
import { NumberEmittingObservables } from "../enumerations/observables/numberemittingobservablesenum";
import { CircleEmittingSubjects } from "../enumerations/subjects/circleemittingsubjectsenum";
import { ControlSubjects } from "../enumerations/subjects/controlsubjectsenum";
import { NumberEmittingSubjects } from "../enumerations/subjects/numberemittingsubjectsenum";

import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";
import { CheckIfPointIsInCircle } from "../libraries/geometrylibrary";
import { CircleSubscriptionsKeyType } from "../libraries/typelibrary";
import { ObservableAndSubjectProvider } from "../providers/observableandsubjectprovider";
import { AbstractManager } from "./abstractmanager";

export class GameStateManager extends AbstractManager {
  private circles: ICircle[];
  private points: number;
  private lives: number;

  private currentWorkingCircle: ICircle;

  constructor(observableAndSubjectProvider: ObservableAndSubjectProvider) {
    super(observableAndSubjectProvider);
    this.circles = [];
    this.points = 0;
    this.lives = 3;
    this.currentWorkingCircle = null;

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

    this.subscribeTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.circleRemovedFromCanvas,
      (circle: ICircle) => this.removeCircleFromGameState(circle)
    );

    this.subscribeTo(
      ControlSubjects,
      ControlSubjects.startCircleGeneration,
      (_) => this.startCircleGenerationHandler()
    );

    this.subscribeTo(
      ControlSubjects,
      ControlSubjects.stopCircleGeneration,
      (_) => this.unsubscribeFrom(CircleEmittingObservables.circleGenerated)
    );

    this.subscribeTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.colissionCheckResponse,
      (newCircle: ICircle) => this.collisionCheckResponseHandler(newCircle)
    );

    this.subscribeTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.mouseEnteredCircle,
      (enteredCircle: ICircle) => this.mouseEnteredCircleHandler(enteredCircle)
    );

    this.subscribeTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.timeToLiveExpired,
      (deadCircle: ICircle) => this.timeToLiveExpiredHandler(deadCircle)
    );
  }

  private addSubscriptionToCurrentWorkingCircle(
    subscriptionEnumValue: CircleSubscriptionsKeyType,
    subscription: Subscription
  ): void {
    this.currentWorkingCircle.subscriptions.set(
      subscriptionEnumValue,
      subscription
    );
  }

  private addCircleToGameState(circleToAdd: ICircle): void {
    this.currentWorkingCircle = circleToAdd;

    this.addSubscriptionToCurrentWorkingCircle(
      CoordinatesEmittingObservables.mouseMove,
      this.getSubscriptionTo(
        CoordinatesEmittingObservables,
        CoordinatesEmittingObservables.mouseMove,
        (mouseCoordinates: ICoordinates) =>
          this.mouseMoveHandlerForCircle(circleToAdd, mouseCoordinates)
      )
    );

    this.addSubscriptionToCurrentWorkingCircle(
      CircleEmittingSubjects.colissionCheck,
      this.getSubscriptionTo(
        CircleEmittingSubjects,
        CircleEmittingSubjects.colissionCheck,
        (newCircle: ICircle) =>
          this.colissionCheckHandlerForCircle(circleToAdd, newCircle)
      )
    );

    this.addSubscriptionToCurrentWorkingCircle(
      NumberEmittingObservables.timeToLiveTimer,
      this.getSubscriptionTo(
        NumberEmittingObservables,
        NumberEmittingObservables.timeToLiveTimer,
        (timeToLiveTimerTick: number) =>
          this.timeToLiveTimerHanderForCircle(circleToAdd, timeToLiveTimerTick)
      )
    );
    this.circles.push(circleToAdd);
    this.sendNextTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.renderCircle,
      circleToAdd
    );
  }

  private removeCircleFromGameState(circleToRemove: ICircle): void {
    from(this.circles)
      .pipe(
        filter((circle: ICircle) => circle !== circleToRemove),
        toArray()
      )
      .subscribe((newCircles: ICircle[]) => {
        circleToRemove.subscriptions
          .get(CircleEmittingSubjects.colissionCheck)
          .unsubscribe();
        this.circles = newCircles;
      });
  }

  private timeToLiveTimerHanderForCircle(
    circle: ICircle,
    timeToLiveTimerTick: number
  ): void {
    circle.timeToLive -= timeToLiveTimerTick;
    if (circle.timeToLive <= 0) {
      circle.animation = Animations.fadeOut;
      this.sendNextTo(
        CircleEmittingSubjects,
        CircleEmittingSubjects.timeToLiveExpired,
        circle
      );
    }
  }

  private mouseMoveHandlerForCircle(
    circle: ICircle,
    mouseCoordinates: ICoordinates
  ) {
    if (
      CheckIfPointIsInCircle(
        mouseCoordinates,
        circle.coordinates,
        circle.radius
      )
    )
      this.sendNextTo(
        CircleEmittingSubjects,
        CircleEmittingSubjects.mouseEnteredCircle,
        circle
      );
  }

  private colissionCheckHandlerForCircle(
    circle: ICircle,
    newCircle: ICircle
  ): void {
    newCircle.colissionsLeftToCheck--;
    if (CheckIfPointIsInCircle(newCircle.coordinates, circle.coordinates, 120))
      newCircle.colissionDetected = true;
    this.sendNextTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.colissionCheckResponse,
      newCircle
    );
  }

  private timeToLiveExpiredHandler(deadCircle: ICircle): void {
    this.removeCircleHandler(deadCircle, Animations.zoomOut);
    this.lives--;
    if (this.lives === 0) {
      from(this.circles).subscribe((circle) =>
        this.removeCircleHandler(circle, Animations.fadeOut)
      );
      this.sendNextTo(
        ControlSubjects,
        ControlSubjects.stopCircleGeneration,
        null
      );
    }
    this.sendNextTo(
      NumberEmittingSubjects,
      NumberEmittingSubjects.numberOfLivesChanged,
      this.lives
    );
  }

  private collisionCheckResponseHandler(newCircle: ICircle): void {
    if (newCircle.colissionsLeftToCheck === 0 && !newCircle.colissionDetected) {
      this.addCircleToGameState(newCircle);
    }
  }

  private mouseEnteredCircleHandler(enteredCircle: ICircle): void {
    this.removeCircleHandler(enteredCircle, Animations.fadeOut);
    this.points++;
    this.sendNextTo(
      NumberEmittingSubjects,
      NumberEmittingSubjects.scoreChanged,
      this.points
    );
  }

  private removeCircleHandler(
    circleToRemove: ICircle,
    destructionAnimation: Animations
  ): void {
    from(circleToRemove.subscriptions.keys())
      .pipe(filter((key) => key !== CircleEmittingSubjects.colissionCheck))
      .subscribe((subscription) =>
        circleToRemove.subscriptions.get(subscription).unsubscribe()
      );
    circleToRemove.animation = destructionAnimation;
    this.sendNextTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.renderCircle,
      circleToRemove
    );
  }

  private startCircleGenerationHandler(): void {
    this.subscribeTo(
      CircleEmittingObservables,
      CircleEmittingObservables.circleGenerated,
      (newCircle: ICircle) => this.circleGeneratedHandler(newCircle)
    );
  }

  private circleGeneratedHandler(newCircle: ICircle): void {
    if (this.circles.length > 0) {
      newCircle.colissionsLeftToCheck = this.circles.length;
      this.sendNextTo(
        CircleEmittingSubjects,
        CircleEmittingSubjects.colissionCheck,
        newCircle
      );
    } else this.addCircleToGameState(newCircle);
  }
}
