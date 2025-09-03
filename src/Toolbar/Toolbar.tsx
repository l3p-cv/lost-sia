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
}: ToolbarProps) => {
  return (
    <CRow>
      <CCol>
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

      {annotationSettings.canCreate && (
        <CCol>
          <AnnoToolSelector
            allowedTools={allowedTools}
            isDisabled={isDisabled}
            selectedTool={selectedTool}
            onSetSelectedTool={onSetSelectedTool}
          />
        </CCol>
      )}

      <CCol>
        <AccessibilityTools isDisabled={isDisabled} />
      </CCol>

      {additionalButtons && <CCol>{additionalButtons}</CCol>}
    </CRow>
  );
};

export default Toolbar;
