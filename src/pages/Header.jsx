import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import imagePath from "../assets/TSHeader.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineMenu } from "react-icons/hi"; 
import {
  ChakraProvider,Button, Menu, MenuButton, MenuList,
  MenuItem,Modal,ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, FormControl, InputGroup, Input, InputRightElement,
  FormErrorMessage, Image, Stack, HStack, Box, Select
} from "@chakra-ui/react";
import { FaArrowLeft, FaUser, FaBars } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { UnlockIcon } from "@chakra-ui/icons";
import { resetPassword, getConfiguration } from "../api/Apicall";
import ImageLoader from "../components/Common/getImagesData";
import config from "../api/config.json";
import image from "../assets/logo.png"
function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [resetModal, setresetModal] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [configData, setConfigData] = useState({});
  const isHomeRoute = location.pathname === "/";
  const isCollectionsRoute = location.pathname.includes("/collections");
  const isMyBookmarksRoute = location.pathname.includes("/myBookmarks");
  const profile = location.pathname.includes("/config");
  const myLocalBookMarks = location.pathname.includes("/bookmarks");
  let token = localStorage.getItem("token");
  let userName = localStorage.getItem("userName");
  let configDatas = localStorage.getItem("config");
  let localData = JSON.parse(configDatas);
  let configuredData = config;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const result = await resetPassword(data);

    if (result?.data?.update_User_by_pk) {
      setresetModal(false);
      reset();
    } else {
      alert(result?.error);
    }
  };

  useEffect(() => {
    const getCongif = async () => {
      let response = await getConfiguration();
      setConfigData(response);
      localStorage.setItem("config", JSON.stringify(response));
    };
    getCongif();
  }, []);

  const myHome = () => {
    navigate("/");
  };

  const myCollections = () => {
    navigate("/collections");
  };
  const myBookmarks = () => {
    navigate("/myBookMarks");
  };

  const handleNavigation = (page) => {
    navigate(page); // Adjust the route accordingly
  };

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const myLocalBookmark = () => {
    navigate("/bookMarks");
  };
  return (
    <div
      className={styles.headerDiv}
      style={{
        backgroundColor: configuredData?.headerColor
          ? configuredData?.headerColor
          : "#3182ce",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "25px",
            fontFamily: "auto",
            fontSize: "20px",
          }}
        >
          <div
            style={{
              overflow: "hidden",
            }}
          >
            <img
              style={{ height: "50px", width: "50px", marginLeft: 12 }}
              onClick={() => navigate('/')}
              src={image}
              alt="Logo"
            />
          </div>

           <Box  marginLeft={2} style={{ width: "60%", textAlign: "left", color: "#3182ce" }}>
            <strong
              style={{ fontSize: configuredData?.headerFontSize || "15px" }}
            >
              {configuredData?.siteName
                ? configuredData?.siteName
                : t("welcome")}{" "}
              <br />
            </strong>
          </Box> 
        </div>

        <div
          style={{
            marginTop: "15px",
            paddingRight: "15px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "flex-end",
              gap: "8px",
              margin: "0 15px",
              marginBottom: "50px",
            }}
          >
            <button style={{ color: "#3182ce" }} onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>{" "}
            <Select
              style={{ color: "#3182ce", backgroundColor: "white", fontSize: '14px' }}
              defaultValue={i18n.language}
              onChange={(event) => i18n.changeLanguage(event.target.value)}
              placeholder=""
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="ma">मराठी</option>
            </Select>
               {/* Menu Button */}
               <Menu>
               <MenuButton as={Box} cursor="pointer" color="#3182ce" background={'#edf2f7'} fontSize={25} borderRadius="md" paddingX={2} paddingY={2}>

                <HiOutlineMenu />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleNavigation('/status')}>
                  Status
                </MenuItem>
                {/* <MenuItem onClick={() => handleNavigation('/track')}>
                  Track
                </MenuItem> */}
                <MenuItem onClick={() => handleNavigation('/feedback')}>
                  Feedback
                </MenuItem>
                <MenuItem onClick={() => console.log("Cancel clicked")}>
                  Cancel
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
