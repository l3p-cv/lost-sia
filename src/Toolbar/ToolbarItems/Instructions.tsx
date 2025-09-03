import {
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CRow,
} from "@coreui/react";

type Instruction = {
  title: string;
  description: string[];
};

const Instructions = () => {
  const instructionContent: Instruction[] = [
    {
      title: "How to draw?",
      description: [
        "1.) Select a Tool in the toolbar",
        "2.) Draw with RIGHT CLICK on Canvas",
      ],
    },
    {
      title: "How to delete an annotation?",
      description: [
        "1.) Select an annotation with LEFT CLICK",
        "2.) Press DELETE or BACKSPACE",
      ],
    },
    {
      title: "How to assign a label?",
      description: [
        "1.) Select an annotation with LEFT CLICK ",
        "2.) Hit ENTER ",
        "3.) Type into the input field ",
        "4.) Hit ENTER to confirm ",
        "5.) Hit ESCAPE to close the input field",
      ],
    },
    {
      title: "Undo/ Redo",
      description: ["Undo: Hit STRG + Z ", "Redo: Hit STRG + R"],
    },
    {
      title: "Add/ Remove a node to Line/Polygon",
      description: [
        "Add: Hit STRG + Click left on the line",
        "Remove: Hit STRG + Click left on the node to delete",
      ],
    },
    {
      title: "Remove a node",
      description: ["Hold CTRL and left click on the node"],
    },
    {
      title: "Edit Line/Polygon",
      description: [
        "1.) Click on the Annotation you want to edit.",
        ' 2.) Press "e". New nodes can now be added using right click',
      ],
    },
    {
      title: "Zoom/ Move Canvas",
      description: [
        "Zoom: Use MOUSE WHEEL to zoom in/out",
        "Move: Hold MOUSE WHEEL and move mouse. Or Use W/A/S/D keys to move camera up/left/down/right",
      ],
    },
    {
      title: "TAB navigation",
      description: ["You can traverse all visible annotation by hitting TAB."],
    },
    {
      title: "Next/Prev image navigation",
      description: [
        "Get next image by hitting ARROW_RIGHT key.",
        "Get previous image by hitting ARROW_LEFT key.",
      ],
    },
    {
      title: "Copy and Paste annotations",
      description: [
        "Copy: 1.) Select annotation 2.) Hit STRG + C",
        "Paste: STRG + V",
      ],
    },
    {
      title: "Mark image as junk",
      description: ["Press J key"],
    },
    {
      title: "Assign a comment to a 2D annoation",
      description: ["1.) Select annotation", "2.) Hit C key"],
    },
  ];

  const renderCards = () => {
    return instructionContent.map((instruction) => {
      const stepsContent = instruction.description.map((step) => (
        <CCardText key={step}>{step}</CCardText>
      ));
      return (
        <CCol xs={12} md={4} lg={3} key={instruction.title}>
          <CCard>
            <CCardBody>
              <CCardTitle>{instruction.title}</CCardTitle>
              {stepsContent}
            </CCardBody>
          </CCard>
        </CCol>
      );
    });
  };

  return (
    <CContainer>
      <CRow xs={{ gutterY: 2 }}>{renderCards()}</CRow>
    </CContainer>
  );
};

export default Instructions;
