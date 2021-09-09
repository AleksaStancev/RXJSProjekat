import { fromEvent, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MouseEvents } from "../enumerations/icoordinatesemittingobservablesenum";
import { ICoordinates } from "../interfaces/icoordinates";

export const iCoordinatesEmittingObservables: Map<
  MouseEvents,
  Observable<ICoordinates>
> = new Map<MouseEvents, Observable<ICoordinates>>();

iCoordinatesEmittingObservables.set(
  MouseEvents.mouseMove,
  fromEvent<MouseEvent>(document, "mousemove").pipe(
    map((mouseEvent) => ({ x: mouseEvent.x, y: mouseEvent.y }))
  )
);
