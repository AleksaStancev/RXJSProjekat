import { interval, Observable } from "rxjs";
import { map, mapTo } from "rxjs/operators";
import { NumberEmittingObservables } from "../enumerations/numberemittingobservablesenum";

export const numberEmittingObservables: Map<
  NumberEmittingObservables,
  Observable<number>
> = new Map<NumberEmittingObservables, Observable<number>>();

numberEmittingObservables.set(
  NumberEmittingObservables.timeToLiveTimer,
  interval(1000).pipe(mapTo(1))
);
