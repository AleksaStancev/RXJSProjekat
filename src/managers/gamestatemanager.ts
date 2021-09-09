import {
  concat,
  from,
  interval,
  Observable,
  of,
  Subject,
  Subscription,
} from "rxjs";
import {
  buffer,
  bufferCount,
  concatMap,
  distinct,
  distinctUntilChanged,
  expand,
  filter,
  first,
  mergeMap,
  share,
  skip,
  take,
  tap,
  toArray,
} from "rxjs/operators";
import { Animations } from "../enumerations/animationsenum";
import { CircleEmittingObservables } from "../enumerations/circleemittingobservablesenum";
import { CircleSubjects } from "../enumerations/circleemittingsubjectsenum";
import { MouseEvents } from "../enumerations/icoordinatesemittingobservablesenum";
import { NumberEmittingSubjects } from "../enumerations/numberemittingsubjectsenum";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";
import {
  ColissionResponseHandler as ColissionCheckResponseHandler,
  RemoveCircleHandler,
} from "../libraries/circleeventshandlerslibrary";
import { CheckIfPointIsInCircle } from "../libraries/geometrylibrary";
import {
  GetRandomCoordinates,
  GetRandomInt,
} from "../libraries/randomgenerationlibrary";
import { circleEmittingObservables } from "../observableMaps/circleemittingobservablesmap";
import { circleEmittingSubjects } from "../observableMaps/circleemittingsubjectsmap";
import { numberEmittingSubjects } from "../observableMaps/numberemittingsubjectsmap";

export class GameStateManager {
  private circles: ICircle[];
  private points: number;
  private lives: number;

  private circleGenerator$Subscription: Subscription;
  private mouseEnterEvent$Subscription: Subscription;
  private colissionCheckResponseSubscription: Subscription;
  private timeToLiveExpired: Subscription;

  constructor() {
    this.circles = [];
    this.points = 0;
    this.lives = 3;

    numberEmittingSubjects
      .get(NumberEmittingSubjects.scoreChanged)
      .next(this.points);
    numberEmittingSubjects
      .get(NumberEmittingSubjects.numberOfLivesChanged)
      .next(this.lives);

    this.circleGenerator$Subscription = circleEmittingObservables
      .get(CircleEmittingObservables.circleGenerated)
      .subscribe((newCircle: ICircle) => {
        if (this.circles.length > 0) {
          newCircle.colissionsLeftToCheck = this.circles.length;
          circleEmittingSubjects
            .get(CircleSubjects.colissionCheck)
            .next(newCircle);
        } else ColissionCheckResponseHandler(newCircle, this.circles);
      });

    this.colissionCheckResponseSubscription = circleEmittingSubjects
      .get(CircleSubjects.colissionCheckResponse)
      .subscribe((newCircle: ICircle) => {
        if (
          newCircle.colissionsLeftToCheck === 0 &&
          !newCircle.colissionDetected
        ) {
          ColissionCheckResponseHandler(newCircle, this.circles);
        }
      });

    this.mouseEnterEvent$Subscription = circleEmittingSubjects
      .get(CircleSubjects.mouseEnteredCircle)
      .subscribe((enteredCircle: ICircle) => {
        this.circles = RemoveCircleHandler(
          enteredCircle,
          this.circles,
          Animations.fadeOut
        );
        this.points++;
        numberEmittingSubjects
          .get(NumberEmittingSubjects.scoreChanged)
          .next(this.points);
      });

    this.timeToLiveExpired = circleEmittingSubjects
      .get(CircleSubjects.timeToLiveExpired)
      .subscribe((deadCircle) => {
        this.circles = RemoveCircleHandler(
          deadCircle,
          this.circles,
          Animations.zoomOut
        );
        this.lives--;
        numberEmittingSubjects
          .get(NumberEmittingSubjects.numberOfLivesChanged)
          .next(this.lives);
      });
  }
}
