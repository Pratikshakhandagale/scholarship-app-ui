import React, { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Shared.css';
import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Textarea,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
const StatusCheck = () => {
  const navigate = useNavigate();
  const [applicationId, setApplicationId] = useState("");

  const handleCheckStatus = () => {
    toast.dismiss();
    // You can implement the logic to check the status using the applicationId
    // For now, let's show a simple message using Chakra UI toast
    // toast({
    //   title: "Checking Status",
    //   description: `Checking status for application ID: ${applicationId}`,
    //   status: "info",
    //   duration: 3000,
    //   isClosable: true,
    // });
    toast.info("Stay tuned! We're enhancing this page for a better experience.",{
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 5000,
      hideProgressBar: true,
      theme: "colored",
      pauseOnHover: true,
      toastClassName: 'full-width-toast', 
    });
  };
  

  const handleStatusClick = () => {
    // Navigate to the status page or route of your choice
    navigate("/status"); // Adjust the route accordingly
  };

  return (
    <div>
      <Header />
   
    <Box 
      px={10}
      py={10}
      borderWidth="2px"
      borderRadius="lg"
      maxH="lg"
      mx={4}
      marginTop={100}
      background={'white'}
    >
      <Text   fontSize={18}
      whiteSpace="nowrap"
      overflow="hidden" background={'#f0f8ff80'} padding={3}
      textOverflow="ellipsis" fontFamily={'Arial'} mb={5}>Check Application Status</Text>

<FormControl mb={5}>
          <FormLabel>Enter Application ID:</FormLabel>
          <Input
            type="text"
            placeholder="Application ID"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
          />
        </FormControl>
      <Button colorScheme="blue" onClick={handleCheckStatus}>
        Check Status
      </Button>
      {applicationId && (
        <Text mt={4}>
          You entered Application ID: <strong>{applicationId}</strong>
        </Text>
      )}
    
    </Box>
    </div>
  );
};

export default StatusCheck;
