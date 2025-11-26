import KeyAction from '../models/KeyAction'

class KeyMapper {
  isControlDown: boolean = false
  keyActionHandler: ((keyAction) => void) | undefined

  constructor(keyActionHandler: ((keyAction) => void) | undefined = undefined) {
    this.keyActionHandler = keyActionHandler
  }

  keyDown(
    key: string,
    isShiftKeyPressed: boolean = false,
    isCtrlKeyPressed: boolean = false,
  ): boolean {
    switch (key) {
      case 'Enter':
        this.triggerKeyAction(KeyAction.EDIT_LABEL)
        break
      case 'Delete':
        this.triggerKeyAction(KeyAction.DELETE_ANNO)
        break
      case 'Backspace':
        this.triggerKeyAction(KeyAction.DELETE_ANNO)
        break
      case 'z':
        if (isCtrlKeyPressed) {
          this.triggerKeyAction(KeyAction.UNDO)
        }
        break
      case 'y':
        if (isCtrlKeyPressed) this.triggerKeyAction(KeyAction.REDO)
        break
      case 'Tab':
        if (isShiftKeyPressed) this.triggerKeyAction(KeyAction.TRAVERSE_ANNOS_BACKWARDS)
        else this.triggerKeyAction(KeyAction.TRAVERSE_ANNOS)
        break
      case 'w':
        this.triggerKeyAction(KeyAction.CAM_MOVE_UP)
        break
      case 's':
        this.triggerKeyAction(KeyAction.CAM_MOVE_DOWN)
        break
      case 'a':
        this.triggerKeyAction(KeyAction.CAM_MOVE_LEFT)
        break
      case 'd':
        this.triggerKeyAction(KeyAction.CAM_MOVE_RIGHT)
        break
      case 'e':
        this.triggerKeyAction(KeyAction.RECREATE_ANNO)
        break
      case 'j':
        this.triggerKeyAction(KeyAction.TOGGLE_IMAGE_JUNK)
        break
      case 'c':
        if (isCtrlKeyPressed) this.triggerKeyAction(KeyAction.COPY_ANNOTATION)
        else this.triggerKeyAction(KeyAction.TOGGLE_ANNO_COMMENT_INPUT)

        break
      case 'v':
        if (isCtrlKeyPressed) this.triggerKeyAction(KeyAction.PASTE_ANNOTATION)

        break
      case 'Escape':
        this.triggerKeyAction(KeyAction.DELETE_ANNO_IN_CREATION)
        break
      default:
        // no key found
        return false
    }

    // tell caller that we have found a key
    return true
  }

  // keyUp(key: string) {
  //   switch (key) {
  //     case "Control":
  //       this.isControlDown = false;
  //       this.triggerKeyAction(KeyAction.LEAVE_ANNO_ADD_MODE);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  triggerKeyAction(keyAction: KeyAction) {
    if (this.keyActionHandler) {
      this.keyActionHandler(keyAction)
    }
  }
}

export default KeyMapper
