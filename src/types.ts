import Annotation from "./Annotation/logic/Annotation";
import { AnnotationStatus, AnnotationTool } from "./models";
import NotificationType from "./models/NotificationType";

export type AllowedTools = {
  bbox: boolean;
  junk: boolean;
  line: boolean;
  point: boolean;
  polygon: boolean;
};

export type AnnotationSettings = {
  minimalArea?: number; // @TODO needs to be implemented
  canHaveMultipleLabels: boolean;
  canEdit?: boolean;
  canCreate: boolean;
  canLabel: boolean;
};

export type ExternalAnnotation = {
  externalId?: string;
  annoTime?: number;
  coordinates: Point[];
  status: AnnotationStatus;
  labelIds: number[];
  type: AnnotationTool;
  timestamp?: DOMHighResTimeStamp;
};

export type Label = {
  id: number;
  name: string;
  description: string;
  color?: string;
};

export type Point = {
  x: number;
  y: number;
};

export type PolygonOperationResult = {
  polygonsToCreate: ToolCoordinates[];
  annotationsToDelete: Annotation[];
};

export type SIANotification = {
  title: string;
  message: string;
  type: NotificationType;
};

export type ToolCoordinates = {
  coordinates: Point[];
  type: AnnotationTool;
};

export type UiConfig = {
  strokeWidth: number;
  nodeRadius: number;
  imageCentered: boolean;
};

export type Vector2 = {
  x: number;
  y: number;
};
