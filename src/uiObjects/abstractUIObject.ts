import { concat, from, Observable, Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Animations } from "../enumerations/ui/animations";
import { FillStyle } from "../enumerations/ui/fillStyle";
import { IOutterSquare } from "../interfaces/ui/iOutterSquare";
import { IPaintingStyle } from "../interfaces/ui/iPaintingStyle";
import { IPathAndPaintingStyle } from "../interfaces/ui/iPathAndPaintingStyle";
import { IText } from "../interfaces/ui/iText";
import { ITextAndTextPaintingStyle } from "../interfaces/ui/iTextAndTextPaintingStyle";
import { ITextPaintingStyle } from "../interfaces/ui/iTextPaintingStyle";
import {
  RenderValueTypes,
  SubscriptionKeyEnums
} from "../libraries/typeLibrary";
import { SubscriptionManager } from "../managers/abstractSubscriptionManager";
import { ObjectFromInterfaceCreator } from "../staticClasses/objectFromInterfaceCreator";
import { Utility } from "../staticClasses/utility";

export abstract class UIObject<
  SubscriptionKeyType extends SubscriptionKeyEnums
> extends SubscriptionManager<SubscriptionKeyType> {
  protected outterSquare: IOutterSquare;
  protected pathsAndPaintingStyles: Map<Path2D, IPaintingStyle>;
  protected textsAndTextPaintingStyles: Map<IText, ITextPaintingStyle>;
  protected alpha: number;
  protected fillStyle: FillStyle;
  protected readonly animationInterruptSubject: Subject<null>;
  protected sizeLimit: number;

  constructor(
    outterSquare: IOutterSquare,
    alpha: number,
    fillStyle: FillStyle,
    sizeLimit: number
  ) {
    super();
    this.fillStyle = fillStyle;
    this.outterSquare = outterSquare;
    this.alpha = alpha;
    this.pathsAndPaintingStyles = new Map<Path2D, IPaintingStyle>();
    this.textsAndTextPaintingStyles = new Map<IText, ITextPaintingStyle>();
    this.animationInterruptSubject = new Subject<null>();
    this.sizeLimit = sizeLimit;
  }

  protected insertPathAndPaintingStyle(
    path: Path2D,
    paintingStyle: IPaintingStyle
  ): void {
    this.pathsAndPaintingStyles.set(path, paintingStyle);
  }

  protected updatePath(path: Path2D, newPath: Path2D): void {
    const paintingStyle: IPaintingStyle = Utility.getFromMapWithKeyValidation(
      this.pathsAndPaintingStyles,
      path
    );
    if (paintingStyle !== null) {
      this.removePathAndPaintingStyle(path);
      this.insertPathAndPaintingStyle(newPath, paintingStyle);
    }
  }

  protected removePathAndPaintingStyle(path: Path2D): void {
    if (this.pathsAndPaintingStyles.has(path))
      this.pathsAndPaintingStyles.delete(path);
  }
  protected insertTextAndTextPaintingStyle(
    text: IText,
    textPaintingStyle: ITextPaintingStyle
  ): void {
    this.textsAndTextPaintingStyles.set(text, textPaintingStyle);
  }

  protected updateText(text: IText, newText: IText): void {
    const textPaintingStyle: ITextPaintingStyle =
      Utility.getFromMapWithKeyValidation(
        this.textsAndTextPaintingStyles,
        text
      );
    if (textPaintingStyle !== null) {
      this.removeTextAndTextPaintingStyle(text);
      this.insertTextAndTextPaintingStyle(newText, textPaintingStyle);
    }
  }

  protected removeTextAndTextPaintingStyle(text: IText): void {
    if (this.textsAndTextPaintingStyles.has(text))
      this.textsAndTextPaintingStyles.delete(text);
  }

  protected resizeFontForTexts(resizeFactor: number): void {
    this.getTextsAndPaintingStyles$().subscribe(
      (textAndPaintingStyle: ITextAndTextPaintingStyle) =>
        (textAndPaintingStyle.textPaintingStyle.fontSize += resizeFactor)
    );
  }
  protected abstract generatePaths(): void;
  protected abstract changeSize(resizeFactor: number): number;
  protected abstract getSize(): number;
  public abstract getAnimaton(): Animations;

  public resizeIfCurrentSizeIsNotMaxSize(resizeFactor: number): boolean {
    if (this.sizeLimit > this.changeSize(resizeFactor) && this.getSize() > 0) {
      this.generatePaths();
      this.resizeFontForTexts(resizeFactor / 2);
      return true;
    }
    return false;
  }

  public getRenderingData$(): Observable<RenderValueTypes> {
    return concat(
      this.getPathsAndPaintingStyles$(),
      this.getTextsAndPaintingStyles$()
    );
  }

  public getRenderValuesCount(): number {
    return (
      this.pathsAndPaintingStyles.size + this.textsAndTextPaintingStyles.size
    );
  }

  public getPathsAndPaintingStyles$(): Observable<IPathAndPaintingStyle> {
    return from(this.pathsAndPaintingStyles.keys()).pipe(
      map((key: Path2D) =>
        ObjectFromInterfaceCreator.createPathAndPaintingStyle(
          key,
          this.pathsAndPaintingStyles.get(key)
        )
      )
    );
  }

  public getTextsAndPaintingStyles$(): Observable<ITextAndTextPaintingStyle> {
    return from(this.textsAndTextPaintingStyles.keys()).pipe(
      map((key: IText) =>
        ObjectFromInterfaceCreator.createTextAndTextPaintingStyle(
          key,
          this.textsAndTextPaintingStyles.get(key)
        )
      )
    );
  }

  public modifyAlpha(modificationFactor: number): boolean {
    this.alpha += modificationFactor;
    let returnValue: boolean = false;
    if (this.alpha > 1) this.alpha = 1;
    else if (this.alpha < 0) this.alpha = 0;
    else returnValue = true;

    return returnValue;
  }

  public getOutterSquare(): IOutterSquare {
    return ObjectFromInterfaceCreator.createOutterSquare(
      this.outterSquare.outterSquareTopLeftCornerCoordinates,
      this.outterSquare.outterSquareSideLength
    );
  }

  public getAlpha(): number {
    return this.alpha;
  }

  public getFillStyle(): FillStyle {
    return this.fillStyle;
  }

  public removeAllSubscriptions(): void {
    this.removeAllSubscriptionsExcept([]);
  }

  public insertSubscription(
    subjectOrObservableEnum: SubscriptionKeyType,
    subscriptionToInsert: Subscription
  ): void {
    this.addSubscription(subjectOrObservableEnum, subscriptionToInsert);
  }

  public getAnimationInterruptSubject(): Subject<null> {
    return this.animationInterruptSubject;
  }
}
