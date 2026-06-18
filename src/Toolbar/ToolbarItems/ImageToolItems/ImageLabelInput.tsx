import { useState } from 'react'
import React from 'react'
import {
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CFormInput,
  CDropdownDivider,
  CDropdownToggle,
  CTooltip,
} from '@coreui/react'
import { Label } from '../../../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { IconProps } from 'semantic-ui-react'
import TagLabel from './TagLabel'

type ImageLabelInputProps = {
  isDisabled: boolean
  isVisible: boolean
  isFullscreen?: boolean
  selectedLabelsIds: number[] | undefined
  possibleLabels: Label[]
  isMultilabel?: boolean
  onLabelSelect: (selectedLabelIds: number[]) => void
}

const ImageLabelInput = ({
  isDisabled,
  isVisible,
  isFullscreen = false,
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
      newLabelIds = [...(selectedLabelsIds ?? [])]
      // check if item in list (get its index if so)
      const foundIndex: number = (selectedLabelsIds ?? []).indexOf(clickedLabel.id)
      // add label if not in list, remove label if in list
      if (foundIndex === -1) {
        newLabelIds.push(clickedLabel.id)
      } else {
        newLabelIds.splice(foundIndex, 1)
      }
    }
    // single-label: just replace list with clicked item
    else newLabelIds = [clickedLabel.id]

    onLabelSelect(newLabelIds)
  }

  const getSelectedLabels = () => {
    const selectedLabels: Label[] = possibleLabels.filter((label: Label) =>
      selectedLabelsIds?.includes(label.id),
    )

    return selectedLabels
  }

  const renderLabels = () => {
    if (!selectedLabelsIds || selectedLabelsIds.length === 0)
      return (
        <div>
          <FontAwesomeIcon icon={faTag as IconProps} />
        </div>
      )

    const selectedLabels = getSelectedLabels()
    return (
      <div
        style={
          {
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            maxWidth: isFullscreen ? '500px' : '300px',
            alignItems: 'center',
            gap: '10px',
            scrollbarWidth: 'thin',
          } as React.CSSProperties
        }
        className="tag-scroll"
      >
        {selectedLabels.map((label: Label) => (
          <TagLabel
            key={label.name}
            name={label.name}
            color={label.color}
            size={25}
            triangleSize={17}
            style={{ flexShrink: 0 }}
            onRemove={() => updateSelectedLabels(label)}
          />
        ))}
      </div>
    )
  }

  return (
    <CTooltip content="Add Image Label">
      <CDropdown
        visible={isVisible}
        autoClose="outside"
      >
        {/* this invisible toggle has to be here, othervise the menu is not showing as intended */}
        <CDropdownToggle
          variant="outline"
          caret={false}
          color={isDisabled ? 'secondary' : 'primary'}
          // style={{ paddingTop: 0, paddingBottom: 0 }}
          as="div"
        >
          {renderLabels()}
        </CDropdownToggle>
        <CDropdownMenu as="div" style={{ padding: 0 }}>
          <div className="px-3 py-2">
            <CFormInput
              placeholder="Filter label..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              autoFocus
            />
          </div>
          <CDropdownDivider />
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredLabels.length > 0 ? (
              filteredLabels.map((label: Label) => {
                const isSelected = selectedLabelsIds?.includes(label.id)

                return (
                  <CDropdownItem
                    key={label.id}
                    onClick={() => updateSelectedLabels(label)}
                    active={isSelected}
                  >
                    {label.name}
                  </CDropdownItem>
                )
              })
            ) : (
              <CDropdownItem disabled>No results</CDropdownItem>
            )}
          </div>
        </CDropdownMenu>
      </CDropdown>
    </CTooltip>
  )
}

export default ImageLabelInput
