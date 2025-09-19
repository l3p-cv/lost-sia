import AnnotationMode from "../../models/AnnotationMode";
import AnnotationStatus from "../../models/AnnotationStatus";
import AnnotationTool from "../../models/AnnotationTool";
import Point from "../../models/Point";

class Annotation {
  internalId: number;
  externalId?: string;
  annoTime: number;
  coordinates: Point[];
  labelIds: number[];
  mode: AnnotationMode; // do we even need this globally? - only really used inside AnnotationComponent
  selectedNode: number;
  status: AnnotationStatus;
  type: AnnotationTool;
  timestamp: DOMHighResTimeStamp;

  constructor(
    internalId: number,
    type: AnnotationTool,
    coordinates: Point[],
    mode: AnnotationMode = AnnotationMode.CREATE,
    status: AnnotationStatus = AnnotationStatus.CREATING,
    externalId: string = "",
  ) {
    this.internalId = internalId;
    this.externalId = externalId;
    this.labelIds = [];
    this.type = type;
    this.mode = mode;
    this.status = status;
    this.coordinates = coordinates;
    this.selectedNode = 1;
    this.timestamp = performance.now();
    this.annoTime = 0.0;
  }
}

export default Annotation;
