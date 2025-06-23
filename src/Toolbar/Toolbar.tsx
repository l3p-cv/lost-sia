import { CCol, CRow } from "@coreui/react";

import AnnoToolSelector from "./ToolbarItems/AnnoToolSelector";
import ImageTools from "./ToolbarItems/ImageTools";
import AnnotationTool from "../models/AnnotationTool";
import AllowedTools from "../models/AllowedTools";
import AccessibilityTools from "./ToolbarItems/AccessibilityTools";
import { ReactElement } from "react";

type ToolbarProps = {
  allowedTools: AllowedTools;
  additionalButtons: ReactElement | undefined;
};

const Toolbar = ({ allowedTools, additionalButtons }: ToolbarProps) => {
  return (
    <CRow>
      <CCol>
        <ImageTools canJunk={allowedTools.junk} />
      </CCol>

      <CCol>
        <AnnoToolSelector
          defaultTool={AnnotationTool.Polygon}
          allowedTools={allowedTools}
        />
      </CCol>

      <CCol>
        <AccessibilityTools />
      </CCol>

      {additionalButtons && <CCol>{additionalButtons}</CCol>}
    </CRow>
  );
};

export default Toolbar;
