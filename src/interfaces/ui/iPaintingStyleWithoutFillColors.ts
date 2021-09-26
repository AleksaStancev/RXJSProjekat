import Color from "color";
import { IShadowOffset } from "./iShadowOffset";

export interface IPaintingStyleWithoutFillColors {
  shadowColor: Color;
  strokeStyle: Color;
  shadowBlur: number;
  shadowOffset: IShadowOffset;
}
