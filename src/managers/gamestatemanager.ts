import { from, Subscription } from "rxjs";
import { filter, toArray } from "rxjs/operators";
import { Animations } from "../enumerations/animationsenum";
import { CircleEmittingObservables } from "../enumerations/circleemittingobservablesenum";
import { CircleEmittingSubjects } from "../enumerations/circleemittingsubjectsenum";
import { ControlSubjects } from "../enumerations/controlsubjectsenum";
import { CoordinatesEmittingObservables } from "../enumerations/coordinatesemittingobservablesenum";
import { NumberEmittingObservables } from "../enumerations/numberemittingobservablesenum";
import { NumberEmittingSubjects } from "../enumerations/numberemittingsubjectsenum";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";
import { CheckIfPointIsInCircle } from "../libraries/geometrylibrary";
import { ObservableAndSubjectProvider } from "../providers/observableandsubjectprovider";
import { AbstractManager } from "./abstractmanager";

export class GameStateManager extends AbstractManager {
  private circles: ICircle[];
  private points: number;
  private lives: number;

  constructor(observableAndSubjectProvider: ObservableAndSubjectProvider) {
    super(observableAndSubjectProvider);
    this.circles = [];
    this.points = 0;
    this.lives = 3;

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
      (_) => {
        this.subscribeTo(
          CircleEmittingObservables,
          CircleEmittingObservables.circleGenerated,
          (newCircle: ICircle) => {
            if (this.circles.length > 0) {
              newCircle.colissionsLeftToCheck = this.circles.length;
              this.sendNextTo(
                CircleEmittingSubjects,
                CircleEmittingSubjects.colissionCheck,
                newCircle
              );
            } else this.colissionResponseHandler(newCircle);
          }
        );
      }
    );

    this.subscribeTo(
      ControlSubjects,
      ControlSubjects.stopCircleGeneration,
      (_) => this.unsubscribeFrom(CircleEmittingObservables.circleGenerated)
    );

    this.subscribeTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.colissionCheckResponse,
      (newCircle) => {
        if (
          newCircle.colissionsLeftToCheck === 0 &&
          !newCircle.colissionDetected
        ) {
          this.colissionResponseHandler(newCircle);
        }
      }
    );

    this.subscribeTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.mouseEnteredCircle,
      (enteredCircle: ICircle) => {
        this.removeCircleHandler(enteredCircle, Animations.fadeOut);
        this.points++;
        this.sendNextTo(
          NumberEmittingSubjects,
          NumberEmittingSubjects.scoreChanged,
          this.points
        );
      }
    );

    this.subscribeTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.timeToLiveExpired,
      (deadCircle: ICircle) => {
        this.removeCircleHandler(deadCircle, Animations.zoomOut);
        this.lives--;
        this.sendNextTo(
          NumberEmittingSubjects,
          NumberEmittingSubjects.numberOfLivesChanged,
          this.lives
        );
      }
    );
  }

  private addSubscriptionToCircle(
    circleToAddSubscriptionTo: ICircle,
    subscriptionEnumValue:
      | CoordinatesEmittingObservables
      | CircleEmittingSubjects
      | NumberEmittingObservables,
    subscription: Subscription
  ): void {
    circleToAddSubscriptionTo.subscriptions.set(
      subscriptionEnumValue,
      subscription
    );
  }
  private colissionResponseHandler(circleToAdd: ICircle): void {
    this.addSubscriptionToCircle(
      circleToAdd,
      CoordinatesEmittingObservables.mouseMove,
      this.getSubscriptionTo(
        CoordinatesEmittingObservables,
        CoordinatesEmittingObservables.mouseMove,
        (mouseCoordinates: ICoordinates) => {
          if (
            CheckIfPointIsInCircle(
              mouseCoordinates,
              circleToAdd.coordinates,
              circleToAdd.radius
            )
          )
            this.sendNextTo(
              CircleEmittingSubjects,
              CircleEmittingSubjects.mouseEnteredCircle,
              circleToAdd
            );
        }
      )
    );

    this.addSubscriptionToCircle(
      circleToAdd,
      CircleEmittingSubjects.colissionCheck,
      this.getSubscriptionTo(
        CircleEmittingSubjects,
        CircleEmittingSubjects.colissionCheck,
        (newCircle) => {
          newCircle.colissionsLeftToCheck--;
          if (
            CheckIfPointIsInCircle(
              newCircle.coordinates,
              circleToAdd.coordinates,
              120
            )
          )
            newCircle.colissionDetected = true;
          this.sendNextTo(
            CircleEmittingSubjects,
            CircleEmittingSubjects.colissionCheckResponse,
            newCircle
          );
        }
      )
    );
    this.addSubscriptionToCircle(
      circleToAdd,
      NumberEmittingObservables.timeToLiveTimer,
      this.getSubscriptionTo(
        NumberEmittingObservables,
        NumberEmittingObservables.timeToLiveTimer,
        (timeToLiveTimerTick: number) => {
          circleToAdd.timeToLive -= timeToLiveTimerTick;
          if (circleToAdd.timeToLive <= 0) {
            circleToAdd.animation = Animations.fadeOut;
            this.sendNextTo(
              CircleEmittingSubjects,
              CircleEmittingSubjects.timeToLiveExpired,
              circleToAdd
            );
          }
        }
      )
    );

    this.circles.push(circleToAdd);
    this.sendNextTo(
      CircleEmittingSubjects,
      CircleEmittingSubjects.renderCircle,
      circleToAdd
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
}
