import { Subject } from "rxjs";
import { Animations } from "../enumerations/animationsenum";
import { CircleSubjects } from "../enumerations/circlesubjectsenum";
import { ICircle } from "../interfaces/icircle";

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomCircle(): ICircle {
  return {
    coordinates: {
      x: getRandomInt(200, 1000),
      y: getRandomInt(100, 900),
    },
    radius: 0,
    gradient: getRandomColor(),
    alpha: 1,
    path: new Path2D(),
    animation: Animations.zoomIn,
    subscriptions: [],
    subjects: new Map<CircleSubjects, Subject<ICircle>>(),
  };
}

export function getRandomColor(): string {
  switch (getRandomInt(0, 1)) {
    case 0:
      return "185, 122, 149";
    case 1:
      return "246, 174, 153";
    default:
      return "255,255,255";
  }
}
