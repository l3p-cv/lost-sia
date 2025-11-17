import { CModal, CModalBody, CModalHeader } from '@coreui/react'
import Instructions from './Instructions'

type InstructionsModalProps = {
  isOpen: boolean
  setIsOpen: (boolean) => void
}

const InstructionsModal = ({ isOpen, setIsOpen }: InstructionsModalProps) => {
  return (
    <CModal visible={isOpen} onClose={() => setIsOpen(false)} size="xl">
      <CModalHeader>Instructions</CModalHeader>
      <CModalBody>
        <Instructions />
      </CModalBody>
    </CModal>
  )
}

export default InstructionsModal
