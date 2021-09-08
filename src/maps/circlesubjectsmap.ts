import { Subject } from "rxjs";
import { CircleSubjects } from "../enumerations/circlesubjectsenum";
import { ICircle } from "../interfaces/icircle";

export const circleSubjects: Map<CircleSubjects, Subject<ICircle>> = new Map<
  CircleSubjects,
  Subject<ICircle>
>();

for (const value in CircleSubjects) {
  const numberValue = Number(value);
  if (!isNaN(numberValue))
    circleSubjects.set(numberValue, new Subject<ICircle>());
}
