import { CCol, CRow } from "@coreui/react";

import AnnoToolSelector from "./ToolbarItems/AnnoToolSelector";
import ImageTools from "./ToolbarItems/ImageTools";
import AnnotationTool from "../models/AnnotationTool";
import AllowedTools from "../models/AllowedTools";
import AccessibilityTools from "./ToolbarItems/AccessibilityTools";
import { ReactElement } from "react";
import AnnotationSettings from "../models/AnnotationSettings";

type ToolbarProps = {
  annotationSettings: AnnotationSettings;
  allowedTools: AllowedTools;
  additionalButtons: ReactElement | undefined;
  isDisabled?: boolean;
  selectedTool: AnnotationTool;
  onSetSelectedTool: (selectedTool: AnnotationTool) => void;
};

const Toolbar = ({
  annotationSettings,
  allowedTools,
  additionalButtons,
  isDisabled = false,
  selectedTool,
  onSetSelectedTool,
}: ToolbarProps) => {
  return (
    <CRow>
      <CCol>
        <ImageTools canJunk={allowedTools.junk} isDisabled={isDisabled} />
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
