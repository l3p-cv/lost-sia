enum AnnotationStatus {
  CREATING, // during creation of line / polygon
  CREATED, // created, but not loaded from the server
  DELETED,
  LOADED, // loaded using props (initialAnnotations)
  CHANGED, // modified (after CREATED or DELETED)
}

export default AnnotationStatus
