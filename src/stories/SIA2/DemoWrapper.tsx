import Annotation from "../../Annotation/logic/Annotation";
import AnnotationSettings from "../../models/AnnotationSettings";
import AnnotationTool from "../../models/AnnotationTool";
import UiConfig from "../../models/UiConfig";
import Sia2 from "../../Sia2";

import { imgBlob } from "../siaDummyData";
import { possibleLabels } from "../siaDummyData2";

type DemoWrapperProps = {
  annotations?: Annotation[];
  annotationSettings?: AnnotationSettings;
};

const DemoWrapper = ({
  annotations = [],
  annotationSettings,
}: DemoWrapperProps) => {
  const uiConfig: UiConfig = {
    nodeRadius: 4,
    strokeWidth: 4,
  };

  return (
    <Sia2
      annotationSettings={annotationSettings}
      initialAnnotations={annotations}
      possibleLabels={possibleLabels}
      uiConfig={uiConfig}
      image={imgBlob}
      defaultAnnotationTool={AnnotationTool.Polygon}
      onAnnoCreated={(anno: Annotation, annos: Annotation[]) => {
        console.log("CREATED", anno);
      }}
      onAnnoCreationFinished={(anno: Annotation, annos: Annotation[]) => {
        console.log("FINISHED CREATION", anno);
      }}
      onAnnoChanged={(anno: Annotation, annos: Annotation[]) => {
        console.log("CHANGED", anno);
      }}
    />
  );
};

export default DemoWrapper;
