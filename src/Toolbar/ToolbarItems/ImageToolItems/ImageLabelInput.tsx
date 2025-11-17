import { useState } from 'react'
import {
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CFormInput,
  CDropdownDivider,
  CDropdownToggle,
} from '@coreui/react'
import { Label } from '../../../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { IconProps } from 'semantic-ui-react'
import TagLabel from './TagLabel'

type ImageLabelInputProps = {
  defaultLabelId?: number
  isDisabled: boolean
  isVisible: boolean
  selectedLabelsIds: number[]
  possibleLabels: Label[]
  isMultilabel?: boolean
  onLabelSelect: (selectedLabelIds: number[]) => void
}

const ImageLabelInput = ({
  isDisabled,
  isVisible,
  selectedLabelsIds,
  possibleLabels,
  isMultilabel = false,
  onLabelSelect,
}: ImageLabelInputProps) => {
  const [filter, setFilter] = useState('')

  const filteredLabels: Label[] = possibleLabels.filter((label: Label) =>
    label.name.toLowerCase().includes(filter.toLowerCase()),
  )

  const updateSelectedLabels = (clickedLabel: Label) => {
    let newLabelIds: number[] = []

    if (isMultilabel) {
      newLabelIds = [...selectedLabelsIds]
      // check if item in list (get its index if so)
      const foundIndex: number = selectedLabelsIds.indexOf(clickedLabel.id)
      // add label if not in list, remove label if in list
      if (foundIndex !== -1) newLabelIds.splice(foundIndex, 1)
      else newLabelIds.push(clickedLabel.id)
    }
    // single-label: just replace list with clicked item
    else newLabelIds = [clickedLabel.id]

    onLabelSelect(newLabelIds)
  }

  const getSelectedLabels = () => {
    const selectedLabels: Label[] = possibleLabels.filter((label: Label) =>
      selectedLabelsIds.includes(label.id),
    )

    return selectedLabels
  }

  const renderLabels = () => {
    if (selectedLabelsIds.length === 0)
      return (
        <div style={{ marginTop: 6 }}>
          <FontAwesomeIcon icon={faTag as IconProps} size="lg" />
        </div>
      )

    const selectedLabels = getSelectedLabels()
    return selectedLabels.map((label: Label) => (
      <TagLabel
        key={label.name}
        name={label.name}
        color={label.color}
        size={25}
        triangleSize={17}
        style={{ marginLeft: 1, marginTop: 5 }}
      />
    ))
  }

  return (
    <CDropdown visible={isVisible} autoClose={false}>
      {/* this invisible toggle has to be here, othervise the menu is not showing as intended */}
      <CDropdownToggle
        variant="outline"
        caret={false}
        color={isDisabled ? 'secondary' : 'primary'}
        style={{ paddingTop: 0, paddingBottom: 0 }}
        as="div"
      >
        {renderLabels()}
      </CDropdownToggle>
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
            <CDropdownItem key={label.id} onClick={() => updateSelectedLabels(label)}>
              {label.name}
            </CDropdownItem>
          ))
        ) : (
          <CDropdownItem disabled>No results</CDropdownItem>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default ImageLabelInput
