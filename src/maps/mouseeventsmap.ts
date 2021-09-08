import { fromEvent, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MouseEvents } from "../enumerations/mouseeventsenum";
import { ICoordinates } from "../interfaces/icoordinates";

export const mouseEvents: Map<MouseEvents, Observable<ICoordinates>> = new Map<
  MouseEvents,
  Observable<ICoordinates>
>();

mouseEvents.set(
  MouseEvents.mouseMove,
  fromEvent<MouseEvent>(document, "mousemove").pipe(
    map((mouseEvent) => ({ x: mouseEvent.x, y: mouseEvent.y }))
  )
);
