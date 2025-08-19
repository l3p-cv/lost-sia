import Annotation from "../../Annotation/logic/Annotation";
import Canvas from "../../Canvas/Canvas";
import AnnotationTool from "../../models/AnnotationTool";
import CanvasAction from "../../models/CanvasAction";
import Label from "../../models/Label";
import UiConfig from "../../models/UiConfig";

type CanvasProps = {
  annotations?: Annotation[];
  image: string;
  selectedAnnoTool: AnnotationTool;
  possibleLabels: Label[];
  preventScrolling: boolean;
  uiConfig: UiConfig;
  onAnnoEvent?: (
    annotation: Annotation,
    canvasAction: CanvasAction,
  ) => void | undefined;
  onKeyDown?: (e) => void | undefined;
  onKeyUp?: (e) => void | undefined;
};

const CanvasWithOffset = ({
  annotations = [],
  image,
  selectedAnnoTool,
  possibleLabels,
  preventScrolling,
  uiConfig,
  onAnnoEvent: propsOnAnnoEvent,
  onKeyDown: propOnKeyDown,
  onKeyUp: propsOnKeyUp,
}: CanvasProps) => {
  return (
    <>
      <h1>A line to generate offset</h1>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 200,
          background: "green",
        }}
      >
        <Canvas
          annotations={annotations}
          image={image}
          selectedAnnoTool={selectedAnnoTool}
          possibleLabels={possibleLabels}
          preventScrolling={preventScrolling}
          uiConfig={uiConfig}
        />
      </div>
    </>
  );
};

export default CanvasWithOffset;
