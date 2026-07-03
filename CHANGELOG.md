# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## unreleased
### Added
- Add imageLabel and delete to Allowedtools (to hide coresponding toolbar elements)
### Fixed
- Removed potetnital image-loading error in firefox
### Removed
- Removed SIASettingButton (referencing already deleted toolbarevents)

## [3.2.0] - 2026-07-01
### Added
- `SIA.scss` : Added `tag-scroll` styles to be used as a horizontal thin scroll for `ImageLabelInput.tsx`.
- `TagLabel.tsx`: Added optional `onRemove` prop that renders a `✕` (faXmark) icon button inside the chip, allowing users to remove a selected label directly without reopening the dropdown.
### Fixed
- Fixed ImageLabelInput toggle button height to match adjacent buttons by removing hardcoded zero padding.
- `Canvas.tsx`: added `clampToCanvas` helper to prevent label selection popup from rendering outside the canvas bounds.
- `TagLabel.tsx`: Added onKeyDown to fix accessibility keyboard listener.
### Fixed
- Fixed ImageLabelInput toggle button irregular height to match adjacent buttons by removing hardcoded zero padding
- `Canvas.tsx`: added `clampToCanvas` helper to prevent label selection popup from rendering outside the canvas bounds.
- Canvas.tsx: fixed label selection popup to stay visible and track annotation correctly at any zoom level
### Changed
- `ImageLabelInput.tsx`: Selected labels now display as a single horizontally scrollable row of chips (max 300px, 500px in fullscreen) with a ✕ remove button on each chip; the dropdown label list is scrollable (max 200px) with the filter input pinned at top, and selected items are visually highlighted.
- `ImageTools.tsx`: Passed `isFullscreen` prop down to `ImageLabelInput` to support wider chip area in fullscreen mode.
- `LabelInput.tsx`: added div styles for vertical scroll inside the Dropdown Menu for Label Input.
- `ImageLabelInput.tsx`: Mouse wheel now scrolls the selected label chips area horizontally using a native non-passive wheel event listener via `tagScrollRef` ref callback.
- `ImageLabelInput.tsx`: fixed wheel event listener cleanup on unmount
- `LabelInput.tsx`: increased dropdown maxHeight to 200px

## [3.1.4] - 2026-06-25
### Fixed
- Sia.tsx: fixed duplicate internalId bug causing newly created annotations to survive deletion on first attempt
- Sia.tsx: fixed stale closure bugs missed in the deletion fix — undo history corruption on rapid edits, handleAnnoEditing using old state, and selection not syncing after polygon completion
### Changed
- Sia.tsx: removed duplicated lines

## [3.1.3] - 2026-06-02
### Fixed
- Canvas.tsx changed removed imageref for resseting size of image constantly on image size change
- Fixed issue of the dropdown for 'Add label' in sia annotation toolbar not closing - changes made in ImageLabelInput.tsx and ImageTools.tsx
- Fixed Search Annotation appearing in background when in fullscreen during Annotation Review by removing customPopoverStyle zIndex: 7000 in ImageFilterButton.tsx(lost) and reducing zIndex for fullscreenStyle in Sia.tsx to 1040.
- Canvas.tsx, Line.tsx, Polygon.tsx: added middle-click guards and refined handling to prevent broken clicks after middle-click during annotation creation
- Canvas.tsx: moved resetCanvas() inside canvasRef guard to prevent imgSize being stuck at {x:-1, y:-1} when canvasRef is not yet attached
- Canvas.tsx: added window-level mouseup listener to reset CAMERA_MOVE mode when middle-mouse is released outside the SVG boundary
- Canvas.tsx: added imgSize and uiConfig to calculatePageToCanvasOffset effect dependencies to prevent stale centering offset
- ImageLabelInput.tsx: corrected selectedLabelsIds prop type from number[] to number[] | undefined to match actual runtime nullability
- ImageTools.tsx: removed imageLabelIds from useEffect deps to prevent multi-label dropdown closing after every label click
### Added
- types.ts, Canvas.tsx: Added optional labelIds to ToolCoordinates for polygon operation results.

## [3.1.2] - 2026-05-11
### Changed
- Cleaned up unused allAnnos argument of onAnnoChanged and OnAnnoCreationFinished in Sia component
- Restructure annotation deletion for PolygonEditButtons, to make the tools more stable
### Fixed
- No longer selects and duplicates other polygons, when selecting labels with "enter" right after annotating

## [3.1.1] - 2026-05-06
### Changed
- updated ci deployment to use node 24 and npm with OIDC auth for publishing
### Fixed
- Fixed not saving labels when pressing enter directly after finishing poly-annotation

## [3.1.0] - 2025-12-17
### Changed
- Updated react to 19.2.1 (major update from v18)
### Added
- Added time travel (undo + redo changes using ctrl +z/y)

## [3.0.0] - 2025-12-03
### Breaking Changes
- Complete rework of LOST-SIA
- The props for the SIA component to the outside worls have changed completely.

## [2.0.0] - 2025-07-02
### Changed
- Order of buttons in ToolBar: Move setting and filter btn up
- Added notification that redo/undo is currently not supported
### Added
- imgActions poperty that will record all actions a user performs during the annotation process
- Set up prettier and formatted all files
- Added properties `isStaticPosition` and `fixedImageSize` to Sia
- Added additional Exports so lost-sia provides all necessary Exports to be usable in LOST
- Be able to remove a specific node of a polygon/ line by pressing ctrl + leftclick on the node to remove
- Added fetatures for SAM (Segment Anything) proposals -> Be able to define areas of interest boxes/ points for SAM
### Removed
- autoSave Feature since it caused a lot of runtime errors and instability
### Breaking Changes
- onAnnoSaveEvent and annoSaveResponse for instant annotation update in backend -> will also change some internal behaviour

## [1.3.0] - 2022-05-13
### Added
- Added fullscreen prop
### Fixed
- Sia: Do not crash when no annos prop is provided

## [1.2.0] - 2022-05-12
### Added
- Added preventScrolling prop onMouseEnter in canvas

## [1.1.3] - 2022-05-12
### Changed
- Move import of semantic-ui-css into index js

## [1.1.2] - 2022-05-12
### Added
- Sia dummy data for quick testing
### Changed
- Moved semantic ui css into sia component
### Fixed
- Toolbar: Do not crash if no filter props is provided

## [1.1.1] - 2022-05-11
### Changed
- Update sematic-ui-react to version 2.0.3

## [1.1.0] - 2022-05-10
### Added
- More fine grained visibility level for toolbar elements

## [1.0.3] - 2022-05-10
### Fixed
- Export of toolbarEvents and tools

## [1.0.2] - 2022-05-09
### Fixed
- Improved internal uiConfig handling

## [1.0.1] - 2022-05-06
### Fixed
- Export of Sia and other components

## [1.0.0] - 2022-05-06
### Added
- Possibility to assign comments to 2D-Annotations
- InfoBox (AnnoStats) that shows the number of annotations per label (see https://github.com/l3p-cv/lost/issues/86 and https://github.com/l3p-cv/lost/issues/160)
  - When clicking on a label in the InfoBox all annotations of this label will be hidden. Anothter click will show the annotations again. (see also https://github.com/l3p-cv/lost/issues/161)
- Added auto save feature
- Anno Example Viewer + Image Example in LabelInfo box
### Changed
- Move InfoBoxes to Canvas
### Breaking Change
- Restructured props and event handling for canvas and toolbar
- Created new Sia component
### Fixed
  - Fixed correctAnnotation method to work correctly in maxCanvas mode
  - Will prevent annotations from being created outside of the image

## [0.9.0] - 2021-12-23
### Added
- Delete annotation in creation mode when hitting *Escape*-Key
- Show img description in ImgBar if available
- Max canvas size mode. Where canvas takes the maximum container size and is not
  image oriented as before. Add prop *maxCanvas={true}* to canvas in order to enable.
### Changed
- Be able to deal with mixed color possible labels -> where a part of labels
  will have a specified color and the other part has no provided color

## [0.8.0] - 2021-10-14
### Added
- Added lockedAnnos prop for Canvas in order to lock annos by id. Locked annos
  can not be edited

## [0.7.0] - 2021-10-13
### Added
- Update annotations on **annos**-prob change

## [0.6.0] - 2021-09-28
### Added
- Edit mode for Polygons -> Edit polygons again that already have been created

## [0.5.2] - 2021-07-22
### Changed
- do not spam logs with toSia function
## [0.5.1] - 2021-04-17
### Fixed
- Prevent to crash when hitting delete and no annotation was selected
- Prevent to crash when no AnnoRef was found

## [0.5.0] - 2021-01-04
### Added
- Added onAnnoPerformedAction callback to canvas
### Changed
- Removed all logs

## [0.4.1] - 2020-12-16
### Changed
- Do not unload image when props.annos change

## [0.4.0] - 2020-12-16
### Added
- A possible label can now be selected as default label by id
- Added maxAnnos to canvasConfig. This allows to define a maximum number of annotations that are allowed per image.

## [0.3.0] - 2020-12-11
### Added
- Frontend annotation time measurement
  * Annotation time is now measured in frontend, based on user events. For each annotation individual user interaction time is measured.
- Delete last node of polygon/ line when hitting delete key in create mode
- Added copy & paste for annotations
- Added prop to block canvas
### Fixed
- Do not lose polygon annotation when hitting enter in create mode
- Do not allow to draw a polygon consisting of two points
- Do not collapse line with two points, when confirming with enter

## [0.2.2] - 2020-08-06
### Fixed
- Do not clutter background through sia css file, when importing sia canvas component

## [0.2.1] - 2020-06-20
### Fixed
- Fixed multiple image load events for the same image, that lead to wrong svg sizes

## [0.2.0] - 2020-06-05
### Fixed
- Added camera move on wasd keys
- Provide canvas key events via prop callback
### Changed
- Show annotation nodes in foreground and label above annotation to prevent that nodes are not accessible by the annotator (see https://github.com/l3p-cv/lost/issues/74)

## [0.1.2] - 2020-04-06
### Removed
- Removed most sia logs that clutter the console

## [0.1.1] - 2020-04-06
### Fixed
- Fixed undefined possible labels in canvas

## [0.1.0] - 2020-04-06
### Added
- Always reset annotation mode to *view* when getAnnoBackendFormat is called
- Delete annotation in sia canvas correctly, when they are moved out of the image.
- Prevent user from moving image out of canvas
- Confirm label in LabelInput by click on the respective label
- Configure name of the default Label by a prop
- Provide method to reset canvas zoom
- It is now possible to define custom label colors via canvas *possibleLabels* props

### Fixed
- Fixed jumping camera when zooming into the image
- Fixed LabelInput on wrong position when image was zoomed

## [0.0.2] - 2020-04-02
### Fixed
- Fixed crash on changing image when label input is active.

## [0.0.1] - 2020-04-01
### Fixed
- Fixed all annotations lost bug. (see also https://github.com/l3p-cv/lost/issues/51)
  * When a new annotation was created and deleted before a backend update was performed, SIA sent this annotation to backend for an db update
  * The backend then tried to update a db record that did not exists which caused an exception.
  * The result was that all annotation where lost
