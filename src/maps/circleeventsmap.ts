import { interval, Observable } from "rxjs";
import { delay, map, share } from "rxjs/operators";
import { CircleEvents } from "../enumerations/circleeventsenum";
import { ICircle } from "../interfaces/icircle";
import {
  getRandomCircle,
  getRandomInt,
} from "../libraries/randomgenerationlibrary";

export const circleEvents: Map<CircleEvents, Observable<ICircle>> = new Map<
  CircleEvents,
  Observable<ICircle>
>();

circleEvents.set(
  CircleEvents.circleGenerated,
  interval(500).pipe(
    delay(getRandomInt(0, 500)),
    map(() => getRandomCircle()),
    share()
  )
);
