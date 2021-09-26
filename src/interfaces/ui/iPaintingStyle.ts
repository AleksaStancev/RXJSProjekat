import * as Color from "color";
import { IPaintingStyleWithoutFillColors } from "./iPaintingStyleWithoutFillColors";

export interface IPaintingStyle extends IPaintingStyleWithoutFillColors {
  fillColors: Color[];
}
