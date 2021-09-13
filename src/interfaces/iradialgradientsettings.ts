import { ICoordinates } from "./icoordinates";
import { IRadialGradientOffsetAndColor } from "./iradialgradientoffsetandcolor";

export interface IRadialGradientSettings {
  innerCircleCoordinates: ICoordinates;
  innerCircleRadius: number;
  outterCircleCoordinates: ICoordinates;
  outterCircleRadius: number;
  offsetsAndColors: IRadialGradientOffsetAndColor[];
}
