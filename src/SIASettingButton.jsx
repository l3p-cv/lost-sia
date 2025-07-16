import React, { Component } from "react";

import * as tbe from "./types/toolbarEvents";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { CFormSwitch, CPopover } from "@coreui/react";
import ToolbarItem from "./ToolbarItem";
class SIASettingButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  triggerEvent(e, data) {
    if (this.props.onSettingEvent) {
      this.props.onSettingEvent(e, data);
    }
  }
  toggleAnnoDetails() {
    this.triggerEvent(tbe.SHOW_ANNO_DETAILS);
  }

  toggleLabelInfo() {
    this.triggerEvent(tbe.SHOW_LABEL_INFO);
  }

  toggleAnnoStats() {
    this.triggerEvent(tbe.SHOW_ANNO_STATS);
  }

  handleStrokeWidthChange(e) {
    this.triggerEvent(tbe.EDIT_STROKE_WIDTH, parseInt(e.target.value));
  }

  handleNodeRadiusChange(e) {
    this.triggerEvent(tbe.EDIT_NODE_RADIUS, parseInt(e.target.value));
  }

  renderInfoBoxContent() {
    return (
      <div>
        <h4>Info Boxes</h4>
        <CFormSwitch
          checked={this.props.uiConfig.annoDetails.visible}
          label="Annotation Details"
          size="xl"
          onClick={() => this.toggleAnnoDetails()}
        />
        <CFormSwitch
          checked={this.props.uiConfig.labelInfo.visible}
          label="Label Info"
          size="xl"
          onClick={() => this.toggleLabelInfo()}
        />
        <CFormSwitch
          checked={this.props.uiConfig.annoStats.visible}
          label="Anno Stats"
          size="xl"
          onClick={() => this.toggleAnnoStats()}
        />
      </div>
    );
  }
  renderInfoBoxes() {
    if (!this.props.enabled) return null;
    if (this.props.enabled === true) {
      return this.renderInfoBoxContent();
    } else {
      if (this.props.enabled.infoBoxes) {
        return this.renderInfoBoxContent();
      }
    }
  }

  renderAnnoStyle() {
    if (!this.props.enabled) return null;
    if (this.props.enabled === true) {
      return this.renderAnnoStyleContent();
    } else {
      if (this.props.enabled.annoStyle) {
        return this.renderAnnoStyleContent();
      }
    }
  }
  renderAnnoStyleContent() {
    return (
      <div>
        <h4 style={{ marginTop: 25 }}>Anno Appearance</h4>
        <div>Stroke width: {this.props.uiConfig.strokeWidth}</div>
        <input
          type="range"
          min={1}
          max={10}
          value={this.props.uiConfig.strokeWidth}
          onChange={(e) => this.handleStrokeWidthChange(e)}
        />
        <div>Node radius: {this.props.uiConfig.nodeRadius}</div>
        <input
          type="range"
          min={1}
          max={10}
          value={this.props.uiConfig.nodeRadius}
          onChange={(e) => this.handleNodeRadiusChange(e)}
        />
      </div>
    );
  }

  render() {
    if (!this.props.uiConfig) return null;
    const popupContent = (
      <div>
        {this.renderInfoBoxes()}
        {this.renderAnnoStyle()}
      </div>
    );
    return (
      <CPopover content={popupContent} placement="right">
        <span>
          <ToolbarItem faIcon={faCog} />
        </span>
      </CPopover>
    );
  }
}

export default SIASettingButton;
