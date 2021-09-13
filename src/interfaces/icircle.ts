import { Subject, Subscription } from "rxjs";
import { Animations } from "../enumerations/animationsenum";
import { CircleEmittingSubjects } from "../enumerations/circleemittingsubjectsenum";
import { CoordinatesEmittingObservables } from "../enumerations/coordinatesemittingobservablesenum";
import { NumberEmittingObservables } from "../enumerations/numberemittingobservablesenum";
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
  subscriptions: Map<
    | CircleEmittingSubjects
    | CoordinatesEmittingObservables
    | NumberEmittingObservables,
    Subscription
  >;
  timeToLive: number;
}
