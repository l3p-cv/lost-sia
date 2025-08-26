import Annotation from "../../Annotation/logic/Annotation";
import AnnotationTool from "../../models/AnnotationTool";
import UiConfig from "../../models/UiConfig";
import Sia2 from "../../Sia2";

import { imgBlob } from "../siaDummyData";
import { possibleLabels } from "../siaDummyData2";

type DemoWrapperProps = {
  annotations?: Annotation[];
};

const DemoWrapper = ({ annotations = [] }: DemoWrapperProps) => {
  const uiConfig: UiConfig = {
    nodeRadius: 4,
    strokeWidth: 4,
  };

  return (
    <Sia2
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
