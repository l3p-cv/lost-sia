import Annotation from "../../Annotation/logic/Annotation";
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
      onAnnoCreated={(anno: Annotation, annos: Annotation[]) => {
        console.log("CREATED", anno);
      }}
      onAnnoChanged={(anno: Annotation, annos: Annotation[]) => {
        console.log("CHANGED", anno.coordinates);
      }}
    />
  );
};

export default DemoWrapper;
