import Annotation from "./Annotation/logic/Annotation";
import NotificationType from "./models/NotificationType";

export type Point = {
  x: number;
  y: number;
};

export type Vector2 = {
  x: number;
  y: number;
};

export type PolygonOperationResult = {
  polygonsToCreate: Point[][];
  annotationsToDelete: Annotation[];
};

export type SIANotification = {
  title: string;
  message: string;
  type: NotificationType;
};
