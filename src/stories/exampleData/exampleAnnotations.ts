import { Annotation, AnnotationTool } from '../../models'

const point: Annotation[] = [
  new Annotation(0, AnnotationTool.Point, [{ x: 0.1, y: 0.1 }]),
  new Annotation(1, AnnotationTool.Point, [{ x: 0.2, y: 0.2 }]),
  new Annotation(2, AnnotationTool.Point, [{ x: 0.3, y: 0.3 }]),
  new Annotation(3, AnnotationTool.Point, [{ x: 0.4, y: 0.4 }]),
  new Annotation(4, AnnotationTool.Point, [{ x: 0.5, y: 0.5 }]),
  new Annotation(5, AnnotationTool.Point, [{ x: 0.6, y: 0.6 }]),
  new Annotation(6, AnnotationTool.Point, [{ x: 0.7, y: 0.7 }]),
  new Annotation(7, AnnotationTool.Point, [{ x: 0.8, y: 0.8 }]),
]

const line: Annotation[] = [
  new Annotation(0, AnnotationTool.Line, [
    { x: 0.1, y: 0.1 },
    { x: 0.2, y: 0.2 },
  ]),
  new Annotation(1, AnnotationTool.Line, [
    { x: 0.1, y: 0.1 },
    { x: 0.4, y: 0.2 },
    { x: 0.6, y: 0.2 },
    { x: 0.7, y: 0.4 },
    { x: 0.2, y: 0.4 },
    { x: 0.2, y: 0.2 },
  ]),
]

const bbox: Annotation[] = [
  new Annotation(0, AnnotationTool.BBox, [
    { x: 0.2, y: 0.2 },
    { x: 0.5, y: 0.6 },
  ]),
  new Annotation(1, AnnotationTool.BBox, [
    { x: 0.6, y: 0.2 },
    { x: 0.8, y: 0.3 },
  ]),
  new Annotation(2, AnnotationTool.BBox, [
    { x: 0.7, y: 0.6 },
    { x: 0.9, y: 0.9 },
  ]),
]

const polygon: Annotation[] = [
  new Annotation(0, AnnotationTool.Polygon, [
    { x: 0.05, y: 0.05 },
    { x: 0.2, y: 0.1 },
    { x: 0.3, y: 0.1 },
    { x: 0.3, y: 0.2 },
  ]),
  new Annotation(1, AnnotationTool.Polygon, [
    { x: 0.5, y: 0.3 },
    { x: 0.5, y: 0.32 },
    { x: 0.55, y: 0.37 },
    { x: 0.6, y: 0.35 },
    { x: 0.55, y: 0.45 },
  ]),
]

export default {
  bbox,
  line,
  point,
  polygon,
}
