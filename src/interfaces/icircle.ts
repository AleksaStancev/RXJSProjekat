import { Subject, Subscription } from "rxjs";
import { Animations } from "../enumerations/animationsenum";
import { CircleSubjects } from "../enumerations/circlesubjectsenum";
import { ICoordinates } from "./icoordinates";

export interface ICircle {
  coordinates: ICoordinates;
  radius: number;
  gradient: string;
  alpha: number;
  path: Path2D;
  animation: Animations;
  colissionsLeftToCheck: number;
  colissionDetected: boolean;
  subjects: Map<CircleSubjects, Subject<ICircle>>;
  subscriptions: Subscription[];
}
