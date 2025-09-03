import { CButton, CButtonGroup, CPopover } from "@coreui/react";
import { faBan, faTag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ImageLabel from "./ImageToolItems/ImageLabel";
import Label from "../../models/Label";

type ImageToolsProps = {
  canJunk: boolean;
  imageLabelIds?: number[];
  isDisabled?: boolean;
  isImageJunk?: boolean;
  possibleLabels: Label[];
  onImageLabelsChanged?: (selectedImageIds: number[]) => void;
  onSetIsImageJunk?: (isImageJunk: boolean) => void;
};

const ImageTools = ({
  canJunk,
  isDisabled = false,
  isImageJunk = false,
  imageLabelIds = [],
  possibleLabels,
  onImageLabelsChanged = () => {},
  onSetIsImageJunk = () => {},
}: ImageToolsProps) => {
  const customPopoverStyle = {
    "--cui-popover-max-width": "800px",
  };

  return (
    <CButtonGroup role="group" aria-label="Image Tools">
      <CPopover
        placement="bottom"
        content={
          <ImageLabel
            selectedLabelIds={imageLabelIds}
            possibleLabels={possibleLabels}
            onImageLabelsChanged={onImageLabelsChanged}
          />
        }
        style={customPopoverStyle}
      >
        <CButton color="primary" variant="outline" disabled={isDisabled}>
          <FontAwesomeIcon icon={faTag as IconProp} size="lg" />
        </CButton>
      </CPopover>

      {canJunk && (
        <CButton
          color="primary"
          variant={isImageJunk ? "" : "outline"}
          disabled={isDisabled}
          onClick={() => onSetIsImageJunk(!isImageJunk)}
        >
          <FontAwesomeIcon icon={faBan as IconProp} size="lg" />
        </CButton>
      )}
    </CButtonGroup>
  );
};

export default ImageTools;
