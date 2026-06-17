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
      { x: 0.05, y: 0.05 },
      { x: 0.2, y: 0.1 },
      { x: 0.25, y: 0.1 },
      { x: 0.25, y: 0.2 },
    ],
    labelIds: [5],
    type: AnnotationTool.Line,
    status: AnnotationStatus.LOADED,
  },
  {
    coordinates: [
      { x: 0.26, y: 0.3 },
      { x: 0.35, y: 0.33 },
      { x: 0.36, y: 0.32 },
      { x: 0.37, y: 0.3 },
      { x: 0.27, y: 0.25 },
    ],
    labelIds: [8, 11],
    type: AnnotationTool.Line,
    status: AnnotationStatus.LOADED,
  },
]

const bbox: ExternalAnnotation[] = [
  {
    coordinates: [
      { x: 0.05, y: 0.05 },
      { x: 0.2, y: 0.2 },
    ],
    labelIds: [5],
    type: AnnotationTool.BBox,
    status: AnnotationStatus.LOADED,
  },
  {
    coordinates: [
      { x: 0.25, y: 0.1 },
      { x: 0.45, y: 0.15 },
    ],
    labelIds: [8, 11],
    type: AnnotationTool.BBox,
    status: AnnotationStatus.LOADED,
  },
]

const polygon: ExternalAnnotation[] = [
  {
    coordinates: [
      { x: 0.05, y: 0.05 },
      { x: 0.2, y: 0.1 },
      { x: 0.25, y: 0.1 },
      { x: 0.25, y: 0.2 },
    ],
    labelIds: [5],
    status: AnnotationStatus.LOADED,
    type: AnnotationTool.Polygon,
  },
  {
    coordinates: [
      { x: 0.26, y: 0.3 },
      { x: 0.35, y: 0.33 },
      { x: 0.36, y: 0.32 },
      { x: 0.37, y: 0.3 },
      { x: 0.27, y: 0.25 },
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
