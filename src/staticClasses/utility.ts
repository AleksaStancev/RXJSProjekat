import Color from "color";
import { IPathAndPaintingStyle } from "../interfaces/ui/iPathAndPaintingStyle";
import { ITextAndTextPaintingStyle } from "../interfaces/ui/iTextAndTextPaintingStyle";
import { RenderValueTypes } from "../libraries/typeLibrary";

export class Utility {
  static getFromMapWithKeyValidation<KeyType, ValueType>(
    map: Map<KeyType, ValueType>,
    keyValue: KeyType
  ): ValueType {
    return map.has(keyValue) ? map.get(keyValue) : null;
  }

  static setColorAlphaAndGetRGBString(color: Color, alpha: number): string {
    return color.alpha(alpha).rgb().toString();
  }

  static getRadialGradientStringForCSS(
    xPercent: number,
    yPercent: number,
    innerColor: string,
    outterColor: string,
    innerPercent: number,
    outterPercent: number
  ): string {
    return `radial-gradient(circle at ${xPercent}% ${yPercent}%,${innerColor} ${innerPercent}%, ${outterColor} ${outterPercent}%)`;
  }

  static getFontString(fontName: string, fontSize: number): string {
    return `${fontSize}px ${fontName}`;
  }

  static isPathAndPaintingStyle(
    object: RenderValueTypes
  ): object is IPathAndPaintingStyle {
    return (object as IPathAndPaintingStyle).path !== undefined;
  }

  static isTextAndPaintingStyle(
    object: RenderValueTypes
  ): object is ITextAndTextPaintingStyle {
    return (object as ITextAndTextPaintingStyle).text !== undefined;
  }
}
