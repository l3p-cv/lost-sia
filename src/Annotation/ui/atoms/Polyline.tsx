import { CSSProperties, MouseEvent, useEffect, useState } from "react";
import Point from "../../../models/Point";

type PolylineProps = {
  coordinates: Point[];
  isSelected: boolean;
  svgScale: number;
  style: CSSProperties;
  onMoved: (coordinates: Point[]) => void;
  onIsDraggingStateChanged: (bool) => void;
};

const Polyline = ({
  coordinates,
  isSelected,
  svgScale,
  style,
  onMoved,
  onIsDraggingStateChanged,
}: PolylineProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    // apply mouse move to all coordinates
    const movedCoordinates: Point[] = coordinates.map((coordinate: Point) => {
      return {
        // counter the canvas scaling (it will be automatically applied when rendering the annotation coordinates)
        x: (coordinate.x += e.movementX / svgScale),
        y: (coordinate.y += e.movementY / svgScale),
      };
    });

    onMoved(movedCoordinates);
  };

  useEffect(() => {
    onIsDraggingStateChanged(isDragging);
    if (!isDragging) return;

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // only modify for rendering
  const _coordinates = [...coordinates];

  // add the first coordinate again as the last one
  _coordinates.push(_coordinates[0]);

  // draw line between nodes
  const svgLineCoords: string = _coordinates
    .map((point: Point) => `${point.x},${point.y}`)
    .join(" ");

  const renderInfiniteSelectionArea = () => {
    return (
      <circle
        cx={coordinates[0].x}
        cy={coordinates[0].y}
        r={"100%"}
        style={{ opacity: 0 }}
        onMouseMove={onMouseMove}
      />
    );
  };

  // adjust style for polyline
  const polyLineStyle = { ...style };
  polyLineStyle.cursor = "pointer";
  polyLineStyle.fillOpacity = isSelected ? 0 : 0.3;

  return (
    <>
      {isDragging && renderInfiniteSelectionArea()}
      <polyline
        points={svgLineCoords}
        style={polyLineStyle}
        onMouseDown={() => {
          setIsDragging(true);
        }}
        onMouseMove={onMouseMove}
      />
    </>
  );
};

export default Polyline;
