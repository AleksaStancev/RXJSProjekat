import { Subject } from "rxjs";
import { CircleSubjects } from "../enumerations/circleemittingsubjectsenum";
import { ICircle } from "../interfaces/icircle";

export const circleEmittingSubjects: Map<CircleSubjects, Subject<ICircle>> = new Map<
  CircleSubjects,
  Subject<ICircle>
>();

circleEmittingSubjects.set(CircleSubjects.colissionCheck, new Subject<ICircle>());

for (const value in CircleSubjects) {
  const numberValue = Number(value);
  if (!isNaN(numberValue) && numberValue > 0)
    circleEmittingSubjects.set(numberValue, new Subject<ICircle>());
}
