import { Subject } from "rxjs";
import { NumberEmittingSubjects } from "../enumerations/numberemittingsubjectsenum";

export const numberEmittingSubjects: Map<
  NumberEmittingSubjects,
  Subject<number>
> = new Map<NumberEmittingSubjects, Subject<number>>();

numberEmittingSubjects.set(
  NumberEmittingSubjects.scoreChanged,
  new Subject<number>()
);

numberEmittingSubjects.set(
  NumberEmittingSubjects.numberOfLivesChanged,
  new Subject<number>()
);
