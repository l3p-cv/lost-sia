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
  isLoading?: boolean;
};

const DemoWrapper = ({
  annotations = [],
  annotationSettings,
  isLoading = false,
}: DemoWrapperProps) => {
  const uiConfig: UiConfig = {
    nodeRadius: 4,
    strokeWidth: 4,
  };

  return (
    <Sia2
      annotationSettings={annotationSettings}
      initialAnnotations={annotations}
      isLoading={isLoading}
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
      onAnnoDeleted={(anno: Annotation, annos: Annotation[]) => {
        console.log("DELETED", anno, annos);
      }}
      onImageLabelsChanged={(imageLabelIds: number[]) => {
        console.log("IMAGE LABEL IDS CHANGED", imageLabelIds);
      }}
    />
  );
};

export default DemoWrapper;
