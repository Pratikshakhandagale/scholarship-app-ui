// AutomatedForm.js
import React, { useState, useEffect } from "react";
import initReqBodyJson from "../assets/bodyJson/userDetailsBody.json";
// import submitFormData from '../assets/bodyJson/resourceSearch.json';
import './Shared.css';
import OrderSuccessModal from "./OrderSuccessModal";
import ReactGA from "react-ga4";

import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Loader from "./Loader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  Select,
} from "@chakra-ui/react";
import { add } from "lodash";
import { useParams } from 'react-router-dom';

const AutomatedForm = () => {

  const location = useLocation();
  const state = location?.state;
  // const jobDetails = state?.jobDetails?.responses[0];
  // const jobDetailsContext = state?.jobDetails?.context;

  // const [jobDetails, setjobDetails] = useState(null);
  // const [jobDetailsContext, setjobDetailsContext] = useState(state?.jobDetails?.context);


  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("Application ID");

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [apiResponse, setApiResponse] = useState("");

  const [jobsData, setJobsData] = useState(null);
  const [selectDetails, setSelectDetails] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);

  const { jobId } = useParams();
  const { transactionId } = useParams();


  let customerBody;
  let submitFormData = {
    customer: {
      person: {
        tags: []
      }
    }
  };
  let current = 1;
  let currentXinput;

  const confirmDetails = async (customerBody1) => {
    customerBody = customerBody1;
    try {
      setLoading(true);
      let jobDetails = JSON.parse(localStorage.getItem('jobDetails'));

      initReqBodyJson.init[1]["context"]["action"] = "confirm";
      initReqBodyJson.init[1]["context"]["bpp_id"] =
        jobDetails?.context?.bpp_id;
      initReqBodyJson.init[1]["context"]["bpp_uri"] = jobDetails?.context?.bpp_uri;
      initReqBodyJson.init[1]["context"]["transaction_id"] =
        transactionId;
      initReqBodyJson.init[1]["context"]["message_id"] =
        transactionId;
      initReqBodyJson.init[1].message.order.provider["id"] =
        jobDetails?.message?.order?.provider?.id;
      initReqBodyJson.init[1].message.order.items[0]["id"] =
        jobDetails?.message?.order?.items[0]?.id;
      initReqBodyJson.init[1].message.order.fulfillments[0]["id"] =
        jobDetails?.message?.order?.items[0]?.fulfillment_ids[0];
      initReqBodyJson.init[1].message.order.fulfillments[0]["customer"] =
        customerBody.hasOwnProperty('customer') ? customerBody['customer'] : customerBody;
      const paramBody = initReqBodyJson.init[1];

      // Perform API call with formData
      const response = await fetch(
        "https://jobs-api.tekdinext.com/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paramBody),
        }
      );
      const data = await response.json();
      // Set state and open the modal
      if (data.responses.length) {
        setOrderId(data.responses[0].message.order.id);
        setMessage(message);
        setModalOpen(true);
        setLoading(false);
      } else {
        setLoading(false);
        errorMessage('Server Error: Please try to submit form again.');
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
    }
  };

  function deepMerge(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          source[key] instanceof Object &&
          key in target &&
          target[key] instanceof Object
        ) {
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    return target;
  }

  const getInitJson = async () => {
    try {
      setLoading(true);

      const body = {
        transaction_id: transactionId,
        action: "on_init",
      };

      // Perform API call with formData
      const response = await fetch(
        "https://jobs-api.tekdinext.com/jobs/responseSearch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      const formDetails = data?.data?.response_cache;
      //  const index = current + 1;
      let foundObject;

      for (let i = 0; i < formDetails.length; i++) {
        const item = formDetails[i];
        if (
          item?.response?.message?.order?.items[0]?.xinput?.head?.index?.cur === current
        ) {
          foundObject = item;
          currentXinput = foundObject?.response?.message?.order?.items[0]?.xinput
          if (currentXinput?.head?.index?.cur === currentXinput?.head?.index.max) {
            let arr1 = submitFormData?.customer?.person?.tags
            let arr2 = foundObject?.response?.message?.order?.items[0]?.fulfillments[0]?.customer?.person?.tags
            let arr3 = arr1?.concat(arr2);
            submitFormData['customer']['person']['tags'] = arr3
            confirmDetails(submitFormData);
          } else {
            current = current + 1;
            if (submitFormData) {
              let arr1 = submitFormData?.customer?.person?.tags
              let arr2 = foundObject?.response?.message?.order?.items[0]?.fulfillments[0]?.customer?.person?.tags
              let arr3 = arr1?.concat(arr2);
              submitFormData['customer']['person']['tags'] = arr3
            } else {
              submitFormData = foundObject?.response?.message?.order?.items[0]?.fulfillments[0]

            }
            setLoading(false);
            searchForm(currentXinput.form.url)
          }
          break; // Exit the loop once the desired object is found
        }
      }
      // Handle the response as needed
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 20000);
    }
  };



  const getSelectDetails = async (jobInfo) => {
    try {
      setLoading(true);
      const response = await fetch('https://jobs-api.tekdinext.com/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "context": {
            "domain": "onest:work-opportunities",
            "action": "select",
            "version": "1.1.0",
            "bap_id": "jobs-bap.tekdinext.com",
            "bap_uri": "https://jobs-bap.tekdinext.com",
            "bpp_id": jobInfo?.bpp_id,
            "bpp_uri": jobInfo?.bpp_uri,
            "transaction_id": transactionId,
            "message_id": transactionId,
            "timestamp": "2023-02-06T09:55:41.161Z"
          },
          "message": {
            "order": {
              "provider": {
                "id": "1"
              },
              "items": [
                {
                  "id": jobId
                }
              ]
            }

          }
        }),
      });

      const data = await response.json();
      if (!data?.responses.length) {
        setLoading(false);
        errorMessage('Server Error: Unfortunately, our servers are currently down. Please try again after some time.');
      } else {
        data.responses[0]['context']['message_id'] = transactionId;
        // setjobDetails(data?.responses[0]);
        fetchInitDetails(data?.responses[0]);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      // setLoading(false);
    }
  };

  function errorMessage(message) {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 5000,
      hideProgressBar: false,
      theme: "colored",
      pauseOnHover: true,
      toastClassName: 'full-width-toast',
    });
  }

  const fetchInitDetails = async (jobDetails) => {
    try {
      setLoading(true);
      localStorage.setItem('jobDetails', JSON.stringify(jobDetails));

      console.log({ jobDetails });
      initReqBodyJson.init[1]["context"]["bpp_id"] =
        jobDetails?.context?.bpp_id;
      initReqBodyJson.init[1]["context"]["bpp_uri"] = jobDetails?.context?.bpp_uri;
      initReqBodyJson.init[1]["context"]["transaction_id"] =
        transactionId;
      initReqBodyJson.init[1]["context"]["message_id"] =
        transactionId;
      initReqBodyJson.init[1].message.order.provider["id"] =
        jobDetails?.message?.order?.provider?.id;
      initReqBodyJson.init[1].message.order.items[0]["id"] =
        jobDetails?.message?.order?.items[0]?.id;
      initReqBodyJson.init[1].message.order.fulfillments[0]["id"] =
        jobDetails?.message?.order?.items[0]?.fulfillment_ids[0];
      initReqBodyJson.init[1].message.order.fulfillments[0]["customer"] = {
        person: {},
      };

      const paramBody = initReqBodyJson.init[1];
      // Perform API call with formData
      const response = await fetch("https://jobs-api.tekdinext.com/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paramBody),
      });
      const data = await response.json();
      const curr = data?.responses[0]?.message?.order?.items[0]?.xinput?.head?.index?.cur;
      var max = data?.responses[0]?.message?.order?.items[0]?.xinput?.head?.index?.max;
      var formUrl = data?.responses[0]?.message?.order?.items[0]?.xinput?.form?.url;
      if (curr < max) {
        searchForm(formUrl);
      } else if (curr == max) {
        confirmDetails();
      }
      setLoading(false);

    } catch (error) {
      setLoading(false);
      errorMessage('Server Error: Please refresh page.');
      console.error("Error submitting form:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 20000);
    }
  };

  useEffect(() => {
    var requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "item_id": jobId }),
    };

    fetch(
      "https://jobs-api.tekdinext.com/jobs/search",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setJobInfo(result?.data?.jobs_cache[0]);

       let data = JSON.parse(localStorage.getItem('selectRes'));
        if (data) {
          fetchInitDetails(data?.responses[0]);
        }
        else {
          getSelectDetails(result?.data?.jobs_cache[0]);
        }
        // fetchInitDetails();
      })
      .catch((error) => console.log("error", error));
    //  confirmDetails();
  }, []); // Runs only once when the component mounts

  const trackReactGA = () => {
    console.log('User clicked the Submit form button');
    ReactGA.event({
      category: 'Button Click',
      action: 'submit_form',
      label: 'Submit Form',
      value: 3,
    });
  };



  const submitFormDetail = async (action, urlencoded) => {
    setLoading(true);
    trackReactGA();
    try {
      await fetch(action, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded,
      })
        .then((response) => response.text())
        .then((result) => {
          setTimeout(() => {
            setLoading(false);
            getInitJson();
          }, 7000);

        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      setLoading(false);

      console.error("Error submitting form:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 30000);
    }
  };

  const responseSearch = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      action: "on_init",
      transaction_id: transactionId,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      "https://jobs-api.tekdinext.com/jobs/responseSearch",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        confirmDetails(JSON.parse(result));
      })
      .catch((error) => console.log("error", error));
  };

  const closeModal = () => {
    // Close the modal and reset state
    setModalOpen(false);
    setOrderId("");
    setMessage("");
    navigate("/");
  };

  const searchForm = async (url) => {
    try {
      // Perform API request to submit data
      await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "text/html",
        },
      })
        .then((response) => {
          // Check if the response status is OK (status code 200-299)
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // Parse the response body as text
          return response.text();
        })
        .then((htmlContent) => {
          // Do something with the HTML content
          const container = document.getElementById("formContainer");
          if (container) {
            container.innerHTML = htmlContent;
            const form = document.getElementsByTagName("form")[0];
            const inputFields = form.querySelectorAll("input");
            const btnField = form.querySelector("button");

            if (btnField) {
              btnField.classList.add("autosubmit");
            }

            // Add a CSS class to each input field
            inputFields.forEach((input) => {
              input.classList.add("autoInputField");
              //input.style.border = "1px solid #000"; // Replace 'your-css-class' with the desired class name
            });

            const selectFields = form.querySelectorAll("select");
            selectFields.forEach((select) => {
              select.classList.add("selectField");
            });

            // setApiResponse(htmlContent);
            form.addEventListener("submit", (e) => {
              e.preventDefault();
              const formData = new FormData(form);
              var urlencoded = new URLSearchParams();

              formData.forEach(function (value, key) {
                urlencoded.append(key, value.toString());
              });
              // Manully call post api to form.action , and we will get submission_id in the response
              submitFormDetail(form.action, urlencoded);
            });
          }
        });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
    }
  };

  return (
    <Box marginTop={100}>
      <Header />
      {loading && (
        // Show the loader while data is loading
        <Loader />
      )}
      <Box margin={4}>
        <div id="formContainer"></div>
      </Box>
      <OrderSuccessModal
        isOpen={isModalOpen}
        onClose={closeModal}
        orderId={orderId}
        message={message}
      />
    </Box>
  );

};

export default AutomatedForm;
