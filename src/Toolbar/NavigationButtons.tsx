import { CButton, CButtonGroup } from "@coreui/react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type NavigationButtonProps = {};

const NavigationButtons = ({}: NavigationButtonProps) => {
  return (
    <CButtonGroup>
      <CButton color="primary" variant="outline" onClick={() => {}}>
        <FontAwesomeIcon icon={faArrowLeft as IconProp} size="lg" />
      </CButton>
      <CButton color="primary" variant="outline" onClick={() => {}}>
        <FontAwesomeIcon icon={faArrowRight as IconProp} size="lg" />
      </CButton>
    </CButtonGroup>
  );
};

export default NavigationButtons;
