import { CButton, CButtonGroup, CPopover } from "@coreui/react";
import { faBan, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import ImageLabel from "./ImageToolItems/ImageLabel";
import { useEffect, useState } from "react";
import { Label } from "../../types";

type ImageToolsProps = {
  canJunk: boolean;
  imageLabelIds?: number[];
  isDisabled?: boolean;
  isFullscreen?: boolean;
  isImageJunk?: boolean;
  possibleLabels: Label[];
  onImageLabelsChanged?: (selectedImageIds: number[]) => void;
  onSetIsImageJunk?: (isImageJunk: boolean) => void;
};

const ImageTools = ({
  canJunk,
  isDisabled = false,
  isFullscreen = false,
  isImageJunk = false,
  imageLabelIds = [],
  possibleLabels,
  onImageLabelsChanged = () => {},
  onSetIsImageJunk = () => {},
}: ImageToolsProps) => {
  const [isLabelPopupVisible, setIsLabelPopupVisible] =
    useState<boolean>(false);

  const customPopoverStyle = {
    "--cui-popover-max-width": "800px",
    zIndex: 7000,
  };

  // close modal when the fullscreen state changes
  useEffect(() => {
    setIsLabelPopupVisible(false);
  }, [isFullscreen]);

  return (
    <CButtonGroup role="group" aria-label="Image Tools">
      <CPopover
        placement="bottom"
        visible={isLabelPopupVisible}
        // make sure the visible var stays updated (otherwise we cannot close it)
        onShow={() => setIsLabelPopupVisible(true)}
        onHide={() => setIsLabelPopupVisible(false)}
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
          variant={isImageJunk ? undefined : "outline"}
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
