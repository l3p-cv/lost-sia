import Annotation from "./Annotation/logic/Annotation";

export type Point = {
  x: number;
  y: number;
};

export type PolygonOperationResult = {
  polygonsToCreate: Point[][];
  annotationsToDelete: Annotation[];
};
