import { interval, Observable, Subject } from "rxjs";
import { delay, map, share, take } from "rxjs/operators";
import { CircleEvents } from "../enumerations/circleeventsenum";
import { ICircle } from "../interfaces/icircle";
import {
  GetRandomCircle,
  GetRandomInt,
} from "../libraries/randomgenerationlibrary";

export const circleEvents: Map<CircleEvents, Observable<ICircle>> = new Map<
  CircleEvents,
  Observable<ICircle>
>();

circleEvents.set(
  CircleEvents.circleGenerated,
  interval(100).pipe(
    delay(GetRandomInt(0, 500)),
    map(() => GetRandomCircle())
  )
);
