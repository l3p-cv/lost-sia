import { CSSProperties, useEffect, useRef, useState } from "react";
import Label from "../../../models/Label";
import { Point } from "../../../types";
import transform from "../../../utils/transform2";
import DaviIcon from "./DaviIcon";

const DEFAULT_FONT_SIZE = 10;
const DEFAULT_RECT_HEIGHT = 15;
const TEXT_PADDING = 3;

type AnnoBarProps = {
  annotationCoordinates: Point[];
  canLabel: boolean;
  color: string;
  labels: Label[];
  selectedLabelIds: number[];
  isSelected: boolean;
  svgScale: number;
  style: CSSProperties;
  onLabelIconClicked: (markerPosition: Point) => void;
};
const AnnoBar = ({
  annotationCoordinates,
  canLabel,
  color,
  labels,
  selectedLabelIds = [],
  isSelected,
  svgScale,
  style,
  onLabelIconClicked,
}: AnnoBarProps) => {
  const [barPosition, setBarPosition] = useState<Point>({ x: 0, y: 0 });
  const [barWidth, setBarWidth] = useState<number>(0);
  const [barHeight, setBarHeight] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(0);
  const [labelText, setLabelText] = useState<string>("");

  const textRef = useRef(null);

  useEffect(() => {
    setLabelText(getLabelText());
  }, [selectedLabelIds]);

  useEffect(() => {
    // get the most top left point from the annotation
    const topPoints: Point[] = transform.getTopPoint(annotationCoordinates);
    const topLeftPoint: Point = transform.getMostLeftPoints(topPoints)[0];

    const newBarPosition: Point = {
      x: topLeftPoint.x + 7 / svgScale,
      y: topLeftPoint.y - 10 / svgScale,
    };

    setBarPosition(newBarPosition);

    // calculate scaled font size
    const newFontSize = Math.ceil(DEFAULT_FONT_SIZE / svgScale);
    setFontSize(newFontSize);

    setBarHeight(DEFAULT_RECT_HEIGHT / svgScale);
  }, [svgScale]);

  useEffect(() => {
    if (textRef === undefined) return;

    // calculate size of box around label text
    const textElement: DOMRect = textRef.current.getBoundingClientRect();
    const textWidth: number = textElement.width;
    const rectWidth = (textWidth + TEXT_PADDING) / svgScale;

    setBarWidth(rectWidth);
  }, [textRef, labelText, fontSize]);

  const getLabelText = () => {
    const selectedLabels: Label[] = labels.filter((label: Label) =>
      selectedLabelIds.includes(label.id),
    );

    const labelText = selectedLabels.map((l) => l.name).join(", ");

    return labelText.length ? labelText : "no label";
  };

  return (
    <g>
      {isSelected && canLabel && (
        <DaviIcon
          x={barPosition.x - 33 / svgScale}
          y={barPosition.y - 30 / svgScale}
          color={color}
          size={60 / svgScale}
          onClick={() => onLabelIconClicked(barPosition)}
        />
      )}

      <rect
        x={barPosition.x}
        y={barPosition.y - 6 / (svgScale * 1.2)}
        width={barWidth}
        height={barHeight}
        rx={5 / svgScale}
        opacity="0.5"
        style={style}
      />
      <text
        x={barPosition.x + 1 / svgScale}
        y={barPosition.y + 6 / svgScale}
        fill="white"
        textAnchor="start"
        alignmentBaseline="central"
        ref={textRef}
        fontSize={`${fontSize}pt`}
      >
        {labelText}
      </text>
      {/* This second rect is to prevent text from getting marked */}
      <rect
        x={barPosition.x}
        y={barPosition.y - 6 / (svgScale * 1.2)}
        width={barWidth}
        height={DEFAULT_RECT_HEIGHT}
        rx={5 / svgScale}
        opacity="0.01"
        style={style}
        onContextMenu={(e) => e.preventDefault()}
      />
    </g>
  );
};

export default AnnoBar;
