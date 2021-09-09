import { Animations } from "../enumerations/animationsenum";
import { ICircle } from "../interfaces/icircle";
import { IRemoveCircleFromCanvasSettings } from "../interfaces/iremovecirclefromcanvassettings";

export function setupAnimationAndGetLoopCondition(
  circle: ICircle,
  renderingContext: CanvasRenderingContext2D,
  removeCircleFromCanvasSettings: IRemoveCircleFromCanvasSettings
): boolean {
  switch (circle.animation) {
    case Animations.zoomIn:
      return zoomInOutAnimation(
        circle,
        renderingContext,
        true,
        removeCircleFromCanvasSettings
      );
    case Animations.zoomOut:
      return zoomInOutAnimation(
        circle,
        renderingContext,
        false,
        removeCircleFromCanvasSettings
      );
    case Animations.fadeOut:
      return fadeOutAnimation(
        circle,
        renderingContext,
        removeCircleFromCanvasSettings
      );
  }
}

function setPaintingStyles(
  fillStyle: string | CanvasGradient,
  shadowColor: string,
  strokeStyle: string,
  renderingContext: CanvasRenderingContext2D
): void {
  renderingContext.fillStyle = fillStyle;
  renderingContext.shadowColor = shadowColor;
  renderingContext.strokeStyle = strokeStyle;
}

function fadeOutAnimation(
  circle: ICircle,
  renderingContext: CanvasRenderingContext2D,
  removeCircleFromCanvasSettings: IRemoveCircleFromCanvasSettings
): boolean {
  removeCircleFromCanvasSettings.deleteBeforeDrawing = true;
  circle.alpha -= 0.05;
  setPaintingStyles(
    `rgba(${circle.gradient},${circle.alpha})`,
    `rgba(64,64,64,${circle.alpha})`,
    `rgba(1,159,98,${circle.alpha})`,
    renderingContext
  );

  return circle.alpha > 0;
}
function zoomInOutAnimation(
  circle: ICircle,
  renderingContext: CanvasRenderingContext2D,
  zoomIn: boolean,
  removeCircleFromCanvasSettings: IRemoveCircleFromCanvasSettings
): boolean {
  circle.path = new Path2D();
  circle.path.arc(
    circle.coordinates.x,
    circle.coordinates.y,
    circle.radius,
    0,
    Math.PI * 2
  );

  let radgrad = renderingContext.createRadialGradient(
    circle.coordinates.x - 10,
    circle.coordinates.y - 10,
    10,
    circle.coordinates.x,
    circle.coordinates.y,
    50
  );
  radgrad.addColorStop(0, "#A7D30C");
  radgrad.addColorStop(1, "#019F62");

  setPaintingStyles(radgrad, `rgba(64,64,64,1)`, "#019F62", renderingContext);

  const a = (circle.coordinates.x - circle.radius);
  removeCircleFromCanvasSettings.deleteBeforeDrawingSettings.rectangleTopLeftCoordinates =
    {
      x: a,
      y: circle.coordinates.y - circle.radius,
    };
  removeCircleFromCanvasSettings.deleteAfterDrawingSettings.rectangleTopLeftCoordinates =
    {
      x: circle.coordinates.x - circle.radius,
      y: circle.coordinates.y - circle.radius,
    };
  removeCircleFromCanvasSettings.deleteBeforeDrawingSettings.rectangleSideLenght =
    2 * circle.radius + 15;
  removeCircleFromCanvasSettings.deleteAfterDrawingSettings.rectangleSideLenght =
    2 * circle.radius + 5;

  removeCircleFromCanvasSettings.deleteBeforeDrawingSettings.rectangleTopLeftCoordinates =
    circle.coordinates;

  if (zoomIn) {
    removeCircleFromCanvasSettings.deleteBeforeDrawing = true;
    removeCircleFromCanvasSettings.deleteAfterDrawing = false;

    circle.radius += 10;
    return circle.radius < 50;
  } else {
    removeCircleFromCanvasSettings.deleteBeforeDrawing = true;
    circle.radius -= 10;
    return !(removeCircleFromCanvasSettings.deleteAfterDrawing =
      circle.radius <= 0);
  }
}
