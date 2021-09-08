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
import { CircleEvents } from "../enumerations/circleeventsenum";
import { CircleSubjects } from "../enumerations/circlesubjectsenum";
import { MouseEvents } from "../enumerations/mouseeventsenum";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";
import {
  ColissionResponseHandler as ColissionCheckResponseHandler,
  MouseEnteredCircleHandler,
} from "../libraries/circleeventshandlerslibrary";
import { checkIfPointIsInCircle } from "../libraries/geometrylibrary";
import {
  GetRandomCoordinates,
  GetRandomInt,
} from "../libraries/randomgenerationlibrary";
import { circleEvents } from "../maps/circleeventsmap";
import { circleSubjects } from "../maps/circlesubjectsmap";

export class GameStateManager {
  private circles: ICircle[];
  private points: number;

  private circleGenerator$Subscription: Subscription;
  private mouseEnterEvent$Subscription: Subscription;
  private colissionCheckResponseSubscription: Subscription;

  constructor() {
    this.circles = [];
    this.points = 0;

    this.circleGenerator$Subscription = circleEvents
      .get(CircleEvents.circleGenerated)
      .subscribe((newCircle: ICircle) => {
        if (this.circles.length > 0) {
          newCircle.colissionsLeftToCheck = this.circles.length;
          circleSubjects.get(CircleSubjects.colissionCheck).next(newCircle);
        } else ColissionCheckResponseHandler(newCircle, this.circles);
      });

    this.colissionCheckResponseSubscription = circleSubjects
      .get(CircleSubjects.colissionCheckResponse)
      .subscribe((newCircle: ICircle) => {
        if (
          newCircle.colissionsLeftToCheck === 0 &&
          !newCircle.colissionDetected
        ) {
          ColissionCheckResponseHandler(newCircle, this.circles);
        }
      });

    this.mouseEnterEvent$Subscription = circleSubjects
      .get(CircleSubjects.mouseEnteredCircle)
      .subscribe((enteredCircle: ICircle) => {
        this.circles = MouseEnteredCircleHandler(enteredCircle, this.circles);
        this.points++;
      });
  }
}
