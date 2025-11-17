import { CButtonGroup } from '@coreui/react'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { Label } from '../../types'
import ImageLabelInput from './ImageToolItems/ImageLabelInput'
import IconButton from '../../IconButton'

type ImageToolsProps = {
  canJunk: boolean
  imageLabelIds?: number[]
  isDisabled?: boolean
  isFullscreen?: boolean
  isImageJunk?: boolean
  possibleLabels: Label[]
  onImageLabelsChanged?: (selectedImageIds: number[]) => void
  onSetIsImageJunk?: (isImageJunk: boolean) => void
}

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
  const [isLabelPopupVisible, setIsLabelPopupVisible] = useState<boolean>(false)

  // close modal when the fullscreen state changes
  useEffect(() => {
    setIsLabelPopupVisible(false)
  }, [isFullscreen])

  return (
    <CButtonGroup role="group" aria-label="Image Tools">
      {possibleLabels && (
        <ImageLabelInput
          isDisabled={isDisabled}
          isMultilabel={true}
          isVisible={isLabelPopupVisible}
          selectedLabelsIds={imageLabelIds}
          possibleLabels={possibleLabels}
          onLabelSelect={(selectedLabelIds: number[]) => {
            setIsLabelPopupVisible(false)
            onImageLabelsChanged(selectedLabelIds)
          }}
        />
      )}

      {canJunk && (
        <IconButton
          color="primary"
          icon={faBan}
          isOutline={!isImageJunk}
          disabled={isDisabled}
          onClick={() => onSetIsImageJunk(!isImageJunk)}
          tooltip="Junk image"
        />
      )}
    </CButtonGroup>
  )
}

export default ImageTools
