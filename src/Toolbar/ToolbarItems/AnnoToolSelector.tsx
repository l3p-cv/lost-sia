import { CButtonGroup } from '@coreui/react'
import * as siaIcons from '../../utils/siaIcons'

import AnnotationTool from '../../models/AnnotationTool'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { AllowedTools } from '../../types'
import IconButton from '../../IconButton'

type AnnoToolSelectorProps = {
  allowedTools: AllowedTools
  isDisabled?: boolean
  selectedTool: AnnotationTool
  onSetSelectedTool: (selectedTool: AnnotationTool) => void
  onShouldDeleteSelectedAnnotation?: () => void
}

const AnnoToolSelector = ({
  allowedTools,
  isDisabled = false,
  selectedTool,
  onSetSelectedTool,
  onShouldDeleteSelectedAnnotation = () => {},
}: AnnoToolSelectorProps) => {
  return (
    <CButtonGroup role="group" aria-label="Basic example">
      {allowedTools.point && (
        // <CButton
        //   color="primary"
        //   disabled={isDisabled}
        //   variant={selectedTool == AnnotationTool.Point ? undefined : 'outline'}
        //   onClick={() => onSetSelectedTool(AnnotationTool.Point)}
        // >
        //   {siaIcons.pointIcon()}
        // </CButton>
        <IconButton
          color="primary"
          text={siaIcons.pointIcon()}
          isOutline={selectedTool != AnnotationTool.Point}
          disabled={isDisabled}
          onClick={() => onSetSelectedTool(AnnotationTool.Point)}
          tooltip="Create Point Annotation"
          margin={0}
        />
      )}

      {allowedTools.line && (
        <IconButton
          color="primary"
          text={siaIcons.lineIcon()}
          isOutline={selectedTool != AnnotationTool.Line}
          disabled={isDisabled}
          onClick={() => onSetSelectedTool(AnnotationTool.Line)}
          tooltip="Create Line Annotation"
          margin={0}
        />
      )}

      {allowedTools.bbox && (
        <IconButton
          color="primary"
          text={siaIcons.bBoxIcon()}
          isOutline={selectedTool != AnnotationTool.BBox}
          disabled={isDisabled}
          onClick={() => onSetSelectedTool(AnnotationTool.BBox)}
          tooltip="Create BBox Annotation"
          margin={0}
        />
      )}

      {allowedTools.polygon && (
        <IconButton
          color="primary"
          text={siaIcons.polygonIcon()}
          isOutline={selectedTool != AnnotationTool.Polygon}
          disabled={isDisabled}
          onClick={() => onSetSelectedTool(AnnotationTool.Polygon)}
          tooltip="Create Polygon Annotation"
          margin={0}
        />
      )}

      <IconButton
        color="primary"
        icon={faTrash}
        isOutline={true}
        disabled={isDisabled}
        onClick={onShouldDeleteSelectedAnnotation}
        tooltip="Delete selected annotation"
        margin={0}
      />
    </CButtonGroup>
  )
}

export default AnnoToolSelector
