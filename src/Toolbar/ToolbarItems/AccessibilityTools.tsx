import { CButtonGroup } from '@coreui/react'
import { faMaximize, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import InstructionsModal from './InstructionsModal'
import IconButton from '../../IconButton'

type AccessibilityToolsProps = {
  isDisabled?: boolean
  isFullscreen?: boolean
  onSetIsFullscreen?: (isFullscreen: boolean) => void
}

const AccessibilityTools = ({
  isDisabled = false,
  isFullscreen = false,
  onSetIsFullscreen = () => {},
}: AccessibilityToolsProps) => {
  const [isInstructionsModalVisible, setIsInstructionsModalVisible] =
    useState<boolean>(false)

  return (
    <CButtonGroup role="group" aria-label="Basic example">
      <IconButton
        color="primary"
        icon={faMaximize}
        isOutline={!isFullscreen}
        disabled={isDisabled}
        onClick={() => onSetIsFullscreen(!isFullscreen)}
        tooltip="Toggle fullscreen"
      />

      <IconButton
        color="primary"
        icon={faQuestion}
        isOutline={true}
        disabled={isDisabled}
        onClick={() => setIsInstructionsModalVisible(true)}
        tooltip="Open instructions"
      />

      <InstructionsModal
        isOpen={isInstructionsModalVisible}
        setIsOpen={setIsInstructionsModalVisible}
      />
    </CButtonGroup>
  )
}

export default AccessibilityTools
