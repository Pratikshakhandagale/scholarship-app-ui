// SideMenu.js
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, VStack, Text } from "@chakra-ui/react";
import React from "react";

const SideMenu = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Menu</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch">
            <Text>Check:</Text>
            <Text> - Status</Text>
            <Text> - Track</Text>
            <Text> - Feedback</Text>
            <Text> - Cancel</Text>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideMenu;
