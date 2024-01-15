import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./Card";
import "./Homepage.css";
import { generateUTMParameters } from './UtmGenerator';

// import axios from "axios";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Center,
  Box
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";
import {
  addContentToBookmarks,
  createBookmarks,
  getallContent,
  getAllBookMarks,
  getTekdiallContent,
} from "../api/Apicall";
import Footer from "./Footer";
import Header from "./Header";
// import StarRating from "../components/Common/StarRating";
// import Loading from "../components/Loading";
// import CourseShimmer from "../components/Common/CourseShimmer";
import swal from "sweetalert";
import config from "../api/config.json";
import {
  Paginator,
  Container,
  Previous,
  Next,
  PageGroup,
  usePaginator,
} from "chakra-paginator";
import filterlogo from "/src/assets/Filter.svg";
import styles from "./Card.module.css";

function App() {
  const token = localStorage.getItem("token");
  const [story, setStory] = useState([]);
  const dtp = [];
  let configDatas = localStorage.getItem("config");
  let localData = JSON.parse(configDatas);
  const navigate = useNavigate();
  const { t } = useTranslation();
  let configuredData = config;
  //Rating
  const [currentRating, setCurrentRating] = useState(0);
  const handleRatingChange = (newRating) => {
    setCurrentRating(newRating);
  };
  const [openbookmarkModal, setopenbookmarkModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [listModal, setListModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [myAllBookmarks, setMyAllBookMarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    configuredData?.filters?.contentType || "all"
  );
  const [district, setdistrict] = useState(
    configuredData?.filters?.city || "all"
  );
  const [jobStateGroup, setjobStateGroup] = useState("all");
  const [jobDistrictGroup, setjobDistrictGroup] = useState("all");
  const [sectorGroup, setsectorGroup] = useState("all");


  const [educationGroup, seteducationGroup] = useState(
    configuredData?.filters?.branch || "all"
  );
  const [jobRoleGroup, setjobRoleGroup] = useState(
    configuredData?.filters?.language || "all"
  );

  const [subSectorGroup, setsubSectorGroup] = useState(
    configuredData?.filters?.publisher || "all"
  );
  const [actor, setActor] = useState(localStorage.getItem("actor") || "all");
  const [currentPage, setCurrentPage] = useState(0); // Current page for pagination

  const itemsPerPage = 10; // Current page for pagination
  const [selectedItems, setSelectedItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedProductstoLocal, setselectedProductstoLocal] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  const [stateList, setStateList] = useState([]);
  const [cities, setCities] = useState([]);
  const [sectorList, setSectorList] = useState([]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    const handlePageChange = () => {
      const state = { currentPage };
      const title = "";
      const url = window.location.href.split("?")[0];
      window.history.pushState(state, title, url);
    };

    handlePageChange();
    window.addEventListener("popstate", handlePageChange);

    return () => {
      window.removeEventListener("popstate", handlePageChange);
    };
  }, [currentPage]);
  const [storedValues, setStoredValues] = useState(null); // Variable to store entered values

  // Function to handle storing values on "Enter" click
  const handleSubmitenter = () => {
    const enteredValues = {
     
      jobStateGroup,
      district,
      selectedCategory,
      jobDistrictGroup,
      educationGroup,
      jobRoleGroup,
      sectorGroup,
      subSectorGroup,
    };
    searchResponse();
    onClose();
    setStoredValues(enteredValues);
  };

  useEffect(() => {
    fetchStatesFromApi();
    fetchCitiesFromApi();
    fetchSectorFromApi();
    searchResponse();
  }, [])
  

    const fetchStatesFromApi = async () => {
    try {
      const response = await fetch("https://jobs-api.tekdinext.com/jobs/getState");
      const data = await response.json();
      setStateList(data?.data?.jobs_cache.map(job => job?.state));
      console.log({stateList});
    } catch (error) {
      console.error("Error fetching states from API:", error);
    }
  };

  const fetchSectorFromApi = async () => {
    try {
      const response = await fetch("https://jobs-api.tekdinext.com/jobs/getTitle");
      const data = await response.json();
      setSectorList(data?.data?.jobs_cache.map(job => job?.title));
      console.log({sectorList});
    } catch (error) {
      console.error("Error fetching title from API:", error);
    }
  };

  const fetchCitiesFromApi = async (city) => {
    try {
      const response = await fetch(`https://jobs-api.tekdinext.com/jobs/getCity?state=${city}`);
      const data = await response.json();
      setCities(data.data.jobs_cache.map(job => job.city));
    } catch (error) {
      console.error("Error fetching cities from API:", error);
    }
  };

  
  const searchResponse = async () => {
    try {
      let bodyData = {
        "state": jobStateGroup,
        "city": jobDistrictGroup,
        "title": sectorGroup,
      };
      for (const key in bodyData) {
        if (bodyData[key] === "all" || bodyData[key] === "All") {
          delete bodyData[key];
        }
      }

  //  bodyData['bpp_id']= "dash-beckn.tibilapps.com"
    
        let response = await getallContent(bodyData);
    
        setStory(response.data.jobs_cache);

        const stored = [];
        for (const item of response.data.jobs_cache) {
          stored.push(item);
        }

        setCourses(stored);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    token ? myBookMarksList() : null;
  }, []);
  const myBookMarksList = async () => {
    let response = await getAllBookMarks();
    setMyAllBookMarks(response);
  };

  const handleProductSelect = (productId) => {
    //add bookmark to localstorage

    setselectedProductstoLocal((prevSelected) => {
      const newDescriptors = new Set([...prevSelected, productId?.descriptor]);
      return Array.from(newDescriptors);
    });

    //add bookmark to api
    if (selectedProducts.includes(productId?.id)) {
      setSelectedProducts(
        selectedProducts.filter((id) => id !== productId?.id)
      );
    } else {
      setSelectedProducts([...selectedProducts, productId?.id]);
    }
  };


  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    if (selectedCategory === "all") {
      localStorage.removeItem("selectedCategory");
    } else {
      localStorage.setItem("selectedCategory", selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (district === "all") {
      localStorage.removeItem("district");
    } else {
      localStorage.setItem("district", district);
    }
  }, [district]);

  useEffect(() => {
    if (jobStateGroup === "all") {
      localStorage.removeItem("jobStateGroup");
    } else {
      localStorage.setItem("jobStateGroup", jobStateGroup);
    }
  }, [jobStateGroup]);

  useEffect(() => {
    if (actor === "all") {
      localStorage.removeItem("actor");
    } else {
      localStorage.setItem("actor", actor);
    }
  }, [actor]);

  useEffect(() => {
    if (sectorGroup === "all") {
      localStorage.removeItem("sectorGroup");
    } else {
      localStorage.setItem("sectorGroup", sectorGroup);
    }
  }, [sectorGroup]);
  useEffect(() => {
    if (subSectorGroup === "all") {
      localStorage.removeItem("subSectorGroup");
    } else {
      localStorage.setItem("subSectorGroup", subSectorGroup);
    }
  }, [subSectorGroup]);
  useEffect(() => {
    if (jobDistrictGroup === "all") {
      localStorage.removeItem("jobDistrictGroup");
    } else {
      localStorage.setItem("jobDistrictGroup", jobDistrictGroup);
    }
  }, [jobDistrictGroup]);

  useEffect(() => {
    if (educationGroup === "all") {
      localStorage.removeItem("educationGroup");
    } else {
      localStorage.setItem("educationGroup", educationGroup);
    }
  }, [educationGroup]);
  // get data from the local storage
  const storedData = localStorage.getItem("storyList");
  let parsedArray = [];
  if (
    storedData === "undefined" ||
    storedData === undefined ||
    storedData === null
  ) {
    localStorage.setItem("storyList", JSON.stringify([]));
    // window.location.reload();
    searchResponse();
  } else {
    parsedArray = JSON.parse(storedData);
  }


  // Slice the filteredStory array based on pagination
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStory = story?.slice(startIndex, endIndex);
  // const paginatedStory1 = filteredStory?.slice(startIndex, endIndex);

  const pageCount = Math.ceil(story?.length / itemsPerPage);
  const breakLabel = pageCount > 5 ? "..." : null;

  // Function to handle page change
  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };


  const resetFilters = () => {
    setjobStateGroup("all");
    setjobDistrictGroup("all");
    setsectorGroup("all");
    setCities([]);
  };
  const showMessage = () => {
    setMessageOpen(true);
    // Additional logic for showing the message
  };

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const hideMessage = () => {
    setMessageOpen(false);
    // Additional logic for hiding the message
  };
  useEffect(() => {
    // Check if any filter is selected
    const anyFilterSelected =
      jobStateGroup !== "all" ||
      district !== "all" ||
      selectedCategory !== "all" ||
      jobDistrictGroup !== "all" ||
      educationGroup !== "all" ||
      jobRoleGroup !== "all" ||
      sectorGroup !== "all" ||
      subSectorGroup !== "all";
    // Update button color based on the condition
    const button = document.getElementById("filterButton");
    if (button) {
      button.style.backgroundColor = anyFilterSelected ? "#3182ce" : "white";
    }
  }, [
    jobStateGroup,
    district,
    selectedCategory,
    jobDistrictGroup,
    educationGroup,
    jobRoleGroup,
    sectorGroup,
    subSectorGroup,
  ]);
  const activeStyles = {
    w: 7,
    bg: "blue.500",
    fontSize: "sm",
    _hover: {
      bg: "blue.300",
    },
  };

  return (
    <div
    >
      <div>
        <Header />
      </div>
      <div className="App">
        <div className="product-container" style={{ marginTop: "70px" }}>
          <div
            style={{
              position: "sticky",
              top: "70px",
              zIndex: 1,
              background: "#fff",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between", // Aligns items to left and right
              alignItems: "center",
              flexDirection: "row", // Ensures horizontal arrangement
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Button to open the message */}
              <label style={{ paddingRight: "20px" }}>
                {t("Filter_your_results")}
              </label>
            </div>

            <Button
              style={{ border: "solid 0.5px" }}
              id="filterButton"
              onClick={onOpen}
            >
              <img src={filterlogo} alt="Filter icon" style={{ filter: 'brightness(0.2)' }}></img>
            </Button>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
              <ModalOverlay width={'100%'} height={'100%'} />

              <ModalContent>
                <ModalHeader>
                  <ModalCloseButton />
                </ModalHeader>
                <br />

                <ModalBody marginBottom={3}>
                
                  <Select
                    style={{ backgroundColor: "#e7e7f152", color: "black" }}
                    className="filters"
                    value={jobStateGroup}
                    onChange={(e) => {
                      setjobStateGroup(e.target.value);
                      fetchCitiesFromApi(e.target.value);
                    }}
                  >
                    <option value="all">{t("Job_state")}</option>
            

                     {stateList?.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                  </Select>
                  <br />
          
               
                  <Select
                    style={{ backgroundColor: "#e7e7f152", color: "black" }}
                    className="filters"
                    value={jobDistrictGroup}
                    onChange={(e) => setjobDistrictGroup(e.target.value)}
                  >
                    <option value="all">{t("Job_destrict")}</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </Select>{" "}
                  <br />
                  <Select
                    style={{ backgroundColor: "#e7e7f152", color: "black" }}
                    className="filters"
                    value={sectorGroup}
                    onChange={(e) => setsectorGroup(e.target.value)}
                  >
                    <option value="all">{t("Sector")}</option>
                    {sectorList?.map((title, index) => (
                      <option key={index} value={title}>
                        {title}
                      </option>
                    ))}
                  </Select>{" "}
        
                  <br />
                  <Button paddingTop={1} marginLeft={2} color={"white"} background={'#3182ce'} onClick={handleSubmitenter}>Search</Button>
                  <Button paddingTop={1} marginLeft={4}  color={"white"} background={'#3182ce'} onClick={resetFilters}>Reset</Button>

                </ModalBody>
              </ModalContent>
            </Modal>
          </div>
          <div>
          {paginatedStory?.length === 0 && (
            <Box background={"white"} textAlign={'center'} padding={5} width={'100%'}>No data available for the selected filters.</Box>
          ) }
          </div>

          <div className={styles.grid_holder}>
          {paginatedStory?.length != 0 && (
            paginatedStory?.map((product, index) => (
              <div  key={index}>
                <ProductCard product={product} />
              </div>
            ))
          )}

          </div>
          
          {/* Pagination */}
          <div>
            {console.log({ currentPage })}
            {pageCount > 1 && (
              <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                breakLabel={breakLabel}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
                forcePage={currentPage}
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
