import AnnotationMode from "../../models/AnnotationMode";
import AnnotationStatus from "../../models/AnnotationStatus";
import AnnotationTool from "../../models/AnnotationTool";
import Point from "../../models/Point";

class Annotation {
  id: number;
  annoTime: number;
  coordinates: Point[];
  labelIds: number[];
  mode: AnnotationMode;
  selectedNode: number;
  status: AnnotationStatus;
  type: AnnotationTool;
  timestamp: DOMHighResTimeStamp;

  constructor(type: AnnotationTool, coordinates: Point[]) {
    this.type = type;
    this.mode = AnnotationMode.CREATE;
    this.status = AnnotationStatus.NEW;
    this.coordinates = coordinates;
    this.selectedNode = 1;
    this.timestamp = performance.now();
    this.annoTime = 0.0;
  }

  startAnnotimeMeasure() {
    this.timestamp = performance.now();
  }

  stopAnnotimeMeasure(): number {
    const now = performance.now();
    const duration = (now - this.timestamp) / 1000;
    this.annoTime += duration;
    this.timestamp = now;

    return duration;
  }
}

export default Annotation;
