import React, { useState, useEffect } from "react";
import styles from "./Card.module.css";
import { MdArrowForward, MdLocationPin } from "react-icons/md";
import { FaRupeeSign, FaBriefcase } from 'react-icons/fa';
import ReactGA from "react-ga4";
import { generateUTMParameters } from './UtmGenerator';

import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Button,
  Text,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Grid,
  GridItem,
  SimpleGrid,
  HStack,
  Icon
} from "@chakra-ui/react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ImageLoader from "../components/Common/getImagesData";
import { useTranslation } from "react-i18next";
import { FaBookmark } from "react-icons/fa";
import swal from "sweetalert";

const ProductCard = ({ product }) => {
  const [imageurl, setimageurl] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const jobId = product?.item_id;
  const parts = product?.icon?.split("/");
  if (parts) {
    const filename = parts[parts.length - 1];
  }
  const [isBookmarked, setIsBookmarked] = useState(false);
    const trackReactGA = () => {
      console.log('User clicked the View details button');
      ReactGA.event({
        category: 'Button Click',
        action: 'view_Details-button',
        label: 'View Details',
        value: 1, 
      });
  
    };

  useEffect(() => {
    // const response =  fetch(embeddedURL);
    // console.log({response});

    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(delay);
  }, []);

  const StoreBookMarkstoLocalStorage = () => {
    let existingBookmarks =
      JSON.parse(localStorage.getItem("myBookMarks")) || [];
    if (Array.isArray(product?.descriptor)) {
      existingBookmarks.push(...product?.descriptor);
    } else {
      existingBookmarks.push(product?.descriptor);
    }
    localStorage.setItem("myBookMarks", JSON.stringify(existingBookmarks));

    swal("Success", "Well done, Added to MyBookMarks", "success");
  };

  const handleButtonClick = (e) => {
    StoreBookMarkstoLocalStorage();
  };
  return (
    <div >
      <>
      <Card
  display="flex"
  direction={{ base: "column", sm: "row" }}
  overflow="hidden"
  borderWidth="1px"
  borderRadius="lg"
  marginRight={6}
  borderColor="gray.200"
  _hover={{ borderColor: "blue.400" }}
  cursor="pointer"
  white-space = "nowrap"
    text-overflow= "ellipsis"
  boxShadow="7px 12px 0px rgba(0, 0, 0, 0.1)"
  style={{ height: "300px", overflow: "hidden" }}
>
  {/* Your ImageLoader component here */}
  <Box p={4} spacing={3}  align="flex-start" style={{ padding: "2px 12px !important", flex: 1 }}>
    <Text
      marginTop={1}
      fontSize={18}
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
    >
      {product?.provider_name}
    </Text>

    {product?.title && (
      <Text
        marginTop={1}
        fontSize={12}
        fontWeight={700}
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {product?.title}
      </Text>
    )}

{product?.company && (
      <Text
        marginTop={1}
        fontSize={12}
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {product?.company}
      </Text>
    )}

    {(product?.city || product?.state) ? (
      <HStack marginTop={1}>
        <Icon as={MdLocationPin} boxSize={3} marginBottom={1} />
        <Text fontSize="12px"  whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{product?.city},</Text>
        {(product?.city && product?.state) ? (
          <Text fontSize="12px"  whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{product?.state}</Text>
        ) : (
          <Text fontSize="12px"  whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{product?.state}</Text>
        )}
      </HStack>
    ) : (
      ""
    )}

    <HStack marginTop={1}>
      <Icon as={FaBriefcase} boxSize={3} marginBottom={1} />
      {product?.work_mode ? (
        <Text fontSize="12px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {product?.work_mode}
        </Text>
      ) : (
        <Text fontSize="12px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {t("Full_Time")}
        </Text>
      )}
      <Text  whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" fontSize="12px"> | {t("Immediate_Joiner")}</Text>
    </HStack>

    <HStack marginTop={1}>
      <Icon as={FaRupeeSign} boxSize={3} marginBottom={1} />
      {product?.salary ? (
        <Text fontSize="12px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {product?.salary}
        </Text>
      ) : (
        <Text fontSize="12px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
           {t("As_Industry_Standard")}
        </Text>
      )}
    </HStack>

    <Button onClick={() => {
    navigate("/jobDetails/" + product?.item_id, {
      state: { product: product },
    });
    trackReactGA();
  }}
  paddingTop={1} marginTop={1} size="md" fontSize={14} rightIcon={<MdArrowForward />} colorScheme="blue" variant="outline">
      {t("view_deatils")}
    </Button>
  </Box>
</Card>

      </>
    </div>
  );
};

export default ProductCard;
