import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";
import About from "../AboutUs/[id]";
import {
  GET_MY_COMMUNITY_SETTINGS,
  GetAllUploadImage,
  GetBolgsById,
  GetCommunityBlogs,
  getMyCommunityEventByID,
  Countrydialcode,
  GetPhoneNumber,
  GetOtpVerification,
  GetPackageVerification,
} from "../api/queries";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import OTPInput from "react-otp-input";
import "react-phone-input-2/lib/style.css";
import api from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import Slider from "react-slick";
import ImageModal from "../components/ImageModal";
import TableLoader from "../../util/TableLoader";

export default function EventDetails(props) {
  const router = useRouter();
  const [textColor, setTextColor] = useState(null || "");
  const [headerFonts, setheaderFonts] = useState(null || "");
  const [headerFontSizes, setheaderFontSizes] = useState(null || "");
  const [activeTab, setActiveTab] = useState("pictures");
  const [data, setData] = useState("");
  const [eventPicture, setEventPicture] = useState("");
  const [eventBlogs, setEventBlogs] = useState("");
  const [storeData, setStoredData] = useState("");
  const [eventShow, setEventShow] = useState(false);
  const [blogData, setBlogData] = useState("");
  /*   added new logic  */
  const [seniorsCount, setSeniorsCount] = useState(0);
  const [adultsCount, setAdultsCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [packageCounts, setPackageCounts] = useState({});
  const [ModalOpen, setModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackageIds, setSelectedPackageIds] = useState([]);
  const [dialCode, setDialcode] = useState("" || null);
  const [otpToken, setotpToken] = useState("" || null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [Guests, setGuests] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [perHeadError, setPerHeadError] = useState(false);
  const [perHeadPackageError, setPerHeadPackageError] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [earlyBirdDiscount, setEarlyBirdDiscount] = useState(false);

  console.log("packageCounts---->", packageCounts);
  const intialPhoneModalValue = {
    phone: "",
    phoneCode: "+91",
    name: "",
    email: "",
  };
  const [phoneModal, setPhoneModal] = useState(intialPhoneModalValue);
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
    name: "",
    email: "",
  };
  const [Errors, setErrors] = useState(intialErrorsValue);

  const upcomingQuerySearchTerm = router?.query?.upsearch;
  const pastQuerySearchTerm = router?.query?.ppsearch;

  const TEST_SITE_KEY = "6Lcx50MlAAAAABOOZwoO-aZ0JW2k0Vx0c6Y84ElV";
  const captchaRef = useRef(null);
  /*   end new logic  */

  const viewDetails = async (id) => {
    if (id) {
      const response = await api.post("", {
        query: GET_MY_COMMUNITY_SETTINGS,
        variables: {
          data: {
            slug: id,
          },
        },
      });

      if (response?.data?.data?.getMyCommunitiesSettingsView?.code != 200) {
        router.push("/");
      }
      setTextColor(
        response?.data?.data?.getMyCommunitiesSettingsView?.data?.textColor ||
          ""
      );
      setheaderFonts(
        response?.data?.data?.getMyCommunitiesSettingsView?.data?.headerFont ||
          ""
      );
      setheaderFontSizes(
        response?.data?.data?.getMyCommunitiesSettingsView?.data
          ?.headerFontSize || ""
      );
      document.body.style.backgroundColor =
        response?.data?.data?.getMyCommunitiesSettingsView?.data?.backgroupColor;
    }
  };

  const eventDetails = async (id) => {
    if (id) {
      const response = await api.post("", {
        query: getMyCommunityEventByID,
        variables: {
          getMyCommunityEventByIdId: id,
        },
      });
      console.log("````````````````````````");
      console.log(
        "Community Event Information: ",
        response?.data?.data?.getMyCommunityEventByID?.data
      );
      console.log("```````````````````````````");
      setData(response?.data?.data?.getMyCommunityEventByID?.data);
    }
  };

  const eventPictures = async (id) => {
    if (id) {
      const response = await api.post("", {
        query: GetAllUploadImage,
        variables: {
          data: {
            eventId: id,
            imageApprove: true,
            imageStatus: true,
          },
        },
      });
      console.log(
        response?.data?.data?.getAllUploadImage?.data?.images,
        "images------"
      );

      setEventPicture(response?.data?.data?.getAllUploadImage?.data?.images);
    }
  };

  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas);
      eventDetails(router?.query?.id && router?.query?.id);
      eventPictures(router?.query?.id && router?.query?.id);
    }
  }, [router]);

  useEffect(() => {
    var data = JSON.parse(localStorage?.getItem("storeData"));
    setStoredData(data);
    getAllBlogList();
  }, [router]);

  // get All blogs List
  const getAllBlogList = async () => {
    if (storeData?.communityId) {
      console.log("blog event id",router?.query?.id && router?.query?.id);
      
      const response = await api.post("", {
        query: GetCommunityBlogs,
        variables: {
          data: {
            eventId: router?.query?.id && router?.query?.id,
            blogCategory: "Public",
            blogStatus: true,
          },
        },
      });
      if (response.status === 200) {
        console.log("response for blog", response);
        setEventBlogs(response?.data?.data?.getAllBlogs?.data?.blogs);
      }
    }
  };

  const readMore = async (id) => {
    setEventShow(true);
    getAllBlogListById(id);
  };

  const offReadMore = async (id) => {
    setEventShow(false);
  };

  const getAllBlogListById = async (id) => {
    if (storeData?.communityId) {
      setLoading(true);
      const response = await api.post("", {
        query: GetBolgsById,
        variables: {
          data: {
            blogId: id,
          },
        },
      });
      if (response.status === 200) {
        setBlogData(response?.data?.data?.getBolgsById?.data);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === "blogs") {
      getAllBlogList();
    }
  }, [activeTab]);

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

  // converting date format:
  const formatDate = (dateString) => {
    var date = new Date(dateString),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [mnth, day, date.getFullYear()].join("-");
  };
  /* --- slick slider ---- start --- */
  /* --- new logic ---- start --- */
  const parseHtml = (desc) => {
    if (typeof DOMParser !== "undefined") {
      const doc = new DOMParser().parseFromString(desc, "text/html");
      const plainText = doc?.body?.textContent || "";
      return plainText;
    } else {
      console.error("DOMParser is not available in this environment.");
      return "";
    }
  };
  const decreaseSeniorsCount = () => {
    if (data.paymentCategory == "per_head") {
      setPerHeadError(false);
    }
    setPerHeadPackageError(false);
    setSeniorsCount(seniorsCount > 0 ? seniorsCount - 1 : 0);
  };

  const increaseSeniorsCount = () => {
    if (
      data.paymentCategory == "per_head" &&
      seniorsCount + adultsCount + childrenCount >=
        parseInt(Object.values(packageCounts)[0])
    ) {
      setPerHeadError(true);
    } else if (
      seniorsCount + adultsCount + childrenCount >=
      parseInt(data?.attendees?.numberOfMaxGuests)
    ) {
      setPerHeadPackageError(true);
    } else {
      setPerHeadError(false);
      setSeniorsCount(seniorsCount + 1);
    }
  };

  const decreaseAdultsCount = () => {
    if (data.paymentCategory == "per_head") {
      setPerHeadError(false);
    }
    setPerHeadPackageError(false);
    setAdultsCount(adultsCount > 0 ? adultsCount - 1 : 0);
  };

  const increaseAdultsCount = () => {
    if (
      data.paymentCategory == "per_head" &&
      adultsCount + seniorsCount + childrenCount >=
        parseInt(Object.values(packageCounts)[0])
    ) {
      setPerHeadError(true);
    } else if (
      seniorsCount + adultsCount + childrenCount >=
      parseInt(data?.attendees?.numberOfMaxGuests)
    ) {
      setPerHeadPackageError(true);
    } else {
      setPerHeadError(false);
      setAdultsCount(adultsCount + 1);
    }
  };

  const decreaseChildrenCount = () => {
    if (data.paymentCategory == "per_head") {
      setPerHeadError(false);
    }
    setPerHeadPackageError(false);
    setChildrenCount(childrenCount > 0 ? childrenCount - 1 : 0);
  };

  const increaseChildrenCount = () => {
    if (
      data.paymentCategory == "per_head" &&
      childrenCount + seniorsCount + adultsCount >=
        parseInt(Object.values(packageCounts)[0])
    ) {
      setPerHeadError(true);
    } else if (
      seniorsCount + adultsCount + childrenCount >=
      parseInt(data?.attendees?.numberOfMaxGuests)
    ) {
      setPerHeadPackageError(true);
    } else {
      setPerHeadError(false);
      setChildrenCount(childrenCount + 1);
    }
  };
  const totalCount = seniorsCount + adultsCount + childrenCount;

  const decreaseCount = (id, rate) => {
    if (data.paymentCategory == "per_head") {
      setPerHeadPackageError(false);
    }

    if (!!Math.max(packageCounts[id] || 0, 0)) {
      setTotalAmount((total) => total - rate);
      setPackageCounts((prevCounts) => ({
        ...prevCounts,
        [id]: Math.max((prevCounts[id] || 0) - 1, 0),
      }));
      updateSelectedPackages(id);
    }
  };

  const increaseCount = (id, rate) => {
    if (
      data.paymentCategory == "per_head" &&
      Object.values(packageCounts).reduce(
        (partialSum, a) => partialSum + a,
        0
      ) >= parseInt(data?.attendees?.numberOfMaxGuests)
    ) {
      setPerHeadPackageError(true);
    } else {
      setPerHeadPackageError(false);
      setPackageCounts((prevCounts) => ({
        ...prevCounts,
        [id]: (prevCounts[id] || 0) + 1,
      }));
      setTotalAmount((total) => total + rate);
      updateSelectedPackages(id);
    }
    console.log(packageCounts, "packageee");
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

  const closeModal1 = () => {
    setIsModalOpen(false);
    setShowModal(false);
    setGuests(false);
    setPhoneModal(intialPhoneModalValue);
    setOtp("");
    setSeniorsCount(0);
    setAdultsCount(0);
    setChildrenCount(0);
    setPackageCounts({});
    setTotalAmount(0);
    setErrors(intialErrorsValue);
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

  const fetchPackage = async () => {
    try {
      const response = await api.post("", {
        query: GetPackageVerification,
        variables: {
          data: {
            eventId: data?.id,
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
          toast.success(response?.data?.data?.acceptOrRejectOrgEvent?.message);
          eventDetails(router?.query?.id && router?.query?.id);
        } else {
          toast.error(response?.data?.data?.acceptOrRejectOrgEvent?.message);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const payOffline = () => {
    setPerHeadError(false);
    setGuests(true);
  };

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

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneCode" || name === "name") {
      setPhoneModal((prevPhoneModal) => ({
        ...prevPhoneModal,
        [name]: value,
      }));
    } else {
      if (name === "email") {
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
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorForThis }));
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
      var isValidInput = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(
        phoneModal.email
      );
      var errorForThis = "Please provide proper Email Id";
      if (isValidInput === false) {
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
              eventId: data?.id,
            },
          },
        });
        if (response.status === 200) {
          if (response?.data?.data?.webVisitorPhoneVerify?.error === false) {
            toast.success(response?.data?.data?.webVisitorPhoneVerify?.message);
            setotpToken(
              response?.data?.data?.webVisitorPhoneVerify?.data?.token
            );
            setShowModal(true);
          } else {
            closeModal1();
            toast.error(response?.data?.data?.webVisitorPhoneVerify?.message);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPhone();
    setIsModalOpen(false);
  };

  const handleChangeotp = (event) => {
    setOtp(event.target.value);

    setErrors((prevErrors) => ({ ...prevErrors, otp: "" }));
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

  const openModalOpen = () => {
    setModalOpen(true);
  };
  const closeModel = () => {
    setModalOpen(false);
  };

  const handleConfirm = () => {
    setIsModalOpen(true);
    setGuests(false);
  };

  const handleIdClicked = (id) => {
    let query = {};
    if (router?.query?.up) {
      query.up = router?.query?.up;
    }
    if (router?.query?.pp) {
      query.pp = router?.query?.pp;
    }
    if (upcomingQuerySearchTerm) {
      query.upsearch = upcomingQuerySearchTerm;
    }
    if (pastQuerySearchTerm) {
      query.ppsearch = pastQuerySearchTerm;
    }

    router.push({
      pathname: `/${router.query.cummunity_slug}/Events`,
      query: query,
    });
  };

  var eventlist = {
    arrows: true,
    dots: false,
    speed: 500,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1366,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // ---   slider script -- start --
  const trainingvideos = {
    autoplay: true,
    arrows: true,
    dots: true,
    infinite: true,
    initialSlide: 0,
    slidesToShow: 3,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  // ---   slider script -- end --

  // ---   slider script -- start --
  const sliderBlogGallery = {
    autoplay: true,
    arrows: true,
    dots: true,
    infinite: true,
    initialSlide: 0,
    slidesToShow: 3,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  // ---   slider script -- end --

  return (
    <>
      {/* Header component */}
      <Header />

      {/* Banner inner new start ---  */}
      <div
        className="banner_inner_sec inner_banner_event"
        style={{
          // backgroundImage: `url(${blogData?.thumbnailImage})`,
          backgroundImage: `url(${data?.image})`,
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="banner_inner_block">
                <div className="banner_inner_tagSec">
                  <span className="color_capsul_chip color_capsul_chip_big green_chip">
                    {data?.paymentStatus}
                  </span>
                  {data?.paymentStatus == "Paid" &&
                  data.paymentCategory == "per_head" ? (
                    <span className="color_capsul_chip color_capsul_chip_big brown_chip">
                      Per Head Payment
                    </span>
                  ) : (
                    ""
                  )}
                  {data?.paymentStatus == "Paid" &&
                  data.paymentCategory == "package_wise" ? (
                    <span className="color_capsul_chip color_capsul_chip_big brown_chip">
                      Package Wise Payment
                    </span>
                  ) : (
                    ""
                  )}

                  {data?.recurringEvent && (
                    <span className="color_capsul_chip color_capsul_chip_big pink_chip">
                      Recurring
                    </span>
                  )}
                  <span className="color_capsul_chip color_capsul_chip_big blue_green_chip">
                    {data?.attendees?.webvistorRestriction
                      ? data?.attendees?.remainingNumberOfWebVisitors
                      : data?.attendees?.remainingNumberOfAttendees}{" "}
                    Available seats
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Banner inner new end ---  */}

      {/* Banner-bottom new start ---  */}
      <div className="banner_inner_bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="banner_inner_bottom_block">
                <div className="big_date_card">
                  <span>{new Date(data?.time?.from).getDate()}</span>{" "}
                  <span>
                    {new Date(data?.time?.from).toLocaleString("default", {
                      month: "long",
                    })}
                  </span>{" "}
                  <span>{new Date(data?.time?.from).getFullYear()}</span>
                </div>
                <div className="time_card">
                  <div className="event_time">
                    <i className="fa fa-clock-o" aria-hidden="true"></i>{" "}
                    &nbsp;&nbsp; {formatTimeUp(new Date(data?.time?.from))} to{" "}
                    {formatTimeDown(new Date(data?.time?.to))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Banner-bottom new end ---  */}
< ToastContainer/>
      {/* event details User -- new start ---  */}
      <section className="inner_page_sec innerPage_eventDetails">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="eventDetails_top">
                <div className="event_admin">
                  <div className="event_admin_img">
                    <img src={data?.logoImage} alt="" />
                  </div>
                  <div className="event_admin_name">
                    <b>{data?.hostId}</b> is Posted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* event details User -- new end ---  */}

      {/* event details Title / Description -- new start ---  */}
      <section className="inner_page_sec innerPage_eventDetails">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="eventDetails_title">
                <h2>{data?.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: data?.description }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* event details Title / Description -- new end ---  */}

      {/* event details Map / Section -- new start ---  */}
      <section className="inner_page_sec event_detailsMap_sec">
        <div className="container">
          <div className="event_detailsMap_block">
            <div className="row">
              <div className="col-lg-6">
                <div className="eventDetails_host_block">
                  <div className="eventDetails_row">
                    <div className="eventDet_left">Event Host :</div>
                    <div className="eventDet_right">{data?.hostId}</div>
                  </div>
                  {data?.venueDetails?.phoneNo && (
                    <div className="eventDetails_row">
                      <div className="eventDet_left">Phone no. :</div>
                      <div className="eventDet_right">
                        {data?.venueDetails?.phoneNo}
                      </div>
                    </div>
                  )}

                  <div className="eventDetails_row">
                    <div className="eventDet_left">
                      {data?.attendees?.webvistorRestriction
                        ? "Web Visitors"
                        : "Attendees"}{" "}
                      Limit :
                    </div>
                    <div className="eventDet_right">
                      {data?.attendees?.webvistorRestriction
                        ? data?.attendees?.numberOfMaxWebVisitors
                        : data?.attendees?.numberOfMaxAttendees}
                    </div>
                  </div>

                  <div className="eventDetails_row">
                    <div className="eventDet_left">
                      No of{" "}
                      {data?.attendees?.webvistorRestriction
                        ? "Web Visitors"
                        : "Attendees"}{" "}
                      RSVP’d :
                    </div>
                    <div className="eventDet_right">
                      {data?.attendees?.webvistorRestriction
                        ? data?.attendees?.numberOfMaxWebVisitors -
                          data?.attendees?.remainingNumberOfWebVisitors
                        : data?.attendees?.numberOfMaxAttendees -
                          data?.attendees?.remainingNumberOfAttendees}
                    </div>
                  </div>

                  <div className="eventDetails_row">
                    <div className="eventDet_left">
                      Remaining of{" "}
                      {data?.attendees?.webvistorRestriction
                        ? "Web Visitors"
                        : "Attendees"}{" "}
                      Allowed :
                    </div>
                    <div className="eventDet_right">
                      {data?.attendees?.webvistorRestriction
                        ? data?.attendees?.remainingNumberOfWebVisitors
                        : data?.attendees?.remainingNumberOfAttendees}
                    </div>
                  </div>

                  <div className="eventDetails_row">
                    <div className="eventDet_left">
                      Number of Maximum Guest Per Member :
                    </div>
                    <div className="eventDet_right">
                      {data?.attendees?.numberOfMaxGuests}
                    </div>
                  </div>

                  <div className="eventDetails_row">
                    <div className="eventDet_left">Location :</div>
                    <div className="eventDet_right">
                      {data?.venueDetails?.firstAddressLine},{" "}
                      {data?.venueDetails?.secondAddressLine},{" "}
                      {data?.venueDetails?.city}, {data?.venueDetails?.state},{" "}
                      {data?.venueDetails?.country},{" "}
                      {data?.venueDetails?.zipcode},{" "}
                      {data?.venueDetails?.phoneCode},{" "}
                      {data?.venueDetails?.phoneNo}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="eventDetails_map">
                  {data?.venueDetails?.latitude &&
                    data?.venueDetails?.longitude && (
                      <iframe
                        className="map_event"
                        width="100%"
                        height="450"
                        src={`https://maps.google.com/maps?q=${data.venueDetails.latitude},${data.venueDetails.longitude}&z=14&output=embed`}
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* event details Map / Section -- new end ---  */}

      {/* event details Packeg section -- new start ---  */}
      {data?.paymentPackages?.length != 0 && !data?.isCancelled && (
        <section className="inner_page_sec event_detailsPackeg_sec" style={{marginBottom: "1rem"}}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="slide-list event-list slide_card event_detailsPackeg_title">
                  <h3
                    style={{
                      color: textColor,
                      fontFamily: headerFonts,
                      fontSize: headerFontSizes,
                    }}
                  >
                    Event package
                  </h3>
                  {/* <h6>6 of 3 package selected</h6> */}
                </div>
              </div>
              <div className="col-lg-4"></div>
            </div>

            <div className="event_detailsPackeg_block">
              <div className="row">
                <div className="col-lg-8">
                  {/* package details big card start */}
                  {data?.paymentPackages?.length != 0 &&
                    data.paymentPackages?.map((pack, index) => (
                      <div className="packegFull_card" key={index}>
                        <div className="packeg_name_row">
                          {pack?.packageLogo &&
                          <div className="pack_img">
                            <img
                              className="packImg_icon pack_img"
                              src={pack?.packageLogo}
                              style={{borderRadius:"100%"}}
                              alt=""
                            />
                          </div>
                          }
                          
                          <div className="packName">
                            <h4>{pack?.packageName}</h4>
                            {pack?.earlyBirdDate &&
                            <div className="tooltip-container">
                              <div className="exclamation-icon">!</div>
                              <div className="tooltip-text">
                                {pack?.earlyBirdDate && (
                                  <p>
                                    Early bird date:{" "}
                                    {new Intl.DateTimeFormat("default", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: false,
                                      timeZone:
                                        Intl.DateTimeFormat().resolvedOptions()
                                          .timeZone,
                                    }).format(
                                      new Date(
                                        parseInt(pack?.earlyBirdDate, 10)
                                      )
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                            }
                          </div>
                        </div>

                        <div className="packeg_details_row">
                          <div className="packeg_description">
                            <p>{pack?.description && pack?.description}</p>
                          </div>
                        </div>
                        <div className="packeg_details_row">
                          <div className="packegPrice_row">
                            <div className="packegPrice">
                              {new Date(parseInt(pack?.earlyBirdDate, 10)) >
                              new Date() ? (
                                <>
                                  <span className="mainPrice">
                                    Price: ₹{pack?.earlyBirdRate}
                                  </span>{" "}
                                  <span className="discountPrice">
                                    ₹{pack?.packageRate}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="mainPrice">
                                    Price: ₹{pack?.packageRate}
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="packegnumber">
                              <div className="counter-container">
                                <button
                                  className="counter-btn"
                                  onClick={() =>
                                    decreaseCount(
                                      pack?.id,
                                      pack?.earlyBirdDate === null
                                        ? pack?.packageRate
                                        : moment(
                                            new Date(
                                              parseInt(pack?.earlyBirdDate, 10)
                                            )
                                          ).isBefore(new Date())
                                        ? pack?.packageRate
                                        : pack?.earlyBirdRate
                                    )
                                  }
                                >
                                  −
                                </button>
                                <div className="counter-value" id="counter">
                                  {packageCounts[pack?.id] || 0}
                                </div>
                                <button
                                  className="counter-btn"
                                  onClick={() => {
                                    increaseCount(
                                      pack?.id,
                                      pack?.earlyBirdDate === null
                                        ? pack?.packageRate
                                        : moment(
                                            new Date(
                                              parseInt(pack?.earlyBirdDate, 10)
                                            )
                                          ).isBefore(new Date())
                                        ? pack?.packageRate
                                        : pack?.earlyBirdRate
                                    );
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* package details big card end */}
                </div>
                <div className="col-lg-4">
                  <div className="bookingSummery_block"  >
                    <h4>Booking Summary</h4>
                    <div className="booking_table">
                      <table>
                        <tbody>
                          {Object.entries(packageCounts).map(
                            ([packageId, quantity]) => {
                              const pack = data.paymentPackages.find(
                                (p) => p.id === packageId
                              );
                              if (!pack) return null;

                              const now = new Date();
                              const earlyBirdDeadline = new Date(
                                parseInt(pack.earlyBirdDate, 10)
                              );
                              const isEarlyBird = now < earlyBirdDeadline;
                              const rate = isEarlyBird
                                ? pack.earlyBirdRate
                                : pack.packageRate;
                              const totalPrice = rate * quantity;

                              return (
                                <tr key={pack.id}>
                                  <td className="td_pack">
                                    {pack.packageName}
                                  </td>
                                  <td className="td_qunt">Qty {quantity}</td>
                                  <td className="td_price">
                                    ₹{totalPrice.toLocaleString()}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>

                      <table className="td_total_proce">
                        <tbody>
                          <tr>
                            <td>Total price</td>
                            <td>
                              ₹
                              {Object.entries(packageCounts)
                                .reduce((sum, [packageId, quantity]) => {
                                  const pack = data.paymentPackages.find(
                                    (p) => p.id === packageId
                                  );
                                  if (!pack) return sum;

                                  const now = new Date();
                                  const earlyBirdDeadline = new Date(
                                    parseInt(pack.earlyBirdDate, 10)
                                  );
                                  const isEarlyBird = now < earlyBirdDeadline;
                                  const rate = isEarlyBird
                                    ? pack.earlyBirdRate
                                    : pack.packageRate;

                                  return sum + rate * quantity;
                                }, 0)
                                .toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                      {perHeadPackageError ? (
                      <div style={{ color: "#df1212ff",fontSize: "1rem" , fontWeight: "500" }}>
                        {" "}
                        Max no of guest allowed per member:{" "}
                        {data?.attendees?.numberOfMaxGuests}{" "}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="bookSummery_btn">
                      <div className="bookSummery_btn_row1">
                        <button className="button_appearance_none btn_booksummery btn_reject" onClick={closeModal1}>
                          REJECT
                        </button>
                        <button
                          className="button_appearance_none btn_booksummery btn_offline"
                          onClick={payOffline}
                          disabled={Object.keys(packageCounts).length === 0}
                        >
                          Pay offline
                        </button>
                      </div>
                      <div className="bookSummery_btn_row2">
                        <button className="button_appearance_none btn_booksummery btn_paynow">
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* event details Packeg section -- new end ---  */}

      {/* events Pic Section -- new start */}
      {eventPicture?.length > 0 && (
        <section className="inner_page_sec inner_sec_row carousel_sec">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="slide-list event-list slide_card eventPic_slider eventBlog_slide_gallery">
                  <h3
                    style={{
                      color: textColor,
                      fontFamily: headerFonts,
                      fontSize: headerFontSizes,
                    }}
                  >
                    Event Pictures
                  </h3>

                  <div className="group_slider">
                    {/*  slider --- start */}
                    <Slider {...trainingvideos}>
                      {eventPicture?.map((item, index) => {
                        return (
                          <div className="slide-box" key={index}>
                            <div className="eventPic_box">
                              <img src={item} />
                            </div>
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* events Pic Section -- new end */}

      {/* Blog -- new start */}
      {eventBlogs && eventBlogs?.length > 0  &&
      <section className="inner_sec_row group_list_sec blog_sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="slide-list slide_card annou_slider">
                <h3
                  style={{
                    color: textColor,
                    fontFamily: headerFonts,
                    fontSize: headerFontSizes,
                  }}
                >
                  List of All Blogs
                </h3>

                <div className="blog_row">
                  <div className="row">
                    {eventBlogs[0] &&
                    <div className="col-lg-6 blog_left">
                      <div className="blog_box_bg blog_box_big">
                        <div className="blog_box">
                          <div className="blog_img">
                            <img src={eventBlogs[0].thumbnailImage && eventBlogs[0].thumbnailImage ? eventBlogs[0].thumbnailImage : ""} />
                          </div>

                          <div className="blog_cont">
                            <div className="event_content_block">
                              <div className="event_card_time">
                                <span>{formatDate(eventBlogs[0].createdAt)}</span> |{" "}
                                <span>{formatTimeUp(eventBlogs[0].createdAt)}</span>
                              </div>
                              <div className="event_card_title">
                                <h4>{eventBlogs[0]?.blogTitle}</h4>
                                {/* <h4>{truncateText(eventTitle, 50)}</h4> */}
                              </div>
                              <div className="event_card_des">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: eventBlogs[0]?.blogShortDesc,
                                  }}
                                ></p>
                              </div>
                              <div className="slide_btn_block slide_card_btn_block">
                                <button
                                  className="button_appearance_none"
                                  onClick={() => {
                                    router.push(
                                      `/${router.query.cummunity_slug}/BlogDetails?id=${eventBlogs[0]?.id}`
                                    );
                                  }}
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    }
                    {eventBlogs[1] &&
                    <div className="col-lg-6 blog_right">
                      {eventBlogs.slice(1).map((item, index) =>(
                      <div className="blog_box_bg blog_small_bg">
                        <div className="blog_box blog_box_small">
                          <div className="blog_img">
                            <img src={item?.thumbnailImage && item?.thumbnailImage ? item?.thumbnailImage : ""} />
                          </div>

                          <div className="blog_cont">
                            <div className="event_content_block">
                              <div className="event_card_time">
                                <span>{formatDate(item?.createdAt)}</span> |{" "}
                                <span>{formatTimeUp(item?.createdAt)}</span>
                              </div>
                              <div className="event_card_title">
                                <h4>{item?.blogTitle}</h4>
                              </div>
                              <div className="event_card_des">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: item?.blogShortDesc,
                                  }}
                                ></p>
                              </div>
                              <div className="slide_btn_block slide_card_btn_block">
                                <button
                                  className="button_appearance_none"
                                  onClick={() => {
                                    router.push(
                                      `/${router.query.cummunity_slug}/BlogDetails?id=${item?.id}`
                                    );
                                  }}
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                    }
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      }



      {/* Modal: Comming soon (Not in use) */}
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

      {/* Modal: RSVP name and phone number*/}
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
                  Please verify your name and mobile no. to create RSVP for the
                  event as web visitor/Active user/Passive user
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
                  <div className="validation form_field_error_msg error_text">
                    {Errors?.phone}
                  </div>
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
                  <div className="validation form_field_error_msg error_text">
                    {Errors?.name}
                  </div>
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
                  <div className="validation form_field_error_msg error_text">
                    {Errors?.email}
                  </div>
                </div>
              </div>

              <div className="modal_footer">
                <button
                  className="button_appearance_none modal_button_submit"
                  onClick={handleSend}
                >
                  Send Otp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: OTP Verification */}
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
                    Please verify your OTP to create RSVP for the event as web
                    visitor/Active user/Passive user
                  </p>
                </div>
                <div className="registerd modal_flex_row modal_form_row">
                  <div className="modal_flex_box">
                    <div className="otp-input-container">
                      <input
                        className="input_appearance_none modal_input otp_input"
                        type="text"
                        placeholder="Enter OTP number"
                        name="otp"
                        onChange={handleChangeotp}
                        value={otp}
                        // width="20px"
                      />
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
                <div className="validation-container">
                  <div className="validation">{Errors?.otp}</div>
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

      {/* Modal: Select Attendees */}
      {Guests && (
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
                <h3 className="attendaceCount_block_title">Attendees Count</h3>
                <div className="count_row count_block_row">
                  <div className="count_block_left">
                    <h3 className="text_white">Seniors</h3>
                  </div>
                  <div className="count_block_right countBlock">
                    <button
                      className="button_appearance_none count_btn btn_color_pink"
                      onClick={decreaseSeniorsCount}
                    >
                      <i className="fa fa-minus-square" aria-hidden="true"></i>
                    </button>
                    <input
                      className="input_appearance_none countInput"
                      value={seniorsCount}
                    />
                    <button
                      className={`button_appearance_none count_btn btn_color_green ${
                        totalCount >= data?.attendees?.numberOfMaxGuests
                          ? "disabled"
                          : ""
                      }`}
                      onClick={increaseSeniorsCount}
                    >
                      <i className="fa fa-plus-square" aria-hidden="true"></i>
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
                      <i className="fa fa-minus-square" aria-hidden="true"></i>
                    </button>
                    <input
                      className="input_appearance_none countInput"
                      value={adultsCount}
                    />
                    <button
                      className={`button_appearance_none count_btn btn_color_green ${
                        totalCount >= data?.attendees?.numberOfMaxGuests
                          ? "disabled"
                          : ""
                      }`}
                      onClick={increaseAdultsCount}
                    >
                      <i className="fa fa-plus-square" aria-hidden="true"></i>
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
                      <i className="fa fa-minus-square" aria-hidden="true"></i>
                    </button>
                    <input
                      className="input_appearance_none countInput"
                      value={childrenCount}
                    />
                    <button
                      className={`button_appearance_none count_btn btn_color_green ${
                        totalCount >= data?.attendees?.numberOfMaxGuests
                          ? "disabled"
                          : ""
                      }`}
                      onClick={increaseChildrenCount}
                    >
                      <i className="fa fa-plus-square" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
              {perHeadError ? (
                <div style={{ color: "red" }}>
                  {" "}
                  You have only selected package for{" "}
                  {Object.values(packageCounts)[0]} person{" "}
                </div>
              ) : (
                ""
              )}
              {totalCount >= data?.attendees?.numberOfMaxGuests ? (
                <div style={{ color: "red" }}>
                  {" "}
                  Max no of guest allowed per member:{" "}
                  {data?.attendees?.numberOfMaxGuests}{" "}
                </div>
              ) : (
                ""
              )}
              <div className="modal_footer">
                <div className=" count_btn_row">
                  <button
                    className="button_appearance_none  modal_button_submit"
                    style={{
                      display: data?.attendees?.webvistorRestriction
                        ? "block"
                        : "none",
                    }}
                    onClick={handleConfirm}
                  >
                    Yes,confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Venue details container */}
      {/* Image Modal start */}
      <ImageModal
        show={showImageModal}
        onHide={() => {
          setShowImageModal(false);
          setImageUrl("");
        }}
        imageUrl={imageUrl}
      />

      {/* Footer Section */}
      <Footer />
    </>
  );
}
