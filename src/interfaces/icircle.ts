import { Subject, Subscription } from "rxjs";
import { Animations } from "../enumerations/animationsenum";
import { CircleEmittingSubjects } from "../enumerations/subjects/circleemittingsubjectsenum";
import { CircleSubscriptionsKeyType } from "../libraries/typelibrary";

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
  subjects: Map<CircleEmittingSubjects, Subject<ICircle>>;
  subscriptions: Map<CircleSubscriptionsKeyType, Subscription>;
  timeToLive: number;
}
