import Slider from "react-slick";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import React, { useEffect, useState, useRef } from "react";
//import search_btn_icon from "images/search_btn_icon.png"
import ReCAPTCHA from "react-google-recaptcha";
import OTPInput from "react-otp-input";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/router";
import api from "../api/api";
import {
  COMMUNITY_BASICS_DETAILS,
  GET_COMMUNITY_EVENTS,
  GET_COMMUNITY_HOME,
  GET_MY_COMMUNITY_SETTINGS,
  GET_UPCOMING_EVENTS,
  GetCommunityBlogs,
  GetDateWiseList,
  GetEventNameWiseList,
  Countrydialcode,
  GetPhoneNumber,
  GetOtpVerification,
  GetPackageVerification,
} from "../api/queries";
import TableLoader from "../../util/TableLoader";
import Header from "../components/Header";
import moment from "moment";
import { format } from "date-fns";
import { useMemo } from "react";
import Footer from "../components/Footer";
import PaymentDetails from "./paymentDetails";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";


const Event = ({ specCommunity }) => {
  // react Hook For State Handler
  const bannerRef = useRef(null);
  const desRef = useRef(null);
  //set pagination
  const {
    setCurrentPage: pastEventSetCurrentPage,
    next: pastEventNext,
    prev: pastEventPrev,
    currentPage: pastEventCurrentPage,
    itemsPerPage: pastEventItemsPerPage,
    maxPage: pastEventMaxPage,
    setTotal: pastEventSetTotal,
    total: pastEventTotal
  } = usePagination();
  const {
    setCurrentPage: upcomingEventSetCurrentPage,
    next: upcomingEventNext,
    prev: upcomingEventPrev,
    currentPage: upcomingEventCurrentPage,
    itemsPerPage: upcomingEventItemsPerPage,
    maxPage: upcomingEventMaxPage,
    setTotal: upcomingEventSetTotal,
    total: upcomingEventTotal
  } = usePagination();
  //console.log('pastEventCurrentPage-->',pastEventCurrentPage)

  //search with debounce
  const {
    debouncedValue: upcomingDebouncedValue,
    setSearchTerm: upcomingSetSearchTerm,
    searchTerm: upcomingSearchTerm,
  } = useDebounce();
  const {
    debouncedValue: pastDebouncedValue,
    setSearchTerm: pastSetSearchTerm,
    searchTerm: pastSearchTerm,
  } = useDebounce();

  const [donateNowView, setDonateNowView] = useState(false);
  const [textColor, setTextColor] = useState(null || "");
  const [storeData, setStoreData] = useState(null || "");
  const [bannerimg, setBannertImg] = useState(null || "");
  const [description, setDescription] = useState(null || "");
  const [profit, setProfit] = useState(null || "");
  const [cultural, setCultural] = useState(null || "");
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [communityName, setCommunityName] = useState(null || "");
  const [loading, setLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
  const [pastLoading, setPastLoading] = useState(false);
  const [bodyFonts, setbodyFonts] = useState(null || "");
  const [bodyFontSizes, setbodyFontSizes] = useState(null || "");
  const [headerFonts, setheaderFonts] = useState(null || "");
  const [headerFontSizes, setheaderFontSizes] = useState(null || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [publicPage, setPublicPage] = useState("");
  const [img, setImg] = useState("");
  const [ModalOpen, setModalOpen] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [rsvpDate, setRsvpDate] = useState("");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  /* <!-- =========== added logic ===============    --> */
  const [showModal, setShowModal] = useState(false);
  const [showpackageModal, setShowpackageModal] = useState(false);
  const [dialCode, setDialcode] = useState("" || null);
  const [otpToken, setotpToken] = useState("" || null);
  const [Id, setId] = useState("" || null);
  const [selectedPackageIds, setSelectedPackageIds] = useState([]);
  const [seniorsCount, setSeniorsCount] = useState(0);
  const [adultsCount, setAdultsCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentPackageType, setPaymentPackageType] = useState("");
  const [maximumGuest, setMaximumGuest] = useState(0);
  const [packageCounts, setPackageCounts] = useState({});
  const [Guests, setGuests] = useState(false);
  const [perHeadError, setPerHeadError] = useState(false);
  const [perHeadPackageError, setPerHeadPackageError] = useState(false);
  const intialPhoneModalValue = {
    phone: "",
    phoneCode: "+91",
    name: "",
    email: "",
  };
  const [phoneModal, setPhoneModal] = useState(intialPhoneModalValue);
  console.log("Phone Modal: ", phoneModal);
  console.log("###  Upcomming events Info: ", upcomingEvents)
  const [otp, setOtp] = useState("");

  const [captcha, setCaptcha] = useState({
    callback: "not fired",
    value: "[empty]",
    load: false,
    expired: "false",
  });
  const intialErrorsValue = {
    phone: "",
    otp: "",
    name:"",
    email:"",
  }
  const [Errors, setErrors] = useState(intialErrorsValue);
  console.log("Errors------->",Errors)

  const upcomingPageIndexQuery = router?.query?.up;
  const pastPageIndexQuery = router?.query?.pp;

  const upcomingQuerySearchTerm = router?.query?.upsearch;
  const pastQuerySearchTerm = router?.query?.ppsearch;

  const TEST_SITE_KEY = "6Lcx50MlAAAAABOOZwoO-aZ0JW2k0Vx0c6Y84ElV";
  const captchaRef = useRef(null);

  const decreaseSeniorsCount = () => {
    if (paymentPackageType == "per_head") {
      setPerHeadError(false);
    }
    setPerHeadPackageError(false)
    setSeniorsCount(seniorsCount > 0 ? seniorsCount - 1 : 0);
  };

  const increaseSeniorsCount = () => {
    if (paymentPackageType == "per_head" && (seniorsCount + adultsCount + childrenCount) >= parseInt(Object.values(packageCounts)[0])) {
      setPerHeadError(true)
    }
    else if ((seniorsCount + adultsCount + childrenCount) >= parseInt(maximumGuest)) {
      setPerHeadPackageError(true)
    }
    else {
      setPerHeadError(false)
      setSeniorsCount(seniorsCount + 1);
    }
  };

  const decreaseAdultsCount = () => {
    if (paymentPackageType == "per_head") {
      setPerHeadError(false);
    }
    setPerHeadPackageError(false)
    setAdultsCount(adultsCount > 0 ? adultsCount - 1 : 0);
  };

  const increaseAdultsCount = () => {
    if (paymentPackageType == "per_head" && (adultsCount + seniorsCount + childrenCount) >= parseInt(Object.values(packageCounts)[0])) {
      setPerHeadError(true)
    }
    else if ((seniorsCount + adultsCount + childrenCount) >= parseInt(maximumGuest)) {
      setPerHeadPackageError(true)
    }
    else {
      setPerHeadError(false)
      setAdultsCount(adultsCount + 1);
    }
  };

  const decreaseChildrenCount = () => {
    if (paymentPackageType == "per_head") {
      setPerHeadError(false);
    }
    setPerHeadPackageError(false)
    setChildrenCount(childrenCount > 0 ? childrenCount - 1 : 0);
  };

  const increaseChildrenCount = () => {
    if (paymentPackageType == "per_head" && (childrenCount + seniorsCount + adultsCount) >= parseInt(Object.values(packageCounts)[0])) {
      setPerHeadError(true)
    }
    else if ((seniorsCount + adultsCount + childrenCount) >= parseInt(maximumGuest)) {
      setPerHeadPackageError(true)
    }
    else {
      setPerHeadError(false)
      setChildrenCount(childrenCount + 1);
    }
  };
  const totalCount = seniorsCount + adultsCount + childrenCount;
  console.log(totalCount, "countttt");
  const decreaseSingleCount = (id) => {
    if (data.paymentCategory == "per_head") {
      setPerHeadPackageError(false);
    }
    setPackageCounts((prevCounts) => ({
      ...prevCounts,
      [id]: Math.max((prevCounts[id] || 0) - 1, 0),
    }));
    updateSelectedPackages(id);
  };

  const increaseSingleCount = (id) => {
    
    if (paymentPackageType == "per_head" && Object.values(packageCounts).reduce((partialSum, a) => partialSum + a, 0) >= parseInt(maximumGuest)) {
      setPerHeadPackageError(true);
    } else {
      setPackageCounts((prevCounts) => ({
        ...prevCounts,
        [id]: (prevCounts[id] || 0) + 1,
      }));
      updateSelectedPackages(id);
    }
  };

  const updateSelectedPackages = (id) => {
    const existingIndex = selectedPackageIds.findIndex(
      (packageObj) => packageObj.id === id
    );

    if (existingIndex !== -1) {
      // If the package ID already exists, update the selected status or other properties if needed
      const updatedSelectedPackageIds = [...selectedPackageIds];
      updatedSelectedPackageIds[existingIndex] = { id: id };
      setSelectedPackageIds(updatedSelectedPackageIds);
    } else {
      // If the package ID doesn't exist, add a new entry
      setSelectedPackageIds((prevIds) => [...prevIds, { id: id }]);
    }
  };

  // open the modal
  const payOffline = (item) => {
    setId(item?.id);
    setPaymentStatus(item?.paymentStatus);
    setPaymentPackageType(item?.paymentCategory);
    setShowpackageModal(true);
    setPerHeadError(false);
    setMaximumGuest(item?.attendees?.numberOfMaxGuests)
    if (item?.paymentStatus == "per_head") {
      setGuests(true)
    } else {
      setGuests(false)
    }
  };

  // set the value of phone code and phone number
  const closeModal1 = () => {
    setShowpackageModal(false);
    setIsModalOpen(false);
    setShowModal(false);
    setPhoneModal(intialPhoneModalValue);
    setOtp("");
    setSeniorsCount(0);
    setAdultsCount(0);
    setChildrenCount(0);
    setPackageCounts({});
    setPerHeadError(false);
    setErrors(intialErrorsValue);
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    console.log({name,value})
    if (name === "phoneCode" || name === "name") {
      setPhoneModal((prevPhoneModal) => ({
        ...prevPhoneModal,
        [name]: value,
      }));
    } else {
      if(name === "email") {
        var isValidInput = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value);
        var errorForThis = "Please provide proper Email Id";
        setPhoneModal((prevPhoneModal) => ({
          ...prevPhoneModal,
          [name]: value,
        }));
      } else {
        var isValidInput = /^[0-9]*$/.test(value) && value.length <= 10;
        var errorForThis = "Please provide proper Mobile No";
      }

      if (isValidInput) {
        setPhoneModal((prevPhoneModal) => ({
          ...prevPhoneModal,
          [name]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors,  [name]: "" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors,  [name]:errorForThis}));
      }
    }
  };

  const handleSend = () => {
    if (!phoneModal.phone) {
      setErrors({
        phone: "This is the required field",
      });
      return;
    }
    if (!phoneModal.name) {
      setErrors({
        name: "This is the required field",
      });
      return;
    }
    if (phoneModal.email) {
      var isValidInput = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(phoneModal.email);
       var errorForThis = "Please provide proper Email Id";
       if(isValidInput === false) {
        setErrors({
          email: errorForThis,
        });
        return;
       }
      
    }
    const fetchPhone = async () => {
      try {
        const response = await api.post("", {
          query: GetPhoneNumber,
          variables: {
            data: {
              phone: phoneModal.phone,
              phoneCode: phoneModal.phoneCode,
              eventId: Id,
            },
          },
        });
        if (response.status === 200) {
          if (response?.data?.data?.webVisitorPhoneVerify?.error === false) {
            toast.success(response?.data?.data?.webVisitorPhoneVerify?.message);
            setotpToken(response?.data?.data?.webVisitorPhoneVerify?.data?.token);
            setShowModal(true);
          } else {
            toast.error(response?.data?.data?.webVisitorPhoneVerify?.message);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPhone();
    setIsModalOpen(false)
  };

  const handleChangeotp =(e) => {
    const { name, value } = e.target;
    const isValidInput = /^[0-9]*$/.test(value) && value.length < 7;
    if(isValidInput) {
      setOtp(value);
      setErrors((prevErrors) => ({ ...prevErrors, otp: "" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, otp: "Please provide six digit OTP" }));
    }
  };

  const handleChange = (value) => {
    setCaptcha({ value });
    // if value is null recaptcha expired
    if (value === null) setCaptcha({ expired: "true" });
    document.getElementById("otp").disabled = false;
  };

  const asyncScriptOnLoad = () => {
    setCaptcha({ callback: "called!" });
  };

  const fetchPackage = async () => {
    try {
      const response = await api.post("", {
        query: GetPackageVerification,
        variables: {
          data: {
            eventId: Id,
            status: "Attending",
            numberSeniors: parseInt(seniorsCount, 10) || 0,
            numberAdults: parseInt(adultsCount, 10) || 0,
            numberChildren: parseInt(childrenCount, 10) || 0,
            phone: phoneModal.phone,
            phoneCode: phoneModal.phoneCode,
            name: phoneModal.name,
            email: phoneModal.email,
            packageDetails:
              selectedPackageIds.map((item) => ({
                packageId: item?.id,
                number: parseInt(packageCounts[item?.id], 10) || 0,
              })) || [],
          },
        },
      });

      if (response.status === 200) {
        if (response?.data?.data?.acceptOrRejectOrgEvent?.error === false) {
          toast.success(
            response?.data?.data?.acceptOrRejectOrgEvent?.message
          );
        } else {
          toast.error(response?.data?.data?.acceptOrRejectOrgEvent?.message);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleotpsubmit = () => {
    if (!otp) {
      setErrors({
        otp: "This is a required field",
      });
      return;
    }
    
    const fetchOtp = async () => {
      try {
        const response = await api.post("", {
          query: GetOtpVerification,
          variables: {
            data: {
              otp: parseInt(otp, 10),
              token: otpToken,
            },
          },
        });
        if (response.status === 200) {
          if (response?.data?.data?.webVisitorPhoneOTPVerify?.error === false) {
            toast.success(
              response?.data?.data?.webVisitorPhoneOTPVerify?.message
            );
            fetchPackage();
            //setIsModalOpen(false);
            //setShowModal(false);
            //setShowpackageModal(true);
            //setIsModalOpen(false);
            closeModal1()
          } else {
            toast.error(
              response?.data?.data?.webVisitorPhoneOTPVerify?.message
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchOtp();
    
    closeModal1();
  };
  const handlePackage = () => {
    setGuests(true);
  };

 
  const handleConfirm = () => {
    setIsModalOpen(true)
    setShowpackageModal(false)
    //closeModal1();
  };

  const formatPackage = (date) => {
    if (date === null) {
      return true;
    } else {
      const earlydate = new Date(parseInt(date, 10));
      const isEarlyBird = moment(earlydate).isBefore(new Date());
      return isEarlyBird;
    }
  };

  // get the dialcode of each country
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post("", {
          query: Countrydialcode,
        });

        if (response.status === 200) {
          setDialcode(response?.data?.data?.getCountryCodes?.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  /* <!-- ===========  end   of added logic ===============    --> */
  // Modal open & close function of previous logic
  const openModalOpen = () => {
    setModalOpen(true);
  };

  const closeModel = () => {
    setModalOpen(false);
  };

  const viewDetails = async (data, callback) => {
    const response = await api.post("", {
      query: GET_MY_COMMUNITY_SETTINGS,
      variables: {
        data: {
          slug: data,
        },
      },
    });
    localStorage.setItem(
      "storeData",
      JSON.stringify(response?.data?.data?.getMyCommunitiesSettingsView?.data)
    );
    setLoading(false);
    callback(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.communityId
    );

    setPublicPage(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.publicityPage
    );
    setTextColor(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.textColor || ""
    );

    setbodyFonts(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.bodyFont || ""
    );
    setbodyFontSizes(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.bodyFontSize ||
      ""
    );
    setheaderFonts(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.headerFont || ""
    );
    setheaderFontSizes(
      response?.data?.data?.getMyCommunitiesSettingsView?.data
        ?.headerFontSize || ""
    );
    document.body.style.backgroundColor =
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.backgroupColor;
  };

  useEffect(() => {
    if (publicPage === false) {
      router.push("/NotFoundScreen");
    }
  }, [publicPage]);
  // converting date format:
  const formatDate = (dateString) => {
    var date = new Date(dateString),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [mnth, day, date.getFullYear()].join("-");
  };

  const formatTimeUp = (isoTimestamp) => {
    const date = new Date(isoTimestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const normalTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    return normalTime;
  };
  const formatTimeDown = (isoTimestamp) => {
    const date = new Date(isoTimestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const normalTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    return normalTime;
  };
  useEffect(() => {
    var data = JSON.parse(localStorage?.getItem("storeData"));
    setStoreData(data);
  }, []);

  // storing logo image and calling a function
  useEffect(() => {
    getCommunityHomeDetails(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getCommunityBasicDetails(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getEventdata((storeData?.communityId && storeData?.communityId) || null);
    getPastEvents((storeData?.communityId && storeData?.communityId) || "");
    getUpcomingEvents((storeData?.communityId && storeData?.communityId) || "");
    setTextColor(storeData?.textColor || "");
    setbodyFonts(storeData?.bodyFont || "");
    setbodyFontSizes(storeData?.bodyFontSize || "");
    setheaderFonts(storeData?.headerFont || "");
    setheaderFontSizes(storeData?.headerFontSize || "");

    document.body.style.backgroundColor = storeData?.backgroupColor;
  }, [storeData]);

  useEffect(() => {
    if (upcomingPageIndexQuery) {
      upcomingEventSetCurrentPage(parseInt(upcomingPageIndexQuery));
    }
  }, [upcomingPageIndexQuery]);

  useEffect(() => {
    if (pastPageIndexQuery) {
      pastEventSetCurrentPage(parseInt(pastPageIndexQuery));
    }
  }, [pastPageIndexQuery]);

  useEffect(() => {
    if (upcomingDebouncedValue) {
      if (upcomingEventCurrentPage === 1) {
        getUpcomingEvents(
          (storeData?.communityId && storeData?.communityId) || "",
          true
        );
      } else {
        upcomingEventSetCurrentPage(parseInt(1));
      }
    } else {
      if (upcomingDebouncedValue?.length === 0) {
        getUpcomingEvents(
          (storeData?.communityId && storeData?.communityId) || "",
          true
        );
      }
    }
  }, [upcomingDebouncedValue]);

  useEffect(() => {
    if (pastDebouncedValue) {
      if (pastEventCurrentPage === 1) {
        getPastEvents(
          (storeData?.communityId && storeData?.communityId) || "",
          true
        );
      } else {
        pastEventSetCurrentPage(parseInt(1));
      }
    } else {
      if (pastDebouncedValue?.length === 0) {
        getPastEvents(
          (storeData?.communityId && storeData?.communityId) || "",
          true
        );
      }
    }
    
  }, [pastDebouncedValue]);

  useEffect(() => {
    getUpcomingEvents((storeData?.communityId && storeData?.communityId) || "");
  }, [upcomingEventCurrentPage]);

  useEffect(() => {
    getPastEvents((storeData?.communityId && storeData?.communityId) || "");
  }, [pastEventCurrentPage]);

  const handleSearchTermForEvents = (event, type) => {
    let query = {};
    if (type === "past") {
      pastSetSearchTerm(event.target.value);
    }

    if (type === "upcoming") {
      upcomingSetSearchTerm(event.target.value);
    }
  };

  useEffect(() => {
    if (upcomingQuerySearchTerm?.length > 0) {
      upcomingSetSearchTerm(upcomingQuerySearchTerm);
    }
  }, [upcomingQuerySearchTerm]);

  useEffect(() => {
    if (pastQuerySearchTerm?.length > 0) {
      pastSetSearchTerm(pastQuerySearchTerm);
    }
  }, [pastQuerySearchTerm]);

  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas, (commId) => {
        getCommunityHomeDetails(commId || null);
        getCommunityBasicDetails(commId || null);
        // getPastEvents(commId || null);
        // getUpcomingEvents(commId || null);
        getEventdata(commId || null);
      });
    }
  }, [router]);

  // for non -profit organisation or relgious api
  const getCommunityBasicDetails = async (id) => {
    setLoading(true);
    if (id) {
      const response = await api.post("", {
        query: COMMUNITY_BASICS_DETAILS,
        variables: {
          data: {
            id: id,
            isOrgPortal: true,
            keyNames: ["description", "address", "email", "phone"],
          },
        },
      });
      if (response?.status === 200) {
        setCultural(
          response?.data?.data?.getCommunityBasicDetails?.data?.communityType ||
          ""
        );
        setProfit(
          response?.data?.data?.getCommunityBasicDetails?.data?.nonProfit || ""
        );
        setCommunityName(
          response?.data?.data?.getCommunityBasicDetails?.data?.communityName ||
          ""
        );
      }
    }
    setLoading(false);
  };

  // Api if firing with the dependicies of community Id
  const getCommunityHomeDetails = async (id) => {
    setLoading(true);
    if (id) {
      const response = await api.post("", {
        query: GET_COMMUNITY_HOME,
        variables: {
          data: {
            id: id,
            isOrgPortal: true,
          },
        },
      });
      setBannertImg(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data
          ?.bannerImage
      );
      setDescription(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data
          ?.communityDescription
      );

      setCommunityName(
        response?.data?.data?.getCommunityBasicDetails?.data?.communityName
      );
      setImg(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data
          ?.logoImage || ""
      );
    }
    setLoading(false);
  };

  // Past events function calling
  const getPastEvents = async (id, search = false) => {
    setPastLoading(true);
    let data = {
      page: search ? 1 : pastEventCurrentPage,
      limit: pastEventItemsPerPage,
      communityId: id,
      eventType: "Past",
      isActive: "past",
    };
    if (pastDebouncedValue) {
      data.search = pastDebouncedValue;
    }
    console.log("data---->", data);
    if (id) {
      const response = await api.post("", {
        query: GET_COMMUNITY_EVENTS,
        variables: {
          data: data,
        },
      });
      if (response.status === 200) {
        setPastEvents(
          response?.data?.data?.getMyCommunityEvents?.data?.events || ""
        );
        pastEventSetTotal(
          response?.data?.data?.getMyCommunityEvents?.data?.total
        );
      }
    }
    setPastLoading(false);
  };

  const getUpcomingEvents = async (id, search = false) => {
    setUpcomingLoading(true);
    let data = {
      page: search ? 1 : upcomingEventCurrentPage,
      limit: upcomingEventItemsPerPage,
      communityId: id,
      eventType: "Upcoming",
    };
    if (upcomingDebouncedValue) {
      data.search = upcomingDebouncedValue;
    }
    if (id) {
      const response = await api.post("", {
        query: GET_UPCOMING_EVENTS,
        variables: {
          data: data,
        },
      });
      if (response.status === 200) {
        setUpcomingEvents(
          response?.data?.data?.getMyCommunityEvents?.data?.events || ""
        );
        upcomingEventSetTotal(
          response?.data?.data?.getMyCommunityEvents?.data?.total
        );
      }
    }
    setUpcomingLoading(false);
  };

  // Handle search functionality :
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fetch data from API for community search
  const searchData = async () => {
    setLoading(true);
    const response = await api.post("", {
      query: MyCommunityOrgGlobalSearch,
      variables: {
        data: {
          communityId: storeData?.communityId && storeData?.communityId,
          search: searchTerm,
        },
      },
    });
    setPastEvents(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.events
        ?.pastEvents || ""
    );

    setLoading(false);
  };

  // submit search function:

  const handleSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  // initially call the event data
  const getEventdata = async (Id) => {
    try {
      const response = await api.post("", {
        query: GetEventNameWiseList,
        variables: {
          data: {
            communityId: Id,
          },
        },
      });

      if (response.status === 200) {
        const eventsData =
          response?.data?.data?.orgImageListEventWise?.data?.events || [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertToPlainText = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    return doc.body.textContent || "";
  };

  const handleIdClicked = (id) => {
    let query = {
      id,
      up: upcomingEventCurrentPage,
      pp: pastEventCurrentPage,
    };
    if (upcomingDebouncedValue?.length > 0) {
      query.upsearch = upcomingDebouncedValue;
    }
    if (pastDebouncedValue?.length > 0) {
      query.ppsearch = pastDebouncedValue;
    }
    router.push({
      pathname: `/${router.query.cummunity_slug}/EventDetails`,
      query: query,
    });
  };

  useEffect(() => {
    // Simulated API response
    pastEvents.map((item) => {
      const apiResponse = {
        rsvpDate: item?.time?.to, // Assuming RSVP date is March 2, 2024, at 12:00:00
      };
      const currentTime = new Date();
      // Calculate time difference

      const rsvpTime = new Date(apiResponse.rsvpDate);
      // Check if RSVP date is in the future
      if (rsvpTime > currentTime) {
        const timeDifference = rsvpTime - currentTime;
        const hoursUntilRSVP = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert milliseconds to hours
        // Display reminder if RSVP date is near
        if (hoursUntilRSVP < 24) {
          setShowReminder(true);
        }
      } else {
        // RSVP date has passed, hide reminder
        setShowReminder(false);
      }

      setRsvpDate(apiResponse.rsvpDate);
    });
    let newTop =
      parseFloat(bannerRef?.current?.clientHeight) +
      parseFloat(desRef?.current?.clientHeight);
    window.scrollTo(0, newTop - 80);
  }, []);

  useEffect(() => {
    if (donateNowView) {
      // Get the position of the div

      let newTop =
        parseFloat(bannerRef?.current?.clientHeight) +
        parseFloat(desRef?.current?.clientHeight);
      window.scrollTo(0, newTop);
    }
  }, [donateNowView]);

  const allEvents = [...upcomingEvents, ...pastEvents];

  return (
    <>

      {/* Header Component */}
      <Header />
      
      {/* Banner */}
      {/* <div className="container" ref={bannerRef}>
        <div className="row">
          <div className="col-lg-12">
            <div className="banner-button">
              <div className="btn-cultural btn_about_top">
                {cultural} Community
              </div>
              <div className="logo-pic">
                <span>
                  <img
                    src={
                      img ||
                      "https://sangaraahi.s3.ap-south-1.amazonaws.com/group%201.png"
                    }
                    alt=""
                  />
                </span>
              </div>
              <div className="btn-nonprofit btn_about_top">
                {" "}
                {profit ? "For Profit Organization" : "Non Profit Organization"}
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div
        className="inner-banner "
        style={{
          color: textColor,
          fontFamily: headerFonts,
          fontSize: headerFontSizes,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="banner-button">
                <div className="btn-cultural btn_about_top">
                  {cultural} Community
                </div>
                <div className="logo-pic">
                  <span>
                    <img
                      src={
                        img ||
                        "https://sangaraahi.s3.ap-south-1.amazonaws.com/group%201.png"
                      }
                      alt=""
                    />
                  </span>
                </div>
                <div className="btn-nonprofit btn_about_top">
                  {" "}
                  {profit ?  "For Profit Organization" : "Non Profit Organization"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display community name */}
      <div
        className="about-top box_shadow_line_inset">
        <div className="container" ref={desRef}>
          <div className="row">
            <div className="col-lg-12">
              <div className="event_sec_title textCenter">
                <h3
                  className="textCenter"
                  style={{
                    color: textColor,
                    fontFamily: headerFonts,
                    fontSize: headerFontSizes,
                  }}
                >
                  {storeData?.communityName}
                </h3>
              </div>

              {/* <div className="event_sec_content textCenter">
                <p
                  className="textCenter"
                  style={{
                    color: textColor,
                    fontFamily: headerFonts,
                    fontSize: headerFontSizes,
                  }}
                >
                  dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                  quisquam est, qui dolorem ipsum quia dolor sit amet,
                  consectetur, adipisci velit, sed quia non numquam eius modi
                  tempora incidunt ut labore et dolore magnam aliquam quaerat
                  voluptatem. Ut enim ad minima veniam, quis nostrum
                  exercitationem ullam corporis suscipit laboriosam, nisi ut
                  aliquid ex ea commodi consequatur? Quis autem vel eum iure
                  reprehenderit qui in ea voluptate velit esse quam nihil
                  molestiae consequatur
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Comming Soon Modal (Not in use)*/}
      {ModalOpen && (
        <div className="overlay">
          <div className="modalsss">
            <div className="modal-content">
              <h2>Coming Soon</h2>

              <div className="modal_footer">
                <button
                  className="button_appearance_none modal_button_submit"
                  onClick={closeModel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show QR Code (Donate now view) || Event lists */}
      {donateNowView ? (
        <>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="event_sec_title">
                  <button
                    className="button_appearance_none page_back_btn"
                    onClick={() => setDonateNowView(false)}
                  >
                    Back to events
                  </button>
                </div>
              </div>
            </div>
          </div>
          <PaymentDetails donateNowView={donateNowView} />
        </>
      ) : (
        <div>

          {/* Upcomming Events Container*/}
          <div className="container">
            <div className="row">
              <div className="col-lg-12">

                {/* Upcomming Event - Search, Prev and Next button */}
                <div className="list_sec list_sec_title">
                  <div className="sec_title_left">
                    <h3 className="secTitle">Upcoming Events</h3>
                  </div>
                  <div className="sec_title_right">
                    <div className="sec_title_right_search">
                      <input
                        type="text"
                        placeholder="Search"
                        className="input_appearance_none search_filter_sec"
                        value={upcomingSearchTerm}
                        onChange={(event) => {
                          handleSearchTermForEvents(event, "upcoming");
                        }}
                      ></input>
                      <button
                        type="submit"
                        className="button_appearance_none header_search_btn "
                      >
                        <img
                          src="/images/search_btn_icon.png"
                          className="search_btn_icon"
                        ></img>
                      </button>
                    </div>
                    <div className="sec_title_right_sliderBtn slide-list ">
                      <button
                        type="button"
                        data-role="none"
                        className={`slick-arrow slick-prev  ${upcomingEventCurrentPage === 1 ? 'disabled' : ''}`}
                        onClick={upcomingEventPrev}
                        disabled={
                          upcomingEventCurrentPage === 1 ? true : false
                        }
                      >
                        {" "}
                        Previous
                      </button>
                      <button
                        type="button"
                        data-role="none"
                        className={`slick-arrow slick-next  ${upcomingEventCurrentPage === upcomingEventMaxPage ? 'disabled' : ''}`}
                        onClick={upcomingEventNext}
                        disabled={
                          upcomingEventCurrentPage === upcomingEventMaxPage ? true : false
                        }
                      >
                        {" "}
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upcomming Event - Event page and total count */}
                <div className="container mb_20">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="sec_title_right_col_black">
                        Page {upcomingEventCurrentPage} of {upcomingEventMaxPage} <b>Total:</b> {upcomingEventTotal}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Table Skeleton Loader ||  Upcomming Event Lists */}
                {upcomingLoading ? (
                  <TableLoader />
                ) : upcomingEvents?.length === 0 ? (
                  <div className="no_data_card">No Upcoming Event Found</div>
                ) : (
                  <div className="eventCard_list_bg">
                    {upcomingEvents &&
                      upcomingEvents?.map((item) => {
                        return (
                          <>
                            <div
                              className="eventCard_item"
                              style={{
                                backgroundImage: `url(${item?.image})`,
                                width: "100%",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                              }}
                            >
                              <div className="event_card_block_blackShadow"></div>

                              <div className="eventCard_block">
                                <div
                                  className="eventCard_topCont_sec"
                                  onClick={() => handleIdClicked(item?.id)}
                                >
                                  <div className="event_dateName_row">
                                    <div className="event_name_left">
                                      <div className="event_date">
                                        {formatDate(item?.date?.from)}
                                      </div>
                                      <div className="event_name_mid">
                                        <h3>{item?.title}</h3>
                                        <div className="event_time">
                                          <i
                                            className="fa fa-clock-o"
                                            aria-hidden="true"
                                          ></i>{" "}
                                          &nbsp;&nbsp;{" "}
                                          {formatTimeUp(item?.time?.from)} to{" "}
                                          {formatTimeDown(item?.time?.to)}.
                                        </div>
                                      </div>
                                    </div>

                                    <div className="event_tag_cap">
                                      {item?.paymentStatus === "Free" && (
                                        <span className="color_capsul_chip green_chip">
                                          Free
                                        </span>
                                      )}

                                      {item?.paymentStatus === "Paid" && (
                                        <span className="color_capsul_chip brown_chip">
                                          Paid
                                        </span>
                                      )}
                                      {item?.recurringEvent && (
                                        <span className="color_capsul_chip pink_chip">
                                          Recurring
                                        </span>
                                      )}
                                      {item?.isCancelled && (
                                        <span className="color_capsul_chip pink_chip">
                                          Cancelled
                                        </span>
                                      )}

                                    </div>
                                  </div>
                                  <div className="address_user_row">
                                    <div className="event_address_block">
                                      <span className="event_add_icon">
                                        <i
                                          className="fa fa-map-marker"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                      <span className="event_address">
                                        {item?.venueDetails?.firstAddressLine}
                                      </span>
                                    </div>
                                    <div className="event_user_block">
                                      <div className="event_user_whiteText">
                                        <div className="event_user_img">
                                          <img src={item?.logoImage}></img>
                                        </div>
                                        <div className="event_user_details">
                                          {
                                            item?.postEventAsCommunity
                                            ? 
                                            <p>
                                              <b>{item?.community?.communityName}</b>  {" "}
                                              is inviting you for the event
                                            </p>
                                            :
                                            <p>
                                              <b>{item?.hostId}</b> 
                                              {/* as{" "}
                                              <b className="text_pink">
                                                {item?.role}
                                              </b> */}
                                              {" "}
                                              is inviting you for the event
                                            </p>
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="eventCard_fullRow_rsvp">
                                  <p>
                                    RSVP Date is very near. Please accept the
                                    event invitation.
                                  </p>
                                </div>
                                <div className="eventCard_bottom_sec">
                                  {item?.paymentStatus === "Paid" ? (
                                    <div className={`${item?.isCancelled ? "eventCard_bottom_btn eventCard_bottom_btn_3 disabled pointer_event_none": "eventCard_bottom_btn eventCard_bottom_btn_3"}`}>
                                      <button
                                        // disabled={item?.isCancelled}
                                        className="button_appearance_none btn_color_green"
                                        style={{
                                          display: item?.attendees
                                            ?.webvistorRestriction
                                            ? "block"
                                            : "none",
                                        }}
                                        onClick={() => payOffline(item)}
                                      >
                                        Pay Offline
                                      </button>
                                      {/* <button
                                          className="button_appearance_none btn_color_greenDeep"
                                          style={{
                                            display: item?.attendees
                                              ?.webvistorRestriction
                                              ? "block"
                                              : "none",
                                          }}
                                          onClick={openModalOpen}
                                        >
                                          Pay Online
                                        </button> */}
                                    </div>
                                  ) : (
                                    <div className={`${item?.isCancelled ? "eventCard_bottom_btn eventCard_bottom_btn_3 disabled pointer_event_none": "eventCard_bottom_btn eventCard_bottom_btn_3"}`}>
                                      <button
                                        // disabled={item?.isCancelled}
                                        className="button_appearance_none btn_color_green"
                                        style={{
                                          display: item?.attendees
                                            ?.webvistorRestriction
                                            ? "block"
                                            : "none",
                                        }}
                                        onClick={() => payOffline(item)}
                                      >
                                        Phone Verification
                                      </button>
                                    </div>
                                  )}
                                  {/* <div className="eventCard_bottom_btn eventCard_bottom_btn_2">
                                <button className="button_appearance_none btn_color_pink">
                                  Reject
                                </button>
                                <button className="button_appearance_none btn_color_green">
                                  Pay Offline
                                </button>
                              </div>
                              <div className="eventCard_bottom_btn eventCard_bottom_btn_2">
                                <button className="button_appearance_none btn_color_white btn_text_red">
                                  Supplies
                                </button>
                                <button className="button_appearance_none btn_color_white btn_text_green">
                                  Volunteer
                                </button>
                              </div>
                              <div className="eventCard_bottom_btn eventCard_bottom_btn_1">
                                <button className="button_appearance_none btn_color_green">
                                  <i
                                    className="fa fa-check-circle-o"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  &nbsp; Acceped
                                </button>
                              </div> */}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Modal: Name and phone number for RSVP */}
          {isModalOpen && (
            <div className="overlay">
              <div className="modalsss">
                <div className="modal-content">
                  <button
                    className="button_appearance_none modalClose_btn"
                    onClick={closeModal1}
                  >
                    {/* <i className="fa fa-times-circle" aria-hidden="true"></i> */}
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                  <div className="modal_text">
                    <h2>Please Enter Name & Mobile no for RSVP</h2>
                    <p>
                      Please verify your name and mobile no. to create RSVP for the event
                      as web visitor/Active user/Passive user
                    </p>
                  </div>
                  <div className="modal_form_block mt_10 mb_20">
                    <div className="registerd modal_flex_row modal_form_row">
                      <div className="modal_flex_box">
                        <select
                          className="input_appearance_none modal_input modal_input_select"
                          name="phoneCode"
                          value={phoneModal.phoneCode}
                          onChange={handlePhoneChange}
                        >
                          {dialCode &&
                            dialCode.map((dial, index) => (
                              <option key={index}>{dial.dialCode}</option>
                            ))}
                        </select>
                      </div>
                      <div className="modal_flex_box">
                        <input
                          className="input_appearance_none modal_input"
                          type="text"
                          placeholder="Enter the Registered number"
                          name="phone"
                          value={phoneModal.phone}
                          onChange={handlePhoneChange}
                        />
                      </div>
                    </div>
                    <div className="validation-container">
                      <div className="validation  form_field_error_msg error_text">{Errors?.phone}</div>
                    </div>
                    <div className="registerd modal_flex_row modal_form_row">
                      <div className="modal_flex_box">
                        <label>Name: </label>
                      </div>
                      <div className="modal_flex_box">
                        <input
                          className="input_appearance_none modal_input"
                          type="text"
                          placeholder="Enter your name"
                          name="name"
                          value={phoneModal.name}
                          onChange={handlePhoneChange}
                        />
                      </div>
                    </div>
                    <div className="validation-container">
                      <div className="validation form_field_error_msg error_text">{Errors?.name}</div>
                    </div>
                    <div className="registerd modal_flex_row modal_form_row">
                      <div className="modal_flex_box">
                        <label>Email: </label>
                      </div>
                      <div className="modal_flex_box">
                        <input
                          className="input_appearance_none modal_input"
                          type="email"
                          placeholder="Enter your email"
                          name="email"
                          value={phoneModal.email}
                          onChange={handlePhoneChange}
                        />
                      </div>
                    </div>
                    <div className="validation-container">
                      <div className="validation form_field_error_msg error_text">{Errors?.email}</div>
                    </div>
                  </div>

                  <div className="modal_footer">
                    <button
                      className="button_appearance_none modal_button_submit"
                      onClick={handleSend}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Verify OTP */}
          {showModal && (
            <div className="overlay">
              <div className="modalsss">
                <div className="modal-content">
                  <div className="modal_header">
                    <button
                      className="button_appearance_none modalClose_btn"
                      onClick={closeModal1}
                    >
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                    <h1>Please verify your OTP.</h1>
                  </div>
                  <div className="modal_body">
                    <div className="text">
                      <p>
                        Please verify your OTP to create RSVP for the event as
                        web visitor/Active user/Passive user
                      </p>
                    </div>
                    <div className="registerd modal_flex_row modal_form_row">
                      <div className="modal_flex_box">
                        <div className="otp-input-container ">
                            <input
                            className="input_appearance_none modal_input otp_input"
                            type="text"
                            placeholder="Enter OTP number"
                            name="otp"
                            onChange={handleChangeotp}
                            value={otp}
                            // width="20px"
                          />
                          {/* <input
                            className="input_appearance_none modal_input otp_input"
                            type="text"
                            placeholder="Enter OTP number"
                            onChange={handleChangeotp}
                          /> */}
                          {/* <OTPInput
                            className="button_appearance_none otp_input"
                            name="otp"
                            value={otp}
                            onChange={handleChangeotp}
                            autoFocus
                            numInputs={6} // Specify the length of the OTP
                            renderInput={(props) => <input {...props} />}
                            otpType="password"
                            disabled={false} // Set to true if you want to disable OTP input
                            secure
                          /> */}
                        </div>
                        <div className="validation-container">
                          <div className="validation form_field_error_msg error_text">{Errors?.otp}</div>
                        </div>
                        <div className="captcha_block mt_20 flex flex_center">
                          <ReCAPTCHA
                            style={{ margin: "0 auto 30px" }}
                            sitekey={TEST_SITE_KEY}
                            onChange={handleChange}
                            asyncScriptOnLoad={asyncScriptOnLoad}
                            ref={captchaRef}
                          />
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  <div className="modal_footer">
                    <button
                      className="button_appearance_none modal_button_submit"
                      id="otp"
                      onClick={handleotpsubmit}
                    >
                      Submit Otp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Confirm RSVP and Payment */}
          {showpackageModal &&
            (Guests ? (
              // Choose Attendees Types (Seniors, Adults and children) , Get's open only after package selection
              <div className="overlay">
                <div className="modalsss">
                  <div className="modal-content">
                    <div className="modal_header">
                      <button
                        className="button_appearance_none modalClose_btn"
                        onClick={closeModal1}
                      >
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </button>
                      <h2>Do you want to confirm your RSVP & payments?.</h2>
                    </div>

                    <div className="modal_body">
                      <h3 className="attendaceCount_block_title">
                        Attendees Count
                      </h3>
                      <div className="count_row count_block_row">
                        <div className="count_block_left">
                          <h3 className="text_white">Seniors</h3>
                        </div>
                        <div className="count_block_right countBlock">
                          <button
                            className="button_appearance_none count_btn btn_color_pink"
                            onClick={decreaseSeniorsCount}
                          >
                            <i
                              className="fa fa-minus-square"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <input
                            className="input_appearance_none countInput"
                            value={seniorsCount}
                          />
                          <button
                            className={`button_appearance_none count_btn btn_color_green ${totalCount >=
                              (allEvents &&
                                allEvents
                                  .filter((event) => event?.id === Id)
                                  .map(
                                    (events) =>
                                      events?.attendees?.numberOfMaxGuests
                                  )[0])
                              ? "disabled"
                              : ""
                              }`}
                            onClick={increaseSeniorsCount}
                          >
                            <i
                              className="fa fa-plus-square"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      </div>
                      <div className="count_row count_block_row">
                        <div className="count_block_left">
                          <h3 className="text_white">Adults</h3>
                        </div>
                        <div className="count_block_right countBlock">
                          <button
                            className="button_appearance_none count_btn btn_color_pink"
                            onClick={decreaseAdultsCount}
                          >
                            <i
                              className="fa fa-minus-square"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <input
                            className="input_appearance_none countInput"
                            value={adultsCount}
                          />
                          <button
                            className={`button_appearance_none count_btn btn_color_green ${totalCount >=
                              (allEvents &&
                                allEvents
                                  .filter((event) => event?.id === Id)
                                  .map(
                                    (events) =>
                                      events?.attendees?.numberOfMaxGuests
                                  )[0])
                              ? "disabled"
                              : ""
                              }`}
                            onClick={increaseAdultsCount}
                          >
                            <i
                              className="fa fa-plus-square"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      </div>
                      <div className="count_row count_block_row">
                        <div className="count_block_left">
                          <h3 className="text_white">Childrens</h3>
                        </div>
                        <div className="count_block_right countBlock">
                          <button
                            className="button_appearance_none count_btn btn_color_pink"
                            onClick={decreaseChildrenCount}
                          >
                            <i
                              className="fa fa-minus-square"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <input
                            className="input_appearance_none countInput"
                            value={childrenCount}
                          />
                          <button
                            className={`button_appearance_none count_btn btn_color_green ${totalCount >=
                              (allEvents &&
                                allEvents
                                  .filter((event) => event?.id === Id)
                                  .map(
                                    (events) =>
                                      events?.attendees?.numberOfMaxGuests
                                  )[0])
                              ? "disabled"
                              : ""
                              }`}
                            onClick={increaseChildrenCount}
                          >
                            <i
                              className="fa fa-plus-square"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                      </div>
                      {perHeadError ? (
                      <div className="count_row count_block_row" style={{ color: "red" }}>
                        {" "}
                        You have only selected package for{" "}
                        {Object.values(packageCounts)[0]} person{" "}
                      </div>
                    ) : (
                      ""
                    )}
                    {
                      totalCount >= maximumGuest ? <div  className="count_row count_block_row" style={{ color: 'red' }}> Max no of guest allowed per member: {maximumGuest} </div> : ''
                    }
                    </div>
                    
                    <div className="modal_footer">
                      <button
                        className="button_appearance_none modal_button_submit"
                        onClick={handleConfirm}
                      >
                        Yes, confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // If Payment status is free: Show Attenedees, else Payment status is paid: show packages (multiple or per head)
              // In case of free this will execute, when clicked for phone verificaiton
              <div className="overlay">
                <div className="modalsss">
                  <div className="modal-content">
                    <div className="modal_header">
                      <button
                        className="button_appearance_none modalClose_btn"
                        onClick={closeModal1}
                      >
                        <i className="fa fa-times" aria-hidden="true"></i>
                      </button>
                      <h2>Do you want to confirm your RSVP & payments ?</h2>
                    </div>

                    {/* Show Attendees */}
                    {paymentStatus === "Free" && (
                      <div className="modal_body">
                        <h3 className="attendaceCount_block_title">
                          Attendees Count
                        </h3>
                        <div className="count_row count_block_row">
                          <div className="count_block_left">
                            <h3 className="text_white">Seniors</h3>
                          </div>
                          <div className="count_block_right countBlock">
                            <button
                              className="button_appearance_none count_btn btn_color_pink"
                              onClick={decreaseSeniorsCount}
                            >
                              <i
                                className="fa fa-minus-square"
                                aria-hidden="true"
                              ></i>
                            </button>
                            <input
                              className="input_appearance_none countInput"
                              value={seniorsCount}
                            />
                            <button
                              className={`button_appearance_none count_btn btn_color_green ${totalCount >=
                                (allEvents &&
                                  allEvents
                                    .filter((event) => event?.id === Id)
                                    .map(
                                      (events) =>
                                        events?.attendees?.numberOfMaxGuests
                                    )[0])
                                ? "disabled"
                                : ""
                                }`}
                              onClick={increaseSeniorsCount}
                            >
                              <i
                                className="fa fa-plus-square"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </div>
                        <div className="count_row count_block_row">
                          <div className="count_block_left">
                            <h3 className="text_white">Adults</h3>
                          </div>
                          <div className="count_block_right countBlock">
                            <button
                              className="button_appearance_none count_btn btn_color_pink"
                              onClick={decreaseAdultsCount}
                            >
                              <i
                                className="fa fa-minus-square"
                                aria-hidden="true"
                              ></i>
                            </button>
                            <input
                              className="input_appearance_none countInput"
                              value={adultsCount}
                            />
                            <button
                              className={`button_appearance_none count_btn btn_color_green ${totalCount >=
                                (allEvents &&
                                  allEvents
                                    .filter((event) => event?.id === Id)
                                    .map(
                                      (events) =>
                                        events?.attendees?.numberOfMaxGuests
                                    )[0])
                                ? "disabled"
                                : ""
                                }`}
                              onClick={increaseAdultsCount}
                            >
                              <i
                                className="fa fa-plus-square"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </div>
                        <div className="count_row count_block_row">
                          <div className="count_block_left">
                            <h3 className="text_white">Childrens</h3>
                          </div>
                          <div className="count_block_right countBlock">
                            <button
                              className="button_appearance_none count_btn btn_color_pink"
                              onClick={decreaseChildrenCount}
                            >
                              <i
                                className="fa fa-minus-square"
                                aria-hidden="true"
                              ></i>
                            </button>
                            <input
                              className="input_appearance_none countInput"
                              value={childrenCount}
                            />
                            <button
                              className={`button_appearance_none count_btn btn_color_green ${totalCount >=
                                (allEvents &&
                                  allEvents
                                    .filter((event) => event?.id === Id)
                                    .map(
                                      (events) =>
                                        events?.attendees?.numberOfMaxGuests
                                    )[0])
                                ? "disabled"
                                : ""
                                }`}
                              onClick={increaseChildrenCount}
                            >
                              <i
                                className="fa fa-plus-square"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </div>

                        {perHeadError ? (
                      <div className="count_row count_block_row" style={{ color: "red" }}>
                        {" "}
                        You have only selected package for{" "}
                        {Object.values(packageCounts)[0]} person{" "}
                      </div>
                    ) : (
                      ""
                    )}
                    {
                      totalCount >= maximumGuest ? <div  className="count_row count_block_row" style={{ color: 'red' }}> Max no of guest allowed per member: {maximumGuest} </div> : ''
                    }
                  {/* 
                    <div className="count_row count_block_row">
                      <div className="count_block_left">
                        <h3 className="text_pink">Seniors</h3>
                      </div>
                      <div className="count_block_right countBlock">
                        <button className="button_appearance_none count_btn btn_color_pink" >
                          <i className="fa fa-minus-square" aria-hidden="true"></i>
                        </button>
                        <input className="input_appearance_none countInput" />
                        <button className="button_appearance_none count_btn btn_color_green" >
                          <i className="fa fa-plus-square" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  */}
                      </div>
                    )}

                    {/* Show Packages */}
                    {paymentStatus === "Paid" && (
                      <div>
                        {allEvents &&
                          allEvents
                            .filter((events) => events?.id === Id)
                            .map(
                              (event) =>
                                event?.paymentPackages &&
                                event?.paymentPackages.map((items, index) => {
                                  return (
                                    <div key={index} class="attendaceCount_block" >
                                      <div className="outer-container">
                                        <div className="count_row count_block_row">
                                          <div className="packge_details">
                                            <p className="textLeft text_black"><span><b>Package Details:</b></span>{items?.description}</p>
                                          </div>
                                          <div className="count_block_left">
                                            <div class="packeg_block">
                                              <div className="img_box">
                                                <img
                                                  src={
                                                    items.packageLogo ||
                                                    "https://developmentmatrix.s3.ap-south-1.amazonaws.com/client1.png"
                                                  }
                                                  alt=""
                                                  className="count_block_img"
                                                ></img>
                                              </div>
                                              <div className="textbox_box">
                                                <h3
                                                  className={
                                                    formatPackage(
                                                      items.earlyBirdDate
                                                    )
                                                      ? "text_white"
                                                      : "text_white strikethrough"
                                                  }
                                                >
                                                  {formatPackage(
                                                    items.earlyBirdDate
                                                  )
                                                    ? `Actual price - INR ${items.packageRate}`
                                                    : `Actual price - INR ${items.packageRate}`}
                                                </h3>
                                                <h3 className="text_white">
                                                  {formatPackage(
                                                    items.earlyBirdDate
                                                  )
                                                    ? ""
                                                    : `Early bird price - INR ${items.earlyBirdRate}`}
                                                </h3>
                                                <h3 className="text_white">
                                                  {items.packageName}
                                                </h3>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="count_block_right countBlock">
                                            <button
                                              className="button_appearance_none count_btn btn_color_pink"
                                              onClick={() =>
                                                decreaseSingleCount(items.id)
                                              }
                                            >
                                              <i
                                                className="fa fa-minus-square"
                                                aria-hidden="true"
                                              ></i>
                                            </button>
                                            <span className="input_appearance_none countInput">
                                              {packageCounts[items?.id] || 0}
                                            </span>
                                            <button
                                              className="button_appearance_none count_btn btn_color_green "
                                              onClick={() =>
                                                increaseSingleCount(items.id)
                                              }
                                            >
                                              <i
                                                className="fa fa-plus-square"
                                                aria-hidden="true"
                                              ></i>
                                            </button>
                                          </div>
                                        </div>  
                                      </div>
                                    </div>
                                  )
                                })
                            )}
                      </div>
                    )}

                    {/* Confirm Button */}
                    {paymentStatus === "Free" ? (
                      <div className="modal_footer">
                        <div className="count_btn_row border_t_none">
                          <button
                            className="button_appearance_none modal_button_submit"
                            onClick={handleConfirm}
                          >
                            Yes, confirm
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="modal_footer">
                        <div className="count_btn_row border_t_none">
                          <button
                            className="button_appearance_none modal_button_submit"
                            onClick={handlePackage}
                          >
                            Yes, confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
          ))}
          
          {/* Past events and Donate Now Banner */}
          <div className="container">
            <div className="row">
              <div className="col-lg-12">

                {/* Past Event - Search, Prev and Next button */}
                <div className="list_sec list_sec_title">
                  <div className="sec_title_left">
                    <h3 className="secTitle">Past Events</h3>
                  </div>
                  <div className="sec_title_right">
                    <div className="sec_title_right_search">
                      <input
                        type="text"
                        placeholder="Search"
                        className="input_appearance_none search_filter_sec"
                        value={pastSearchTerm}
                        onChange={(event) => {
                          handleSearchTermForEvents(event, "past");
                        }}
                      ></input>
                      <button
                        type="submit"
                        className="button_appearance_none header_search_btn "
                      >
                        <img
                          src="/images/search_btn_icon.png"
                          className="search_btn_icon"
                        ></img>
                      </button>
                    </div>
                    <div className="sec_title_right_sliderBtn slide-list ">
                      <button
                        type="button"
                        data-role="none"
                        className={`slick-arrow slick-prev  ${pastEventCurrentPage === 1 ? 'disabled' : ''}`}
                        onClick={pastEventPrev}
                        disabled={pastEventCurrentPage === 1 ? true : false}
                      >
                        {" "}
                        Previous
                      </button>
                      <button
                        type="button"
                        data-role="none"
                        className={`slick-arrow slick-next  ${pastEventCurrentPage === pastEventMaxPage ? 'disabled' : ''}`}
                        onClick={pastEventNext}
                        disabled={
                          pastEventCurrentPage === pastEventMaxPage
                            ? true
                            : false
                        }
                      >
                        {" "}
                        Next
                      </button>
                    </div>
                  </div>
                </div>

                {/* Past Event - Event page and total count */}
                <div className="container mb_20">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="sec_title_right_col_black">
                        Page {pastEventCurrentPage} of {pastEventMaxPage} <b>Total:</b> {pastEventTotal}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Skeleton Loader ||  Past Event Lists */}
                {pastLoading ? (
                  <TableLoader />
                ) : pastEvents?.length === 0 ? (
                  <div className="no_data_card">No Past Event Found</div>
                ) : (
                  <div className="eventCard_list_bg">
                    {pastEvents &&
                      pastEvents?.map((item) => {
                        return (
                          <>
                            <div
                              className="eventCard_item"
                              style={{
                                backgroundImage: `url(${item?.image})`,
                                width: "100%",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                              }}
                            >
                              <div className="event_card_block_blackShadow"></div>

                              <div className="eventCard_block">
                                <div
                                  className="eventCard_topCont_sec"
                                  onClick={() => handleIdClicked(item?.id)}
                                >
                                  <div className="event_dateName_row">
                                    <div className="event_name_left">
                                      <div className="event_date">
                                        {formatDate(item?.date?.from)}
                                      </div>
                                      <div className="event_name_mid">
                                        <h3>{item?.title}</h3>
                                        <div className="event_time">
                                          <i
                                            className="fa fa-clock-o"
                                            aria-hidden="true"
                                          ></i>{" "}
                                          &nbsp;&nbsp;{" "}
                                          {formatTimeUp(item?.time?.from)} to{" "}
                                          {formatTimeDown(item?.time?.to)}.
                                        </div>
                                      </div>
                                    </div>

                                    <div className="event_tag_cap">
                                      {item?.paymentStatus === "Free" && (
                                        <span className="color_capsul_chip green_chip">
                                          Free
                                        </span>
                                      )}

                                      {item?.paymentStatus === "Paid" && (
                                        <span className="color_capsul_chip brown_chip">
                                          Paid
                                        </span>
                                      )}
                                      {item?.recurringEvent && (
                                        <span className="color_capsul_chip pink_chip">
                                          Recurring
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="address_user_row">
                                    <div className="event_address_block">
                                      <span className="event_add_icon">
                                        <i
                                          className="fa fa-map-marker"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                      <span className="event_address">
                                        {item?.venueDetails?.firstAddressLine}
                                      </span>
                                    </div>
                                    <div className="event_user_block">
                                      <div className="event_user_whiteText">
                                        <div className="event_user_img">
                                          <img src={item?.logoImage}></img>
                                        </div>
                                        <div className="event_user_details">
                                        {
                                            item?.postEventAsCommunity
                                            ? 
                                            <p>
                                              <b>{item?.community?.communityName}</b>  {" "}
                                              is inviting you for the event
                                            </p>
                                            :
                                            <p>
                                              <b>{item?.hostId}</b> as
                                              {/* {" "}
                                              <b className="text_pink">
                                                {item?.role}
                                              </b> */}
                                              {" "}
                                              is inviting you for the event
                                            </p>
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  {showReminder && (
                                    <div className="eventCard_fullRow_rsvp">
                                      <p>
                                        RSVP Date is very near. Please accept
                                        the event invitation.
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <div className="eventCard_bottom_sec">
                                  {/* <div className="eventCard_bottom_btn eventCard_bottom_btn_2">
                              <button className="button_appearance_none btn_color_pink">
                                Reject
                              </button>
                              <button className="button_appearance_none btn_color_green">
                                Pay Offline
                              </button>
                            </div>
                            <div className="eventCard_bottom_btn eventCard_bottom_btn_2">
                              <button className="button_appearance_none btn_color_white btn_text_red">
                                Supplies
                              </button>
                              <button className="button_appearance_none btn_color_white btn_text_green">
                                Volunteer
                              </button>
                            </div>
                            <div className="eventCard_bottom_btn eventCard_bottom_btn_1">
                              <button className="button_appearance_none btn_color_green">
                                <i
                                  className="fa fa-check-circle-o"
                                  aria-hidden="true"
                                ></i>{" "}
                                &nbsp; Acceped
                              </button>
                            </div> */}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                )}

                {/* Donate Now Banner */}
                <div className="card mt-5 mb-5 donate_banner_bg">
                  <div className="donate_now_btn_wrap">
                    <div className="eventCard_bottom_btn eventCard_bottom_btn_3">
                      <button
                        className="button_appearance_none btn_color_greenDeep"
                        onClick={() => {
                          setDonateNowView(true);
                        }}
                      >
                        Donate Now
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
        </div>
      )}
    </>
  );
};
export default Event;



/*
Component Insights:

1. Package Modal is open only when pay offline button is clicked.
2. Depending on the event, package modal can display package wise or per head list.
3. Early bird access: Means price drop than actual price
4. Only in upcomming events we have the option to pay.
5. Once package is selected, need to select attendee types.
*/


