import { Observable, Subscription } from "rxjs";
import { filter, first } from "rxjs/operators";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";

export function checkIfPointIsInCircle(
  coordinates: ICoordinates,
  circleCoordinates: ICoordinates,
  circleRadius: number
): boolean {
  return (
    coordinates.x > circleCoordinates.x - circleRadius &&
    coordinates.x < circleCoordinates.x + circleRadius &&
    coordinates.y > circleCoordinates.y - circleRadius &&
    coordinates.y < circleCoordinates.y + circleRadius
  );
}

export function checkForCollision(
  circles$: Observable<ICircle>,
  newCircle: ICircle
): boolean {
  let collisionFound: boolean = false;

  const circles$Subscription: Subscription = circles$
    .pipe(
      first(
        (circle) =>
          checkIfPointIsInCircle(
            newCircle.coordinates,
            circle.coordinates,
            circle.radius
          ),
        null
      ),
      filter((circle) => circle !== null)
    )
    .subscribe((_) => {
      collisionFound = true;
      circles$Subscription.unsubscribe();
    });
  return collisionFound;
}
