import type { CSSProperties } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { IconProps } from 'semantic-ui-react'

type TagLabelProps = {
  name: string
  color?: string
  size?: number
  style?: CSSProperties
  triangleSize?: number
  onClick?: () => void
  onRemove?: () => void
}

const TagLabel = ({
  name,
  color = '#2185d0',
  size: bodySize = 32,
  style = {},
  triangleSize = 22,
  onClick,
  onRemove,
}: TagLabelProps) => {
  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: color,
    color: '#000',
    height: `${bodySize}px`,
    fontSize: `${bodySize * 0.45}px`,
    padding: `0 1rem 0 0.75rem`,
    border: 0,
    borderRadius: '0 0.25rem 0.25rem 0',
    marginLeft: `${triangleSize / 1.4}px`, // hypothenuse of the halfed square
    position: 'relative',
    overflow: 'visible', // allow triangle to stick out
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }

  // A rotated square to simulate a triangle
  const triangleStyle: CSSProperties = {
    position: 'absolute',
    left: `-${triangleSize / 2}px`,
    width: `${triangleSize}px`,
    height: `${triangleSize}px`,
    backgroundColor: color,
    transform: 'rotate(45deg)',
    zIndex: -1, // push behind text
    pointerEvents: 'none',
  }

  return (
    <button style={containerStyle} onClick={onClick}>
      <span style={triangleStyle} />
      {name}
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation()
              onRemove()
            }
          }}
          style={{
            marginLeft: '6px',
            cursor: 'pointer',
            opacity: 0.6,
            fontSize: `${bodySize * 0.4}px`,
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center',
          }}
          aria-label="Remove tag"
        >
          <FontAwesomeIcon icon={faXmark as IconProps} />
        </span>
      )}
    </button>
  )
}

export default TagLabel
