import React, { useState, useEffect } from 'react';
import Header from './Header';
import { MdLocationPin } from "react-icons/md";
import { FaRupeeSign, FaBriefcase } from 'react-icons/fa';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import selectJson from '../assets/bodyJson/selectResult.json';
import Loader from './Loader';
import { v4 as uuidv4 } from 'uuid';
import { Box, Text, HStack, Icon, Button, Spinner, Divider } from "@chakra-ui/react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Shared.css';
import ReactGA from "react-ga4";
import { useParams } from 'react-router-dom';

function JobDetails() {
  const [loading, setLoading] = useState(true);
  const uniqueId = uuidv4();

  const location = useLocation();
  const state = location?.state;
  const [showIframe, setShowIframe] = useState(true);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [jobInfo, setJobInfo] = useState(state?.product);
  const [jobsData, setJobsData] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const { jobId } = useParams();
  const [transactionId, settransactionId] = useState(uniqueId);




  //const jobsData  = selectJson?.responses[0]?.message?.order?.items[0]
  //console.log(jobsData);
  function errorMessage(message)
  {
    toast.error(message,{
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 5000,
      hideProgressBar: false,
      theme: "colored",
      pauseOnHover: true,
      toastClassName: 'full-width-toast', 
    });
  }

  const trackReactGA = () => {
    console.log('User clicked the Apply job details button');
    ReactGA.event({
      category: 'Button Click',
      action: 'apply_Button',
      label: 'Apply Button',
      value: 2, 
    });
  };

  const fetchJobDetails = async (jobInfo) => {
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
      data['context']['message_id'] = transactionId;
      setJobDetails(data)
      setJobsData(data?.responses[0]?.message?.order?.items[0]);
      localStorage.setItem('selectRes', JSON.stringify(data))
      if (!data?.responses.length) {
        errorMessage('Server Error: Unfortunately, our servers are currently down. Please try again after some time.');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   // ReactGA.pageview(window.location.pathname + window.location.search);
   var requestOptions = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"item_id": jobId}),
  };

   fetch(
    "https://jobs-api.tekdinext.com/jobs/search",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      result = JSON.parse(result);
      setJobInfo(result?.data?.jobs_cache[0]);
      fetchJobDetails(result?.data?.jobs_cache[0]);
    })
    .catch((error) => console.log("error", error));

  }, []); // Runs only once when the component mounts


  return (
    <div >
      <Header />

      <Box fontFamily={'Alice'} marginTop={100} padding={4} borderRadius={15} backgroundColor={"white"} marginLeft={4} marginRight={4}>
        <Box>
          <Text marginLeft={1} fontSize={['xl', '2xl', '3xl']}>{jobInfo?.provider_name}</Text>
          {jobInfo?.title && (
            <Text color="gray.700" marginTop={'3'} fontWeight={600} marginLeft={1} fontSize={['sm', 'md']}>
              {jobInfo?.title}
            </Text>
          )}
           {jobInfo?.company && (
            <Text color="gray.700" marginTop={'2'} marginLeft={1} fontSize={['sm', 'md']}>
              {jobInfo?.company}
            </Text>
          )}
          <HStack marginTop={'1'} marginLeft={1}>
            {(jobInfo?.city || jobInfo?.state) && (
              <div style={{ display: 'flex' }}>
                <Icon as={MdLocationPin} boxSize={4} marginTop={1} marginRight={1} /> <Text fontSize={['xs', 'sm']}>
                  {jobInfo?.city}
                </Text>
                {jobInfo?.city && jobInfo?.state ? (
                  <Text fontSize={['xs', 'sm']}>, {jobInfo?.state}</Text>
                ) : (
                  <Text fontSize={['xs', 'sm']}>{jobInfo?.state}</Text>
                )}
              </div>
            )}
          </HStack>
          <HStack marginTop={'1'} marginLeft={1}>
            <div style={{ display: 'flex' }}>
              <Icon as={FaBriefcase} boxSize={4} marginRight={1} marginTop={1} />
              {jobInfo?.work_mode ? (
                <Text color="gray.700" fontSize={['xs', 'sm']}>
                  {jobInfo?.work_mode}
                </Text>
              ) : (
                <Text color="gray.700" fontSize={['xs', 'sm']} marginLeft={0.5}>
                  {t("Full_Time")}
                </Text>
              )}
              <Text color="gray.700" fontSize={['xs', 'sm']} marginLeft={0.5}>
                | {t("Immediate_Joiner")}
              </Text>
            </div>
          </HStack>
          <HStack marginLeft={1} marginRight={1} marginTop={'1'} color={'blue'} style={{ display: 'flex' }}>
            <Icon as={FaRupeeSign} boxSize={4} marginTop={1} />
            {jobInfo?.salary ? (
              <Text fontSize={['xs', 'sm']}>{jobInfo?.salary}</Text>
            ) : (
              <Text fontSize={['xs', 'sm']}>{t("As_Industry_Standard")}</Text>
            )}
          </HStack>
        </Box>
        <Box marginTop={[2, 4]} display="flex" justifyContent={['center', 'flex-start']}>
          <Button
            marginTop={2}
            marginRight={[0, 5]}
            width={['100%', 200]}
            colorScheme="blue"
            variant="solid"
            backgroundColor="blue.500"
            color="white"
            onClick={() => {
              navigate("/automatedForm/" + jobId + "/" + transactionId, {
                state: {
                  jobDetails: jobDetails,
                },
              });
              trackReactGA();
            }}
          >
            {t("Apply")}
          </Button>
        </Box>
      </Box>

      {loading ? (<Loader />
      ) : (
        <Box fontFamily={'Alice'} marginLeft={4} marginRight={4} padding={4} marginTop={5} borderRadius={15} backgroundColor={"white"}>
          <Text fontSize={16} fontWeight={700}>{t("Job_Description")}</Text>

          {jobInfo?.description ? (
            <Text marginTop={2} fontSize={['xs', 'sm']} color={"gray.700"}>  {jobInfo?.description}  </Text>
          ) : (
            <Text marginTop={2} fontSize={['xs', 'sm']} color={"gray.700"}>  {t("Job_description_is_not_available")}   </Text>
          )}
          <Box marginTop={4}>
            {jobsData?.tags?.map((tag, index) => (
              <Box key={index} marginBottom={3}>
                <Text fontSize={['sm']} color={'black'} fontWeight={700}>
                  {tag.descriptor.name}
                </Text>
                {tag.list.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <ul style={{ marginLeft: '3rem', listStyleType: 'disc' }}>
                      <li>
                        {!item?.descriptor?.name && item?.descriptor?.code && item?.value !== "" && (
                          <Text fontSize={['xs', 'sm']} color="gray.700">
                            {item?.descriptor?.code}
                          </Text>
                        )}

                        {item?.descriptor?.name && item?.value && item?.value !== "null" && item?.value !== null ? (
                          <Box display="flex">
                            {item?.descriptor?.name && (
                              <Text fontSize={['xs', 'sm']} color="gray.900" marginRight={2}>
                                {item?.descriptor?.name}:
                              </Text>
                            )}
                            {item?.value && (
                              <Text fontSize={['xs', 'sm']} color="gray.700">
                                {item?.value}
                              </Text>
                            )}
                          </Box>
                        ) : (
                          <div>
                            <Text fontSize={['xs', 'sm']} color="gray.700">
                              {t("Not_Provided")}
                            </Text>
                          </div>
                        )}
                      </li>
                    </ul>
                  </div>
                ))}
                <Divider my={2} borderWidth="0.5px" />
              </Box>
            ))}
          </Box>



        </Box>
      )}
    </div>




  );

}

export default JobDetails;
