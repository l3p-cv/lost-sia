import AnnotationStatus from "./AnnotationStatus";
import AnnotationTool from "./AnnotationTool";
import { Point } from "../types";

type ExternalAnnotation = {
  externalId?: string;
  annoTime?: number;
  coordinates: Point[];
  status: AnnotationStatus;
  labelIds: number[];
  type: AnnotationTool;
  timestamp?: DOMHighResTimeStamp;
};

export default ExternalAnnotation;
