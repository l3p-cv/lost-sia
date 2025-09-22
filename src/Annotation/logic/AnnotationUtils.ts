import { Point } from "../../types";
import Annotation from "./Annotation";

const addNode = (annotation: Annotation, point: Point) => {
  const _annotation = { ...annotation };
  _annotation.coordinates.push(point);
  return _annotation;
};

const startAnnotimeMeasure = (annotation: Annotation) => {
  const _annotation = { ...annotation };
  _annotation.timestamp = performance.now();
  return _annotation;
};

const stopAnnotimeMeasure = (annotation: Annotation): [Annotation, number] => {
  const _annotation = { ...annotation };
  const now = performance.now();
  const duration = (now - _annotation.timestamp) / 1000;
  _annotation.annoTime += duration;
  _annotation.timestamp = now;

  return [_annotation, duration];
};

export default {
  addNode,
  startAnnotimeMeasure,
  stopAnnotimeMeasure,
};
