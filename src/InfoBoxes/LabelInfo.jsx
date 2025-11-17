import React, { useEffect, useState } from 'react'
import InfoBox from './InfoBox'
import SiaPopup from '../SiaPopup'
import AnnoExampleViewer from '../AnnoExampleViewer'
const LabelInfo = (props) => {
  const [showExampleViewer, setShowExampleViewer] = useState(false)
  const [myLbl, setMyLbl] = useState(undefined)
  // const { data: exampleImg, mutate: getAnnoExample } = exampleApi.useGetAnnoExampleImg({})
  useEffect(() => {
    if (props.selectedAnno) {
      const selectedLabelIds = props.selectedAnno.labelIds
      if (selectedLabelIds) {
        const lbl = props.possibleLabels.find((e) => {
          return selectedLabelIds[0] === e.id
        })
        if (lbl) {
          if (lbl !== myLbl) {
            setMyLbl(lbl)
            if (props.visible)
              // getAnnoExample({llId:lbl.id, type:'annoBased', drawAnno: true, addContext:0.05})
              requestImg(lbl, props.selectedAnno)
          }
        }
      }
    }
  }, [props.selectedAnno])
  const onDismiss = () => {
    if (props.onDismiss) {
      props.onDismiss()
    }
  }

  const requestImg = (lbl, anno) => {
    if (props.onGetAnnoExample) {
      props.onGetAnnoExample({ lbl: lbl, anno: anno })
    }
  }

  const handleImgClick = () => {
    // setShowExampleViewer(true)
    // requestImg(myLbl, props.selectedAnno)

    setShowExampleViewer(true)
    // getAnnoExample({llId:myLbl.id, type:'annoBased', drawAnno: true, addContext:0.05})
  }

  const renderExampleImg = () => {
    if (!props.exampleImg) return null
    return (
      <div>
        <h4 onClick={() => handleImgClick()}>Example:</h4>
        <SiaPopup
          trigger={
            <img
              src={props.exampleImg.img}
              onClick={() => handleImgClick()}
              style={{ borderRadius: 25, width: '100%' }}
            />
          }
          content={'Click on image to view more examples'}
        />
      </div>
    )
  }

  const renderDescription = () => {
    // if (props.selectedAnno){
    // if (myLbl){
    // const selectedLabelIds = props.selectedAnno.labelIds
    // if (!selectedLabelIds) return 'No Label'
    // const lbl = props.possibleLabels.find( e => {
    //     return selectedLabelIds[0] === e.id
    // })
    if (!myLbl) return 'No Label'
    return (
      <div>
        <h4>{myLbl.label}</h4>
        <div dangerouslySetInnerHTML={{ __html: myLbl.description }} />
        {renderExampleImg()}
        <AnnoExampleViewer
          onRequestExample={() => requestImg(myLbl, props.selectedAnno)}
          onClose={() => {
            setShowExampleViewer(false)
          }}
          active={showExampleViewer}
          lbl={myLbl}
          exampleImg={props.exampleImg}
        />
      </div>
    )
    // } else {
    //     return 'No Label'
    // }
  }

  return (
    <InfoBox
      header="Label Info"
      content={renderDescription()}
      visible={props.visible}
      defaultPos={props.defaultPos}
      onDismiss={() => onDismiss()}
    />
  )
}

export default LabelInfo
