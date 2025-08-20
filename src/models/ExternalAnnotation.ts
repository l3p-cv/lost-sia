import AnnotationTool from "./AnnotationTool";
import Point from "./Point";

type ExternalAnnotation = {
  externalId?: string;
  annoTime?: number;
  coordinates: Point[];
  labelIds: number[];
  type: AnnotationTool;
  timestamp?: DOMHighResTimeStamp;
};

export default ExternalAnnotation;
