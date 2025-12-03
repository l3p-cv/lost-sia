import { AnnotationStatus, AnnotationTool } from '../../models'
import { ExternalAnnotation } from '../../types'

const point: ExternalAnnotation[] = [
  {
    coordinates: [{ x: 0.1, y: 0.1 }],
    labelIds: [5],
    type: AnnotationTool.Point,
    status: AnnotationStatus.LOADED,
  },
  {
    coordinates: [{ x: 0.2, y: 0.2 }],
    labelIds: [8],
    type: AnnotationTool.Point,
    status: AnnotationStatus.LOADED,
  },
  {
    coordinates: [{ x: 0.3, y: 0.3 }],
    labelIds: [9],
    type: AnnotationTool.Point,
    status: AnnotationStatus.LOADED,
  },
  {
    coordinates: [{ x: 0.2, y: 0.4 }],
    labelIds: [10],
    type: AnnotationTool.Point,
    status: AnnotationStatus.LOADED,
  },
  {
    coordinates: [{ x: 0.7, y: 0.8 }],
    labelIds: [8, 11],
    type: AnnotationTool.Point,
    status: AnnotationStatus.LOADED,
  },
]

const line: ExternalAnnotation[] = [
  {
    coordinates: [
      { x: 50, y: 50 },
      { x: 200, y: 100 },
      { x: 250, y: 100 },
      { x: 250, y: 200 },
    ],
    labelIds: [5],
    type: AnnotationTool.Line,
    status: AnnotationStatus.LOADED,
  },
  {
    coordinates: [
      { x: 259.883, y: 300.424 },
      { x: 350, y: 331.5263919270834 },
      { x: 355, y: 320 },
      { x: 370, y: 300 },
      { x: 270, y: 250 },
    ],
    labelIds: [8, 11],
    type: AnnotationTool.Line,
    status: AnnotationStatus.LOADED,
  },
]

const bbox: ExternalAnnotation[] = [
  {
    coordinates: [
      { x: 50, y: 50 },
      { x: 200, y: 200 },
    ],
    labelIds: [5],
    type: AnnotationTool.BBox,
    status: AnnotationStatus.LOADED,
  },
  {
    coordinates: [
      { x: 250, y: 100 },
      { x: 450, y: 150 },
    ],
    labelIds: [8, 11],
    type: AnnotationTool.BBox,
    status: AnnotationStatus.LOADED,
  },
]

const polygon: ExternalAnnotation[] = [
  {
    coordinates: [
      { x: 50, y: 50 },
      { x: 200, y: 100 },
      { x: 250, y: 100 },
      { x: 250, y: 200 },
    ],
    labelIds: [5],
    status: AnnotationStatus.LOADED,
    type: AnnotationTool.Polygon,
  },
  {
    coordinates: [
      { x: 259.883, y: 300.424 },
      { x: 350, y: 331.5263919270834 },
      { x: 355, y: 320 },
      { x: 370, y: 300 },
      { x: 270, y: 250 },
    ],
    labelIds: [8, 11],
    status: AnnotationStatus.LOADED,
    type: AnnotationTool.Polygon,
  },
]

export default {
  bbox,
  line,
  point,
  polygon,
}
