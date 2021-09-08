import { from, Observable, of, Subscription } from "rxjs";
import { filter, first } from "rxjs/operators";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";

export function checkIfPointIsInCircle(
  coordinates: ICoordinates,
  circleCoordinates: ICoordinates,
  circleRadius: number
): boolean {
  return (
    coordinates.x > circleCoordinates.x - circleRadius &&
    coordinates.x < circleCoordinates.x + circleRadius &&
    coordinates.y > circleCoordinates.y - circleRadius &&
    coordinates.y < circleCoordinates.y + circleRadius
  );
}

export function CheckForAvailableSpaceAroundCircle(circle: ICircle): ICircle {
  const circleSpacesAround: ICoordinates[] = [];
  let availableSpaceFound: boolean = false;

  circleSpacesAround.push({
    x: circle.coordinates.x,
    y: circle.coordinates.y - 100,
  });
  circleSpacesAround.push({
    x: circle.coordinates.x + 100,
    y: circle.coordinates.y - 100,
  });
  circleSpacesAround.push({
    x: circle.coordinates.x + 100,
    y: circle.coordinates.y,
  });
  circleSpacesAround.push({
    x: circle.coordinates.x + 100,
    y: circle.coordinates.y + 100,
  });
  circleSpacesAround.push({
    x: circle.coordinates.x,
    y: circle.coordinates.y + 100,
  });
  circleSpacesAround.push({
    x: circle.coordinates.x - 100,
    y: circle.coordinates.y + 100,
  });
  circleSpacesAround.push({
    x: circle.coordinates.x - 100,
    y: circle.coordinates.y,
  });
  circleSpacesAround.push({
    x: circle.coordinates.x - 100,
    y: circle.coordinates.y - 100,
  });

  from(circleSpacesAround)
    .pipe(
      first(
        (circleSpaceAround: ICoordinates) =>
          !checkIfPointIsInCircle(circle.coordinates, circleSpaceAround, 130),
        null
      ),
      filter((circleSpaceAround: ICoordinates) => circleSpaceAround !== null)
    )
    .subscribe((availableSpace: ICoordinates) => {
      circle.coordinates = availableSpace;
      availableSpaceFound = true;
    });

    console.log("Nadjeno mesto" + availableSpaceFound);
  return availableSpaceFound ? circle : null;
}
