import { CButton, CButtonGroup } from "@coreui/react";
import {
  faCog,
  faFilter,
  faMaximize,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const AccessibilityTools = () => {
  return (
    <CButtonGroup role="group" aria-label="Basic example">
      <CButton color="primary" variant="outline" onClick={() => {}}>
        <FontAwesomeIcon icon={faFilter as IconProp} size="lg" />
      </CButton>

      <CButton color="primary" variant="outline" onClick={() => {}}>
        <FontAwesomeIcon icon={faMaximize as IconProp} size="lg" />
      </CButton>

      <CButton color="primary" variant="outline" onClick={() => {}}>
        <FontAwesomeIcon icon={faCog as IconProp} size="lg" />
      </CButton>

      <CButton color="primary" variant="outline" onClick={() => {}}>
        <FontAwesomeIcon icon={faQuestion as IconProp} size="lg" />
      </CButton>
    </CButtonGroup>
  );
};

export default AccessibilityTools;
