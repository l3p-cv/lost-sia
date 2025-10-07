import { useState } from "react";
import {
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CFormInput,
  CDropdownDivider,
  CDropdownToggle,
} from "@coreui/react";
import Label from "../models/Label";

type LabelInputProps = {
  isVisible: boolean;
  selectedLabelsIds: number[];
  possibleLabels: Label[];
  isMultilabel?: boolean;
  onLabelSelect: (selectedLabelIds: number[]) => void;
};

const LabelInput = ({
  isVisible,
  selectedLabelsIds,
  possibleLabels,
  isMultilabel = false,
  onLabelSelect,
}: LabelInputProps) => {
  const [filter, setFilter] = useState("");

  const filteredLabels: Label[] = possibleLabels.filter((label: Label) =>
    label.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const updateSelectedLabels = (clickedLabel: Label) => {
    let newLabelIds: number[] = [];

    if (isMultilabel) {
      newLabelIds = [...selectedLabelsIds];
      // check if item in list (get its index if so)
      const foundIndex: number = selectedLabelsIds.indexOf(clickedLabel.id);
      // add label if not in list, remove label if in list
      if (foundIndex !== -1) newLabelIds.splice(foundIndex, 1);
      else newLabelIds.push(clickedLabel.id);
    }
    // single-label: just replace list with clicked item
    else newLabelIds = [clickedLabel.id];

    onLabelSelect(newLabelIds);
  };

  return (
    <CDropdown visible={isVisible} autoClose={false}>
      {/* this invisible toggle has to be here, othervise the menu is not showing as intended */}
      <CDropdownToggle style={{ display: "none" }} />
      <CDropdownMenu>
        <div className="px-3 py-2">
          <CFormInput
            placeholder="Filter label..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
        </div>
        <CDropdownDivider />
        {filteredLabels.length > 0 ? (
          filteredLabels.map((label: Label) => (
            <CDropdownItem
              key={label.id}
              onClick={() => updateSelectedLabels(label)}
            >
              {label.name}
            </CDropdownItem>
          ))
        ) : (
          <CDropdownItem disabled>No results</CDropdownItem>
        )}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default LabelInput;
