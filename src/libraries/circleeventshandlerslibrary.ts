import { from } from "rxjs";
import { filter, toArray } from "rxjs/operators";
import { Animations } from "../enumerations/animationsenum";
import { CircleSubjects } from "../enumerations/circleemittingsubjectsenum";
import { MouseEvents } from "../enumerations/icoordinatesemittingobservablesenum";
import { NumberEmittingObservables } from "../enumerations/numberemittingobservablesenum";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";
import { circleEmittingSubjects } from "../observableMaps/circleemittingsubjectsmap";
import { iCoordinatesEmittingObservables } from "../observableMaps/icoordinatesemittingobservablesmap";
import { numberEmittingObservables } from "../observableMaps/numberemittingobservablesmap";
import { CheckIfPointIsInCircle } from "./geometrylibrary";
import { GetRandomCoordinates } from "./randomgenerationlibrary";

export function ColissionResponseHandler(
  circleToAdd: ICircle,
  circles: ICircle[]
): void {
  circleToAdd.subscriptions.push(
    iCoordinatesEmittingObservables
      .get(MouseEvents.mouseMove)
      .subscribe((mouseCoordinates: ICoordinates) => {
        if (
          CheckIfPointIsInCircle(
            mouseCoordinates,
            circleToAdd.coordinates,
            circleToAdd.radius
          )
        ) {
          circleEmittingSubjects
            .get(CircleSubjects.mouseEnteredCircle)
            .next(circleToAdd);
        }
      })
  );
  circleToAdd.subscriptions.push(
    circleEmittingSubjects
      .get(CircleSubjects.colissionCheck)
      .subscribe((newCircle: ICircle) => {
        newCircle.colissionsLeftToCheck--;
        if (
          CheckIfPointIsInCircle(
            newCircle.coordinates,
            circleToAdd.coordinates,
            100
          )
        )
          newCircle.colissionDetected = true;
        circleEmittingSubjects
          .get(CircleSubjects.colissionCheckResponse)
          .next(newCircle);
      })
  );
  circleToAdd.subscriptions.push(
    numberEmittingObservables
      .get(NumberEmittingObservables.timeToLiveTimer)
      .subscribe((time) => {
        circleToAdd.timeToLive -= time;
        if (circleToAdd.timeToLive <= 0) {
          circleToAdd.animation = Animations.fadeOut;
          circleEmittingSubjects
            .get(CircleSubjects.timeToLiveExpired)
            .next(circleToAdd);
        }
      })
  );
  circles.push(circleToAdd);
  circleEmittingSubjects.get(CircleSubjects.renderCircle).next(circleToAdd);
}

export function RemoveCircleHandler(
  enteredCircle: ICircle,
  circles: ICircle[],
  destructionAnimation: Animations
): ICircle[] {
  enteredCircle.animation = destructionAnimation;
  circleEmittingSubjects.get(CircleSubjects.renderCircle).next(enteredCircle);
  return RemoveCircleFromGameState(enteredCircle, circles);
}

function RemoveCircleFromGameState(
  circleToRemove: ICircle,
  circles: ICircle[]
): ICircle[] {
  from(circles)
    .pipe(
      filter((circle: ICircle) => circle !== circleToRemove),
      toArray()
    )
    .subscribe((newCircles: ICircle[]) => {
      from(circleToRemove.subscriptions).subscribe((subscription) =>
        subscription.unsubscribe()
      );
      circles = newCircles;
    });
  return circles;
}
