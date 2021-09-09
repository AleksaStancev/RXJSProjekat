import { ICoordinates } from "./icoordinates";
import { IRemoveFromCanvasSettings } from "./iremovefromcanvassettings";

export interface IRemoveCircleFromCanvasSettings {
  deleteBeforeDrawing: boolean;
  deleteBeforeDrawingSettings: IRemoveFromCanvasSettings;
  deleteAfterDrawing: boolean;
  deleteAfterDrawingSettings: IRemoveFromCanvasSettings;
}
