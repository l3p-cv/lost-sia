import { faSync, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CButton, CTooltip } from '@coreui/react'
import { CSSProperties } from 'react'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

type IconButtonProps = {
  loadingSize?: SizeProp
  isLoading?: boolean
  margin?: number
  icon?: IconDefinition
  text?: string
  size?: 'sm' | 'lg'
  isTextLeft?: boolean
  style?: CSSProperties
  id?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  className?: string
  color?: string
  isOutline?: boolean
  tooltip?: string
  ttipPlacement?: 'top' | 'left' | 'right' | 'auto' | 'bottom'
  shape?: string
}

const IconButton = ({
  loadingSize = '1x',
  isLoading = false,
  margin = 5,
  icon,
  text = '',
  size,
  isTextLeft = false,
  style = {},
  id = undefined,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  color = 'primary',
  isOutline = true,
  tooltip = '',
  ttipPlacement = 'top',
  shape = '',
}: IconButtonProps) => {
  const iconButtonIcon: IconDefinition | undefined = icon

  const buttonVariant: 'ghost' | 'outline' | undefined = isOutline ? 'outline' : undefined

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center">
          <FontAwesomeIcon
            className="mr-3"
            size={loadingSize || '2x'}
            icon={faSync}
            spin
          />
          <span className="text-center">Loading</span>
        </div>
      )
    }
    const ic =
      iconButtonIcon?.iconName && iconButtonIcon.prefix ? (
        <FontAwesomeIcon key="icon" icon={iconButtonIcon} size={loadingSize || '2x'} />
      ) : null
    const iconButtonText = text ? (
      <span key="text" style={{ marginLeft: margin, marginRight: margin }}>
        {text}
      </span>
    ) : null
    if (isTextLeft) {
      return [iconButtonText, ic]
    }
    return [ic, iconButtonText]
  }

  // because visible=false does not seem to work...
  if (tooltip != '') {
    return (
      <CTooltip content={tooltip} placement={ttipPlacement}>
        <CButton
          id={id}
          size={size}
          // type={type}
          className={className}
          style={style}
          variant={buttonVariant}
          disabled={disabled || isLoading}
          onClick={onClick}
          color={disabled || isLoading ? 'secondary' : color}
          shape={shape}
        >
          {renderContent()}
        </CButton>
      </CTooltip>
    )
  }

  return (
    <CButton
      size={size}
      type={type}
      className={className}
      style={style}
      variant={buttonVariant}
      disabled={disabled || isLoading}
      onClick={onClick}
      color={disabled || isLoading ? 'secondary' : color}
    >
      {renderContent()}
    </CButton>
  )
}

export default IconButton
