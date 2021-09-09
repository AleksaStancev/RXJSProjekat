import { from, Observable, of, Subscription } from "rxjs";
import { filter, first } from "rxjs/operators";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";

export function CheckIfPointIsInCircle(
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
