import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  FormControl,
  FormLabel,
  Text
} from "@chakra-ui/react";
import Header from "./Header";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Shared.css';

const Feedback = () => {
  const [applicationId, setApplicationId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedbackSubmit = () => {
    toast.dismiss();
   // setIsSubmitted(true);
   toast.info("Stay tuned! We're enhancing this page for a better experience.",{
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 5000,
    hideProgressBar: true,
    theme: "colored",
    pauseOnHover: true,
    toastClassName: 'full-width-toast', 
  });
  };

  return (
    <div>
    <Header />
    <VStack spacing={4} align="stretch" marginTop={100}  >
      <Box marginX={4} padding={30}  borderWidth="1px" borderRadius="md" boxShadow="md" background={'white'}>
      <Text   fontSize={18}
      whiteSpace="nowrap"
      overflow="hidden" background={'#f0f8ff80'} padding={3}
      textOverflow="ellipsis" fontFamily={'Arial'} mb={7}>Feedback</Text>

        <FormControl>
          <FormLabel>Enter Application ID:</FormLabel>
          <Input
            type="text"
            placeholder="Application ID"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Enter Feedback:</FormLabel>
          <Textarea
            placeholder="Provide your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </FormControl>
        <Button mt={4} colorScheme="blue" onClick={handleFeedbackSubmit}>
          Submit Feedback
        </Button>
      </Box>

      {isSubmitted && (
        <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
          <Text fontWeight="bold">Feedback Submitted Successfully!</Text>
          <Text>Your feedback for application {applicationId} has been received.</Text>
        </Box>
      )}
    </VStack>
    </div>
  );
};

export default Feedback;
