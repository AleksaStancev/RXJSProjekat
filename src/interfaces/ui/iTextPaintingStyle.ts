import Color from "color";
import { IPaintingStyle } from "./iPaintingStyle";
import { IPaintingStyleWithoutFillColors } from "./iPaintingStyleWithoutFillColors";

export interface ITextPaintingStyle extends IPaintingStyleWithoutFillColors {
  fontName: string;
  fontSize: number;
  textAlign: CanvasTextAlign;
  fillStyle: Color;
}
