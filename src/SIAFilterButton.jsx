import React, { Component } from "react";
// import * as filterTools from "./filterTools";
import * as tbe from "./types/toolbarEvents";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { CFormSwitch, CPopover } from "@coreui/react";
import ToolbarItem from "./ToolbarItem";
class SIAFilterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clipLimit: 3,
      active: false,
      color: undefined,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.filter.clahe.clipLimit !== this.props.filter.clahe.clipLimit
    ) {
      this.setState({ clipLimit: this.props.filter.clahe.clipLimit });
    }
    if (this.props.filter !== prevProps.filter) {
      if (filterTools.active(this.props.filter)) {
        this.setState({ color: "red", active: true });
      } else {
        this.setState({ color: "white", active: false });
      }
    }
  }

  triggerEvent(e, data) {
    if (this.props.onFilterEvent) {
      this.props.onFilterEvent(e, data);
    }
  }

  handleClipLimitChange(e) {
    const cl = parseInt(e.target.value);
    this.setState({ clipLimit: cl });
    // this.claheFilter(cl)
  }

  rotateImg(angle) {
    const active = !(
      this.props.filter.rotate.active &&
      this.props.filter.rotate.angle === angle
    );
    const myAngle = active ? angle : 0;
    this.triggerEvent(tbe.APPLY_FILTER, {
      ...this.props.filter,
      rotate: { angle: myAngle, active: active },
    });

    // this.props.siaApplyFilter({
    //     ...this.props.filter,
    //     rotate: {angle:myAngle, active:active}
    // })
  }

  claheFilter(clipLimit) {
    const filter = {
      clahe: {
        clipLimit: clipLimit,
        active: !this.props.filter.clahe.active,
      },
    };
    this.triggerEvent(tbe.APPLY_FILTER, {
      ...this.props.filter,
      clahe: filter.clahe,
    });
    // this.props.siaApplyFilter({
    //     ...this.props.filter,
    //     clahe: filter.clahe
    // })
  }

  releaseCLAHESlider(e) {
    const filter = {
      clahe: {
        clipLimit: parseInt(e.target.value),
        active: true,
      },
    };
    this.triggerEvent(tbe.APPLY_FILTER, {
      ...this.props.filter,
      clahe: filter.clahe,
    });
    // this.props.siaApplyFilter({
    //     ...this.props.filter,
    //     clahe: filter.clahe
    // })
  }

  renderRotateContent() {
    const filter = this.props.filter;
    return (
      <div>
        <h4>Rotate</h4>
        <CFormSwitch
          checked={filter.rotate.active && filter.rotate.angle === 90}
          label="Rotate 90"
          size="xl"
          onClick={() => this.rotateImg(90)}
        />
        <CFormSwitch
          checked={filter.rotate.active && filter.rotate.angle === -90}
          label="Rotate -90"
          size="xl"
          onClick={() => this.rotateImg(-90)}
        />
        <CFormSwitch
          checked={filter.rotate.active && filter.rotate.angle === 180}
          label="Rotate 180"
          size="xl"
          onClick={() => this.rotateImg(180)}
        />
      </div>
    );
  }

  renderRotate() {
    if (!this.props.enabled) return null;
    if (this.props.enabled === true) {
      return this.renderRotateContent();
    } else {
      if (this.props.enabled.rotate) {
        return this.renderRotateContent();
      }
    }
  }

  renderClaheContent() {
    const filter = this.props.filter;
    return (
      <div>
        <h4>Histogram equalization</h4>
        <CFormSwitch
          checked={filter.clahe.active}
          label="Histogram equalization"
          size="xl"
          onClick={() => this.claheFilter(this.state.clipLimit)}
        />
        <div>Cliplimit: {this.state.clipLimit}</div>
        <input
          type="range"
          min={0}
          max={40}
          value={this.state.clipLimit}
          onChange={(e) => this.handleClipLimitChange(e)}
          onMouseUp={(e) => this.releaseCLAHESlider(e)}
        />
      </div>
    );
  }

  renderClahe() {
    if (!this.props.enabled) return null;
    if (this.props.enabled === true) {
      return this.renderClaheContent();
    } else {
      if (this.props.enabled.clahe) {
        return this.renderClaheContent();
      }
    }
  }

  render() {
    if (!this.props.imageMeta) return null;
    const popupContent = (
      <div>
        {this.renderRotate()}
        {this.renderClahe()}
      </div>
    );
    return (
      <CPopover content={popupContent} placement="right">
        <span>
          <ToolbarItem faIcon={faFilter} />
        </span>
      </CPopover>
    );
  }
}

export default SIAFilterButton;
