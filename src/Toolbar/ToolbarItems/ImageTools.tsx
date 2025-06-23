import { CButton, CButtonGroup } from "@coreui/react";
import { faBan, faTag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type ImageToolsProps = {
  canJunk: boolean;
};

const ImageTools = ({ canJunk }: ImageToolsProps) => {
  return (
    <CButtonGroup role="group" aria-label="Basic example">
      <CButton color="primary" variant="outline" onClick={() => {}}>
        <FontAwesomeIcon icon={faTag as IconProp} size="lg" />
      </CButton>

      {canJunk && (
        <CButton color="primary" variant="outline" onClick={() => {}}>
          <FontAwesomeIcon icon={faBan as IconProp} size="lg" />
        </CButton>
      )}

      <CButton color="primary" variant="outline" onClick={() => {}}>
        <FontAwesomeIcon icon={faTrash as IconProp} size="lg" />
      </CButton>
    </CButtonGroup>
  );
};

export default ImageTools;
