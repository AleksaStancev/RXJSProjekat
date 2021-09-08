import { from } from "rxjs";
import { filter, toArray } from "rxjs/operators";
import { Animations } from "../enumerations/animationsenum";
import { CircleSubjects } from "../enumerations/circlesubjectsenum";
import { MouseEvents } from "../enumerations/mouseeventsenum";
import { ICircle } from "../interfaces/icircle";
import { circleSubjects } from "../maps/circlesubjectsmap";
import { mouseEvents } from "../maps/mouseeventsmap";
import { checkIfPointIsInCircle } from "./geometrylibrary";

export function CircleGeneratedHandler(
  circle: ICircle,
  circles: ICircle[]
): void {
  circle.subjects = circleSubjects;
  circle.subscriptions.push(
    mouseEvents.get(MouseEvents.mouseMove).subscribe((mouseCoordinates) => {
      if (
        checkIfPointIsInCircle(
          mouseCoordinates,
          circle.coordinates,
          circle.radius
        )
      ) {
        circle.animation = Animations.fadeOut;
        circle.subjects.get(CircleSubjects.mouseEnteredCircle).next(circle);
      }
    })
  );
  circles.push(circle);
}

export function MouseEnteredCircleHandler(
  enteredCircle: ICircle,
  circles: ICircle[]
): void {
  from(circles)
    .pipe(
      filter((circle) => circle !== enteredCircle),
      toArray()
    )
    .subscribe((newCircles) => {
      from(enteredCircle.subscriptions).subscribe((subscription) =>
        subscription.unsubscribe()
      );
      circles = newCircles;
    });
}
