import { CButton, CButtonGroup } from "@coreui/react";
import {
  faCog,
  faFilter,
  faMaximize,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";
import InstructionsModal from "./InstructionsModal";

type AccessibilityToolsProps = {
  isDisabled?: boolean;
};

const AccessibilityTools = ({
  isDisabled = false,
}: AccessibilityToolsProps) => {
  const [isInstructionsModalVisible, setIsInstructionsModalVisible] =
    useState<boolean>(false);

  return (
    <CButtonGroup role="group" aria-label="Basic example">
      <CButton
        color="primary"
        disabled={isDisabled}
        variant="outline"
        onClick={() => {}}
      >
        <FontAwesomeIcon icon={faFilter as IconProp} size="lg" />
      </CButton>

      <CButton
        color="primary"
        disabled={isDisabled}
        variant="outline"
        onClick={() => {}}
      >
        <FontAwesomeIcon icon={faMaximize as IconProp} size="lg" />
      </CButton>

      <CButton
        color="primary"
        disabled={isDisabled}
        variant="outline"
        onClick={() => {}}
      >
        <FontAwesomeIcon icon={faCog as IconProp} size="lg" />
      </CButton>

      <CButton
        color="primary"
        disabled={isDisabled}
        variant="outline"
        onClick={() => setIsInstructionsModalVisible(true)}
      >
        <FontAwesomeIcon icon={faQuestion as IconProp} size="lg" />
      </CButton>

      <InstructionsModal
        isOpen={isInstructionsModalVisible}
        setIsOpen={setIsInstructionsModalVisible}
      />
    </CButtonGroup>
  );
};

export default AccessibilityTools;
