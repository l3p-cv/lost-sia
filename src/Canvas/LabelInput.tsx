import { useState } from "react";
import {
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CFormInput,
} from "@coreui/react";
import Label from "../models/Label";

type LabelInputProps = {
  possibleLabels: Label[];
  onLabelSelect: (Label) => void;
};

const LabelInput = ({ possibleLabels, onLabelSelect }: LabelInputProps) => {
  const [filter, setFilter] = useState("");
  // const [visible, setVisible] = useState(false);
  // const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filteredLabels: Label[] = possibleLabels.filter((label: Label) =>
    label.name.toLowerCase().includes(filter.toLowerCase()),
  );

  // const handleSelect = (label: Label) => {
  //   // setSelectedItem(item);
  //   // setVisible(false);
  //   // setFilter(""); // Zurücksetzen nach Auswahl
  // };

  return (
    <CDropdown visible={true}>
      <CDropdownMenu style={{ minWidth: "250px" }}>
        <div className="px-3 py-2">
          <CFormInput
            placeholder="Filter label..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
        </div>
        {filteredLabels.length > 0 ? (
          filteredLabels.map((label: Label) => (
            <CDropdownItem key={label.id} onClick={() => onLabelSelect(label)}>
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
