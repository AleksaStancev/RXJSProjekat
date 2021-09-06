import { Animations } from "../enumerations/animationsenum";
import { ICircle } from "../interfaces/icircle";

export function setupAnimationAndGetLoopCondition(
  circle: ICircle,
  renderingContext: CanvasRenderingContext2D
): boolean {
  switch (circle.animation) {
    case Animations.zoomIn:
      return zoomInAnimation(circle, renderingContext);
    case Animations.fadeOut:
      return fadeOutAnimation(circle, renderingContext);
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
  renderingContext: CanvasRenderingContext2D
): boolean {
  circle.alpha -= 0.05;
  setPaintingStyles(
    `rgba(${circle.gradient},${circle.alpha})`,
    `rgba(64,64,64,${circle.alpha})`,
    `rgba(1,159,98,${circle.alpha})`,
    renderingContext
  );

  return circle.alpha > 0;
}
function zoomInAnimation(
  circle: ICircle,
  renderingContext: CanvasRenderingContext2D
): boolean {
  circle.path = new Path2D();
  circle.path.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);

  let radgrad = renderingContext.createRadialGradient(
    circle.x - 10,
    circle.y - 10,
    10,
    circle.x,
    circle.y,
    50
  );
  radgrad.addColorStop(0, "#A7D30C");
  radgrad.addColorStop(1, "#019F62");

  setPaintingStyles(radgrad, `rgba(64,64,64,1)`, "#019F62", renderingContext);
  circle.radius += 10;
  return circle.radius < 50;
}
