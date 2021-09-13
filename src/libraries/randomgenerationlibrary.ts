import { Subject, Subscription } from "rxjs";
import { Animations } from "../enumerations/animationsenum";
import { CircleEmittingSubjects } from "../enumerations/circleemittingsubjectsenum";
import { CoordinatesEmittingObservables } from "../enumerations/coordinatesemittingobservablesenum";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";

export function GetRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function GetRandomCircle(): ICircle {
  return {
    coordinates: GetRandomCoordinates(),
    radius: 0,
    gradient: GetRandomColor(),
    alpha: 1,
    path: new Path2D(),
    animation: Animations.zoomIn,
    subscriptions: new Map<
      CircleEmittingSubjects | CoordinatesEmittingObservables,
      Subscription
    >(),
    subjects: new Map<CircleEmittingSubjects, Subject<ICircle>>(),
    colissionsLeftToCheck: 0,
    colissionDetected: false,
    timeToLive: 3,
  };
}

export function GetRandomColor(): string {
  switch (GetRandomInt(0, 1)) {
    case 0:
      return "185, 122, 149";
    case 1:
      return "246, 174, 153";
    default:
      return "255,255,255";
  }
}

export function GetRandomCoordinates(): ICoordinates {
  return {
    x: GetRandomInt(100, 1820),
    y: GetRandomInt(100, 980),
  };
}
