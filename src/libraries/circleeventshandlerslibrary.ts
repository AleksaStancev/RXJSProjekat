import { from } from "rxjs";
import { filter, toArray } from "rxjs/operators";
import { Animations } from "../enumerations/animationsenum";
import { CircleSubjects } from "../enumerations/circlesubjectsenum";
import { MouseEvents } from "../enumerations/mouseeventsenum";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";
import { circleSubjects } from "../maps/circlesubjectsmap";
import { mouseEvents } from "../maps/mouseeventsmap";
import {
  CheckForAvailableSpaceAroundCircle,
  checkIfPointIsInCircle,
} from "./geometrylibrary";
import { GetRandomCoordinates } from "./randomgenerationlibrary";

export function ColissionResponseHandler(
  circleToAdd: ICircle,
  circles: ICircle[]
): void {
  circleToAdd.subscriptions.push(
    mouseEvents
      .get(MouseEvents.mouseMove)
      .subscribe((mouseCoordinates: ICoordinates) => {
        if (
          checkIfPointIsInCircle(
            mouseCoordinates,
            circleToAdd.coordinates,
            circleToAdd.radius
          )
        ) {
          circleToAdd.animation = Animations.fadeOut;
          circleSubjects.get(CircleSubjects.mouseEnteredCircle).next(circleToAdd);
        }
      })
  );
  circleToAdd.subscriptions.push(
    circleSubjects
      .get(CircleSubjects.colissionCheck)
      .subscribe((newCircle: ICircle) => {
        newCircle.colissionsLeftToCheck--;
        if (
          checkIfPointIsInCircle(newCircle.coordinates, circleToAdd.coordinates, 100)
        )
          newCircle.colissionDetected = true;
        circleSubjects.get(CircleSubjects.colissionCheckResponse).next(newCircle);
      })
  );
  circles.push(circleToAdd);
  circleSubjects.get(CircleSubjects.circleValid).next(circleToAdd);
}

export function MouseEnteredCircleHandler(
  enteredCircle: ICircle,
  circles: ICircle[]
): ICircle[] {
  from(circles)
    .pipe(
      filter((circle: ICircle) => circle !== enteredCircle),
      toArray()
    )
    .subscribe((newCircles: ICircle[]) => {
      from(enteredCircle.subscriptions).subscribe((subscription) =>
        subscription.unsubscribe()
      );
      circles = newCircles;
    });
  return circles;
}
