import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Header from "./Header";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Shared.css';

const Tracker = () => {
  const [applicationId, setApplicationId] = useState("");
  const [trackStatus, setTrackStatus] = useState(null);

  const handleTrackClick = () => {
    toast.dismiss();
    toast.info("Stay tuned! We're enhancing this page for a better experience.",{
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 5000,
        hideProgressBar: true,
        theme: "colored",
        pauseOnHover: true,
        toastClassName: 'full-width-toast', 
      });
    // if (applicationId === "12345") {
    //   setTrackStatus("In Progress");
    // } else {
    //   setTrackStatus("Not Found");
    // }
  };

  return (
    <div>
    <Header />
    <VStack spacing={4} align="stretch" marginTop={100}>
      <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md" mx={4} background={'white'}>
        <FormControl>
          <FormLabel>Enter Application ID:</FormLabel>
          <Input
            type="text"
            placeholder="Application ID"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
          />
        </FormControl>
        <Button mt={4} colorScheme="blue" onClick={handleTrackClick}>
          Track Application
        </Button>
      </Box>

      {trackStatus !== null && (
        <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
          <Text fontWeight="bold">Track Status:</Text>
          <Text>{trackStatus}</Text>
        </Box>
      )}
    </VStack>
    </div>
  );
};

export default Tracker;
