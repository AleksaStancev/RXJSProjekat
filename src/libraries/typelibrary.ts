import { ControlSubjects } from "../enumerations/controlsubjectsenum";
import { NumberEmittingSubjects } from "../enumerations/numberemittingsubjectsenum";
import { CircleEmittingSubjects } from "../enumerations/circleemittingsubjectsenum";
import { CircleEmittingObservables } from "../enumerations/circleemittingobservablesenum";
import { CoordinatesEmittingObservables } from "../enumerations/coordinatesemittingobservablesenum";
import { NumberEmittingObservables } from "../enumerations/numberemittingobservablesenum";
import { ICircle } from "../interfaces/icircle";
import { ICoordinates } from "../interfaces/icoordinates";

export type SubjectAndObservableEmittingType =
  | ICircle
  | ICoordinates
  | number
  | any;

export type SubjectOrObservableEnum =
  | ControlSubjects
  | CircleEmittingSubjects
  | NumberEmittingSubjects
  | CircleEmittingObservables
  | NumberEmittingObservables
  | CoordinatesEmittingObservables;

export type GetSubjectOrObservableEnum<
  SubjectOrObservableToGetEnumFromType extends SubjectOrObservableType
> = SubjectOrObservableToGetEnumFromType extends SubjectType
  ? GetSubjectEnum<SubjectOrObservableToGetEnumFromType>
  : GetSubjectOrObservableEnumCondition2<SubjectOrObservableToGetEnumFromType>;

type GetSubjectOrObservableEnumCondition2<
  SubjectOrObservableToGetEnumFromType extends SubjectOrObservableType
> = SubjectOrObservableToGetEnumFromType extends typeof CircleEmittingObservables
  ? CircleEmittingObservables
  : GetSubjectOrObservableEnumCondition3<SubjectOrObservableToGetEnumFromType>;

type GetSubjectOrObservableEnumCondition3<
  SubjectOrObservableToGetEnumFromType extends SubjectOrObservableType
> = SubjectOrObservableToGetEnumFromType extends typeof NumberEmittingObservables
  ? NumberEmittingObservables
  : GetSubjectOrObservableEnumCondition4<SubjectOrObservableToGetEnumFromType>;

type GetSubjectOrObservableEnumCondition4<
  SubjectOrObservableToGetEnumFromType extends SubjectOrObservableType
> = SubjectOrObservableToGetEnumFromType extends typeof CoordinatesEmittingObservables
  ? CoordinatesEmittingObservables
  : never;

export type SubjectOrObservableType =
  | CircleEmittingSubjectOrObservableType
  | NumberEmittingSubjectOrObservableType
  | CoordinatesEmittingSubjectOrObservableType
  | AnyEmittingSubjectOrObservableType;

type CircleEmittingSubjectOrObservableType =
  | CircleEmittingSubjectType
  | typeof CircleEmittingObservables;

type NumberEmittingSubjectOrObservableType =
  | NumberEmittingSubjectType
  | typeof NumberEmittingObservables;

type CoordinatesEmittingSubjectOrObservableType =
  typeof CoordinatesEmittingObservables;

type AnyEmittingSubjectOrObservableType = AnyEmittingSubjectType;

export type GetEmittingValueType<
  SubjectOrObservableToGetEmittingValueTypeFromType extends SubjectOrObservableType
> = SubjectOrObservableToGetEmittingValueTypeFromType extends NumberEmittingSubjectOrObservableType
  ? number
  : GetEmittingValueTypeCondition2<SubjectOrObservableToGetEmittingValueTypeFromType>;

type GetEmittingValueTypeCondition2<
  SubjectOrObservableToGetEmittingValueTypeFromType extends SubjectOrObservableType
> = SubjectOrObservableToGetEmittingValueTypeFromType extends CircleEmittingSubjectOrObservableType
  ? ICircle
  : GetEmittingValueTypeCondition3<SubjectOrObservableToGetEmittingValueTypeFromType>;

type GetEmittingValueTypeCondition3<
  SubjectOrObservableToGetEmittingValueTypeFromType extends SubjectOrObservableType
> = SubjectOrObservableToGetEmittingValueTypeFromType extends CoordinatesEmittingSubjectOrObservableType
  ? ICoordinates
  : GetEmittingValueTypeCondition4<SubjectOrObservableToGetEmittingValueTypeFromType>;

type GetEmittingValueTypeCondition4<
  SubjectOrObservableToGetEmittingValueTypeFromType extends SubjectOrObservableType
> = SubjectOrObservableToGetEmittingValueTypeFromType extends AnyEmittingSubjectOrObservableType
  ? any
  : never;

export type SubjectType =
  | NumberEmittingSubjectType
  | CircleEmittingSubjectType
  | AnyEmittingSubjectType;

type NumberEmittingSubjectType = typeof NumberEmittingSubjects;

type CircleEmittingSubjectType = typeof CircleEmittingSubjects;

type AnyEmittingSubjectType = typeof ControlSubjects;

export type GetSubjectEnum<SubjectToGetEnumFromType extends SubjectType> =
  SubjectToGetEnumFromType extends NumberEmittingSubjectType
    ? NumberEmittingSubjects
    : GetSubjectEnumCondition2<SubjectToGetEnumFromType>;

type GetSubjectEnumCondition2<SubjectToGetEnumFromType extends SubjectType> =
  SubjectToGetEnumFromType extends CircleEmittingSubjectType
    ? CircleEmittingSubjects
    : GetSubjectEnumCondition3<SubjectToGetEnumFromType>;

type GetSubjectEnumCondition3<SubjectToGetEnumFromType extends SubjectType> =
  SubjectToGetEnumFromType extends AnyEmittingSubjectType
    ? ControlSubjects
    : never;

export type GetNextParametarType<
  SubjectToGetNextParametarTypeFromType extends SubjectType
> = SubjectToGetNextParametarTypeFromType extends NumberEmittingSubjectType
  ? number
  : GetNextParametarTypeCondition2<SubjectToGetNextParametarTypeFromType>;

type GetNextParametarTypeCondition2<
  SubjectToGetNextParametarTypeFromType extends SubjectType
> = SubjectToGetNextParametarTypeFromType extends CircleEmittingSubjectType
  ? ICircle
  : GetNextParametarTypeCondition3<SubjectToGetNextParametarTypeFromType>;

type GetNextParametarTypeCondition3<
  SubjectToGetNextParametarTypeFromType extends SubjectType
> = SubjectToGetNextParametarTypeFromType extends AnyEmittingSubjectType
  ? any
  : never;
