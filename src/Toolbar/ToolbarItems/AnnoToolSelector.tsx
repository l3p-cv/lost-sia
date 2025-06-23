import { CButton, CButtonGroup } from "@coreui/react";
import * as siaIcons from "../../utils/siaIcons";
import { useState } from "react";

import AnnotationTool from "../../models/AnnotationTool";
import AllowedTools from "../../models/AllowedTools";

type AnnoToolSelectorProps = {
  defaultTool: AnnotationTool;
  allowedTools: AllowedTools;
};

const AnnoToolSelector = ({
  defaultTool,
  allowedTools,
}: AnnoToolSelectorProps) => {
  const [selectedTool, setSelectedTool] = useState<AnnotationTool>(defaultTool);

  return (
    <CButtonGroup role="group" aria-label="Basic example">
      {allowedTools.point && (
        <CButton
          color="primary"
          variant={selectedTool == AnnotationTool.Point ? undefined : "outline"}
          onClick={() => setSelectedTool(AnnotationTool.Point)}
        >
          {siaIcons.pointIcon()}
        </CButton>
      )}

      {allowedTools.line && (
        <CButton
          color="primary"
          variant={selectedTool == AnnotationTool.Line ? undefined : "outline"}
          onClick={() => setSelectedTool(AnnotationTool.Line)}
        >
          {siaIcons.lineIcon()}
        </CButton>
      )}

      {allowedTools.bbox && (
        <CButton
          color="primary"
          variant={selectedTool == AnnotationTool.BBox ? undefined : "outline"}
          onClick={() => setSelectedTool(AnnotationTool.BBox)}
        >
          {siaIcons.bBoxIcon()}
        </CButton>
      )}

      {allowedTools.polygon && (
        <CButton
          color="primary"
          variant={
            selectedTool == AnnotationTool.Polygon ? undefined : "outline"
          }
          onClick={() => setSelectedTool(AnnotationTool.Polygon)}
        >
          {siaIcons.polygonIcon()}
        </CButton>
      )}
    </CButtonGroup>
  );
};

export default AnnoToolSelector;
