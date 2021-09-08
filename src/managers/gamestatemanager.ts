import { from, Observable, of, Subject, Subscription } from "rxjs";
import { expand, filter, first, share, tap, toArray } from "rxjs/operators";
import { Animations } from "../enumerations/animationsenum";
import { CircleEvents } from "../enumerations/circleeventsenum";
import { CircleSubjects } from "../enumerations/circlesubjectsenum";
import { MouseEvents } from "../enumerations/mouseeventsenum";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";
import {
  CircleGeneratedHandler,
  MouseEnteredCircleHandler,
} from "../libraries/circleeventshandlerslibrary";
import { checkIfPointIsInCircle } from "../libraries/geometrylibrary";
import { circleEvents } from "../maps/circleeventsmap";
import { circleSubjects } from "../maps/circlesubjectsmap";

export class GameStateManager {
  private circles: ICircle[];
  private points: number;

  private circleGenerator$Subscription: Subscription;
  private mouseEnterEvent$Subscription: Subscription;

  constructor() {
    this.circles = [];
    this.points = 0;

    this.circleGenerator$Subscription = circleEvents
      .get(CircleEvents.circleGenerated)
      .subscribe((newCircle) =>
        CircleGeneratedHandler(newCircle, this.circles)
      );

    this.mouseEnterEvent$Subscription = circleSubjects
      .get(CircleSubjects.mouseEnteredCircle)
      .subscribe((enteredCircle) =>
        MouseEnteredCircleHandler(enteredCircle, this.circles)
      );
  }
}
