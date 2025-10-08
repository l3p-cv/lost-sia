import KeyAction from "../models/KeyAction";

class KeyMapper {
  isControlDown: boolean;
  keyActionHandler: ((keyAction) => void) | undefined;

  constructor(keyActionHandler: ((keyAction) => void) | undefined = undefined) {
    this.isControlDown = false;
    this.keyActionHandler = keyActionHandler;
  }

  keyDown(key: string, isShiftKeyPressed: boolean = false) {
    switch (key) {
      case "Enter":
        this.triggerKeyAction(KeyAction.EDIT_LABEL);
        break;
      case "Delete":
        this.triggerKeyAction(KeyAction.DELETE_ANNO);
        break;
      case "Backspace":
        this.triggerKeyAction(KeyAction.DELETE_ANNO);
        break;

      // @TODO still needed?
      case "Control":
        this.isControlDown = true;
        this.triggerKeyAction(KeyAction.ENTER_ANNO_ADD_MODE);
        break;
      case "z":
        if (this.isControlDown) {
          this.triggerKeyAction(KeyAction.UNDO);
        }
        break;
      case "y":
        if (this.isControlDown) {
          this.triggerKeyAction(KeyAction.REDO);
        }
        break;
      case "Tab":
        if (isShiftKeyPressed)
          this.triggerKeyAction(KeyAction.TRAVERSE_ANNOS_BACKWARDS);
        else this.triggerKeyAction(KeyAction.TRAVERSE_ANNOS);
        break;
      case "w":
        this.triggerKeyAction(KeyAction.CAM_MOVE_UP);
        break;
      case "s":
        this.triggerKeyAction(KeyAction.CAM_MOVE_DOWN);
        break;
      case "a":
        this.triggerKeyAction(KeyAction.CAM_MOVE_LEFT);
        break;
      case "d":
        this.triggerKeyAction(KeyAction.CAM_MOVE_RIGHT);
        break;
      case "e":
        this.triggerKeyAction(KeyAction.RECREATE_ANNO);
        break;
      case "c":
        if (this.isControlDown) {
          this.triggerKeyAction(KeyAction.COPY_ANNOTATION);
        } else {
          this.triggerKeyAction(KeyAction.TOGGLE_ANNO_COMMENT_INPUT);
        }
        break;
      case "v":
        if (this.isControlDown) {
          this.triggerKeyAction(KeyAction.PASTE_ANNOTATION);
        }
        break;
      case "Escape":
        this.triggerKeyAction(KeyAction.DELETE_ANNO_IN_CREATION);
        break;
      default:
        break;
    }
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
      this.keyActionHandler(keyAction);
    }
  }
}

export default KeyMapper;
