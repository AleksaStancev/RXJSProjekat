import { Animations } from "../enumerations/animationsenum";

export interface ICircle {
  x: number;
  y: number;
  radius: number;
  gradient: string;
  alpha: number;
  path: Path2D;
  animation: Animations;
}
