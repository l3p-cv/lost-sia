import { CCol, CRow } from "@coreui/react";

import AnnoToolSelector from "./ToolbarItems/AnnoToolSelector";
import ImageTools from "./ToolbarItems/ImageTools";
import AnnotationTool from "../models/AnnotationTool";
import AllowedTools from "../models/AllowedTools";
import AccessibilityTools from "./ToolbarItems/AccessibilityTools";
import { ReactElement } from "react";
import AnnotationSettings from "../models/AnnotationSettings";
import Label from "../models/Label";

type ToolbarProps = {
  annotationSettings: AnnotationSettings;
  allowedTools: AllowedTools;
  additionalButtons: ReactElement | undefined;
  isImageJunk?: boolean;
  imageLabelIds?: number[];
  isDisabled?: boolean;
  possibleLabels: Label[];
  selectedTool: AnnotationTool;
  onImageLabelsChanged?: (selectedImageIds: number[]) => void;
  onSetIsImageJunk?: (isImageJunk: boolean) => void;
  onSetSelectedTool?: (selectedTool: AnnotationTool) => void;
  onShouldDeleteSelectedAnnotation?: () => void;
};

const Toolbar = ({
  annotationSettings,
  allowedTools,
  additionalButtons,
  isImageJunk = false,
  imageLabelIds = [],
  isDisabled = false,
  possibleLabels,
  selectedTool,
  onImageLabelsChanged = () => {},
  onSetIsImageJunk = () => {},
  onSetSelectedTool = () => {},
  onShouldDeleteSelectedAnnotation = () => {},
}: ToolbarProps) => {
  return (
    <CRow xs={{ gutterY: 2 }}>
      <CCol xs={4} sm={2} xxl={1}>
        <ImageTools
          canJunk={allowedTools.junk}
          isImageJunk={isImageJunk}
          imageLabelIds={imageLabelIds}
          isDisabled={isDisabled}
          possibleLabels={possibleLabels}
          onImageLabelsChanged={onImageLabelsChanged}
          onSetIsImageJunk={onSetIsImageJunk}
        />
      </CCol>

      <CCol xs={2} sm={1}>
        <AccessibilityTools isDisabled={isDisabled} />
      </CCol>

      {annotationSettings.canCreate && (
        <CCol xs={8} sm={5} md={4} xl={3} xxl={3}>
          <AnnoToolSelector
            allowedTools={allowedTools}
            isDisabled={isDisabled}
            selectedTool={selectedTool}
            onSetSelectedTool={onSetSelectedTool}
            onShouldDeleteSelectedAnnotation={onShouldDeleteSelectedAnnotation}
          />
        </CCol>
      )}

      {additionalButtons && additionalButtons}
    </CRow>
  );
};

export default Toolbar;
