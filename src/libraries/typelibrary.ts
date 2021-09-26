import { GameObjectEmittingObservables } from "../enumerations/observables/gameObjectEmittingObservables";
import { CoordinatesEmittingObservables } from "../enumerations/observables/coordinatesemittingobservablesenum";
import { NumberEmittingObservables } from "../enumerations/observables/numberEmittingObservables";
import { GameObjectEmittingSubjects } from "../enumerations/subjects/gameObjectEmittingSubjects";
import { NumberEmittingSubjects } from "../enumerations/subjects/numberEmittingSubjects";
import { GameObject } from "../uiObjects/gameObjects/abstractGameObject";
import { ICoordinates } from "../interfaces/icoordinates";
import { ControlSubjects } from "../enumerations/subjects/controlSubjects";
import { ColissionCheckSubjects } from "../enumerations/subjects/colissionCheckSubjects";
import { IColissionCheckStatus } from "../interfaces/iColissionCheckStatus";
import { IPathAndPaintingStyle } from "../interfaces/ui/iPathAndPaintingStyle";
import { ITextAndTextPaintingStyle } from "../interfaces/ui/iTextAndTextPaintingStyle";
import { IKeyAndCoordinates } from "../interfaces/iKeyAndCoordinates";
import { KeyAndCoordinatesEmittingObservables } from "../enumerations/observables/keyAndCoordinatesEmittingObservables";

export type RenderValueTypes =
  | IPathAndPaintingStyle
  | ITextAndTextPaintingStyle;

export type SubjectOrObservableEmittingTypes =
  | SubjectEmittingTypes
  | ObservableEmittingTypes;

export type SubjectEmittingTypes =
  | GameObject
  | number
  | null
  | IColissionCheckStatus;

export type ObservableEmittingTypes =
  | GameObject
  | number
  | ICoordinates
  | IKeyAndCoordinates;

export type SubjectEnum =
  | ControlSubjects
  | GameObjectEmittingSubjects
  | NumberEmittingSubjects
  | ColissionCheckSubjects;

export type ObservableEnum =
  | GameObjectEmittingObservables
  | NumberEmittingObservables
  | CoordinatesEmittingObservables
  | KeyAndCoordinatesEmittingObservables;

export type SubjectOrObservableEnum = SubjectEnum | ObservableEnum;

export type SubjectType =
  | NumberEmittingSubjectType
  | GameObjectEmittingSubjectType
  | NullEmittingSubjectType
  | ColissionCheckStatusEmittingSubjectType;

type NumberEmittingSubjectType = typeof NumberEmittingSubjects;

type GameObjectEmittingSubjectType = typeof GameObjectEmittingSubjects;

type NullEmittingSubjectType = typeof ControlSubjects;

type ColissionCheckStatusEmittingSubjectType = typeof ColissionCheckSubjects;

export type ObservableType =
  | NumberEmittingObservableType
  | GameObjectEmittingObservableType
  | CoordinatesEmittingObservableType
  | KeyAndCoordinatesEmittingObservableType;

type NumberEmittingObservableType = typeof NumberEmittingObservables;

type GameObjectEmittingObservableType = typeof GameObjectEmittingObservables;

type CoordinatesEmittingObservableType = typeof CoordinatesEmittingObservables;

type KeyAndCoordinatesEmittingObservableType =
  typeof KeyAndCoordinatesEmittingObservables;

export type GetObservableEnumFromObservableType<
  ObservableTypeToGetEnumFrom extends ObservableType
> = ObservableTypeToGetEnumFrom extends GameObjectEmittingObservableType
  ? GameObjectEmittingObservables
  : GetObservableEnumFromObservableTypeCondition2<ObservableTypeToGetEnumFrom>;

type GetObservableEnumFromObservableTypeCondition2<
  ObservableTypeToGetEnumFrom extends ObservableType
> = ObservableTypeToGetEnumFrom extends NumberEmittingObservableType
  ? NumberEmittingObservables
  : GetObservableEnumFromObservableTypeCondition3<ObservableTypeToGetEnumFrom>;

type GetObservableEnumFromObservableTypeCondition3<
  ObservableTypeToGetEnumFrom extends ObservableType
> = ObservableTypeToGetEnumFrom extends CoordinatesEmittingObservableType
  ? CoordinatesEmittingObservables
  : GetObservableEnumFromObservableTypeConditio4<ObservableTypeToGetEnumFrom>;

type GetObservableEnumFromObservableTypeConditio4<
  ObservableTypeToGetEnumFrom extends ObservableType
> = ObservableTypeToGetEnumFrom extends KeyAndCoordinatesEmittingObservableType
  ? KeyAndCoordinatesEmittingObservables
  : never;

export type GameObjectSubscriptionObservableKeyTypes =
  | CoordinatesEmittingObservableType
  | NumberEmittingObservableType
  | KeyAndCoordinatesEmittingObservableType;

export type GameObjectSubscriptionSubjectKeyTypes =
  ColissionCheckStatusEmittingSubjectType;

export type GameObjectSubscriptionObservableKeyEnum =
  | CoordinatesEmittingObservables
  | NumberEmittingObservables
  | KeyAndCoordinatesEmittingObservables;

export type GameObjectSubscriptionSubjectKeyEnum = ColissionCheckSubjects;

export type GameObjectSubscriptionsKeyEnum =
  | GameObjectSubscriptionSubjectKeyEnum
  | GameObjectSubscriptionObservableKeyEnum;

export type ManagersSubscriptionKeyEnum = SubjectOrObservableEnum;

export type UIObjectSubscriptionKeyEnum = CoordinatesEmittingObservables;

export type SubscriptionKeyEnums =
  | ManagersSubscriptionKeyEnum
  | GameObjectSubscriptionsKeyEnum
  | UIObjectSubscriptionKeyEnum;

export type GetEmittingValueTypeFromObservableType<
  ObservableTypeToGetEmittingValueTypeFrom extends ObservableType
> = ObservableTypeToGetEmittingValueTypeFrom extends NumberEmittingObservableType
  ? number
  : GetEmittingValueTypeFromObservableTypeCondition2<ObservableTypeToGetEmittingValueTypeFrom>;

type GetEmittingValueTypeFromObservableTypeCondition2<
  ObservableTypeToGetEmittingValueTypeFrom extends ObservableType
> = ObservableTypeToGetEmittingValueTypeFrom extends GameObjectEmittingObservableType
  ? GameObject
  : GetEmittingValueTypeFromObservableTypeCondition3<ObservableTypeToGetEmittingValueTypeFrom>;

type GetEmittingValueTypeFromObservableTypeCondition3<
  ObservableTypeToGetEmittingValueTypeFrom extends ObservableType
> = ObservableTypeToGetEmittingValueTypeFrom extends CoordinatesEmittingObservableType
  ? ICoordinates
  : GetEmittingValueTypeFromObservableTypeCondition4<ObservableTypeToGetEmittingValueTypeFrom>;

type GetEmittingValueTypeFromObservableTypeCondition4<
  ObservableTypeToGetEmittingValueTypeFrom extends ObservableType
> = ObservableTypeToGetEmittingValueTypeFrom extends KeyAndCoordinatesEmittingObservableType
  ? IKeyAndCoordinates
  : never;

export type GetSubjectEnumFromSubjectType<
  SubjectTypeToGetEnumFrom extends SubjectType
> = SubjectTypeToGetEnumFrom extends NumberEmittingSubjectType
  ? NumberEmittingSubjects
  : GetSubjectEnumFromSubjectTypeCondition2<SubjectTypeToGetEnumFrom>;

type GetSubjectEnumFromSubjectTypeCondition2<
  SubjectTypeToGetEnumFrom extends SubjectType
> = SubjectTypeToGetEnumFrom extends GameObjectEmittingSubjectType
  ? GameObjectEmittingSubjects
  : GetSubjectEnumFromSubjectTypeCondition3<SubjectTypeToGetEnumFrom>;

type GetSubjectEnumFromSubjectTypeCondition3<
  SubjectTypeToGetEnumFrom extends SubjectType
> = SubjectTypeToGetEnumFrom extends NullEmittingSubjectType
  ? ControlSubjects
  : GetSubjectEnumFromSubjectTypeCondition4<SubjectTypeToGetEnumFrom>;

type GetSubjectEnumFromSubjectTypeCondition4<
  SubjectTypeToGetEnumFrom extends SubjectType
> = SubjectTypeToGetEnumFrom extends ColissionCheckStatusEmittingSubjectType
  ? ColissionCheckSubjects
  : never;

export type GetEmittingValueTypeFromSubjectType<
  SubjectTypeToGetEmittingValueTypeFrom extends SubjectType
> = SubjectTypeToGetEmittingValueTypeFrom extends NumberEmittingSubjectType
  ? number
  : GetEmittingValueTypeFromSubjectTypeCondition2<SubjectTypeToGetEmittingValueTypeFrom>;

type GetEmittingValueTypeFromSubjectTypeCondition2<
  SubjectTypeToGetEmittingValueTypeFrom extends SubjectType
> = SubjectTypeToGetEmittingValueTypeFrom extends GameObjectEmittingSubjectType
  ? GameObject
  : GetEmittingValueTypeFromSubjectTypeCondition3<SubjectTypeToGetEmittingValueTypeFrom>;

type GetEmittingValueTypeFromSubjectTypeCondition3<
  SubjectTypeToGetEmittingValueTypeFrom extends SubjectType
> = SubjectTypeToGetEmittingValueTypeFrom extends NullEmittingSubjectType
  ? null
  : GetEmittingValueTypeFromSubjectTypeCondition4<SubjectTypeToGetEmittingValueTypeFrom>;

type GetEmittingValueTypeFromSubjectTypeCondition4<
  SubjectTypeToGetEmittingValueTypeFrom extends SubjectType
> = SubjectTypeToGetEmittingValueTypeFrom extends ColissionCheckStatusEmittingSubjectType
  ? IColissionCheckStatus
  : never;
