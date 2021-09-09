import { interval, Observable, Subject } from "rxjs";
import { delay, map, share, take } from "rxjs/operators";
import { CircleEmittingObservables } from "../enumerations/circleemittingobservablesenum";
import { ICircle } from "../interfaces/icircle";
import {
  GetRandomCircle,
  GetRandomInt,
} from "../libraries/randomgenerationlibrary";

export const circleEmittingObservables: Map<
  CircleEmittingObservables,
  Observable<ICircle>
> = new Map<CircleEmittingObservables, Observable<ICircle>>();

circleEmittingObservables.set(
  CircleEmittingObservables.circleGenerated,
  interval(500).pipe(
    delay(GetRandomInt(0, 500)),
    map(() => GetRandomCircle())
  )
);
