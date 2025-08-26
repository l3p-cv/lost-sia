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
  selectedTool: AnnotationTool;
  onSetSelectedTool: (selectedTool: AnnotationTool) => void;
};

const Toolbar = ({
  annotationSettings,
  allowedTools,
  additionalButtons,
  selectedTool,
  onSetSelectedTool,
}: ToolbarProps) => {
  return (
    <CRow>
      <CCol>
        <ImageTools canJunk={allowedTools.junk} />
      </CCol>

      {annotationSettings.canCreate && (
        <CCol>
          <AnnoToolSelector
            allowedTools={allowedTools}
            selectedTool={selectedTool}
            onSetSelectedTool={onSetSelectedTool}
          />
        </CCol>
      )}

      <CCol>
        <AccessibilityTools />
      </CCol>

      {additionalButtons && <CCol>{additionalButtons}</CCol>}
    </CRow>
  );
};

export default Toolbar;
