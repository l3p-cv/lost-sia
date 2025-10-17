import { CCol, CContainer, CRow } from "@coreui/react";
import TagLabel from "./TagLabel";
import LabelInput from "../../../Canvas/LabelInput";
import { Label } from "../../../types";

type ImageLabelProps = {
  possibleLabels: Label[];
  selectedLabelIds?: number[];
  onImageLabelsChanged?: (selectedImageIds: number[]) => void;
};

const ImageLabel = ({
  possibleLabels,
  selectedLabelIds = [],
  onImageLabelsChanged = () => {},
}: ImageLabelProps) => {
  const getSelectedLabels = () => {
    const selectedLabels: Label[] = possibleLabels.filter((label: Label) =>
      selectedLabelIds.includes(label.id),
    );

    return selectedLabels;
  };

  const renderLabels = () => {
    const selectedLabels = getSelectedLabels();
    return selectedLabels.map((label: Label) => (
      <CCol key={label.name}>
        <TagLabel name={label.name} color={label.color} />
      </CCol>
    ));
  };

  return (
    <CContainer>
      <CRow>
        <CCol>
          <CRow>
            <b>Selected Labels:</b>
          </CRow>
          <CRow xs={{ gutterY: 1 }}>{renderLabels()}</CRow>
        </CCol>
        <CCol>
          <CRow>
            <b>Change selection:</b>
          </CRow>
          <CRow style={{ minWidth: 250, minHeight: 100 }}>
            <LabelInput
              isVisible={true}
              isMultilabel={true}
              selectedLabelsIds={selectedLabelIds}
              possibleLabels={possibleLabels}
              onLabelSelect={onImageLabelsChanged}
            />
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ImageLabel;
