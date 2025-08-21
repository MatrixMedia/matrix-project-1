import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { css } from "glamor";
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Button } from "react-bootstrap";
import {
  COMMUNITY_BASICS_DETAILS,
  CREATE_COMMUNITY_FEEDBACK,
  GET_ALL_ANNOUNCEMENT_LIST,
  GET_COMMUNITY_HOME,
  GET_MY_COMMUNITY_SETTINGS,
} from "../api/queries";
import api from "../api/api";
import { max } from "date-fns";
import { useRouter } from "next/router";

// Google Captcha site key
const TEST_SITE_KEY = "6Lcx50MlAAAAABOOZwoO-aZ0JW2k0Vx0c6Y84ElV";
const DELAY = 1500;

const Footer = () => {
  // react Hook For State Handler
  const [message, setMessage] = useState("");
  const [storeData, setStoreData] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(null);
  const [emailData, setEmailData] = useState(null);
  const [textColor, setTextColor] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [emailAccess, setEmailAccess] = useState("");
  const [phoneAccess, setPhoneAccess] = useState("");
  const [img, setImg] = useState("");
  const [textareaCounter, setTextareaCounter] = useState(0);
  const [textareaCounterColor, setTextareaCounterColor] = useState("white");
  const [communityPhoneCode,setCommunityPhoneCode] = useState(null);
  const [captcha, setCaptcha] = useState({
    callback: "not fired",
    value: "[empty]",
    load: false,
    expired: "false",
  });
  // Captch reset for google
  const captchaRef = useRef(null);

  const router = useRouter();

  // To get the current year
  const CurrentYear = new Date().getFullYear();
  
  var maxInput = 500;
  var minInput = 501;

  // function for counting a text for input field
  const handleTextareaCount = (content) => {
    setTextareaCounter(content.length);

    setMessage(content.replace(/  +/g, " "));

    content.length < minInput
      ? setTextareaCounterColor("white")
      : setTextareaCounterColor("white");
  };

  // initial calling for google captcha
  useEffect(() => {
    setTimeout(() => {
      setCaptcha({ load: true });
    }, DELAY);
  }, []);

  // intial render for link share :
  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas, (commId) => {
        getCommunityBasicDetails(commId);
        getCommunityHomeDetails(commId);
      });
    }
  }, [router]);

  // calling  a function for link sharable time
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
    callback(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.communityId
    );
    setTextColor(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.textColor
    );
    setPhoneAccess(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.aboutUsSettings
        ?.showContactPhonePublicly
    );
    setEmailAccess(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.aboutUsSettings
        ?.showContactEmailPublicly
    );
    setImg(response?.data?.data?.getMyCommunitiesSettingsView?.data?.watermark);
  };

  useEffect(() => {
    var data = JSON?.parse(localStorage?.getItem("storeData"));
    setStoreData(data);
    setTextColor(storeData?.textColor);
    setPhoneAccess(data?.aboutUsSettings?.showContactPhonePublicly);
    setEmailAccess(data?.aboutUsSettings?.showContactEmailPublicly);
    setImg(data?.watermark);
  }, []);

  useEffect(() => {
    getCommunityBasicDetails(storeData?.communityId && storeData?.communityId);
    getCommunityHomeDetails(storeData?.communityId && storeData?.communityId);
  }, [storeData]);

  // Api if firing with the dependicies of community Id for getCommunityHomeDetails
  const getCommunityHomeDetails = async (id) => {
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
      setImg(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data
          ?.logoImage || ""
      );
    }
  };

  // Api if firing with the dependicies of community Id for getCommunityBasicDetails
  const getCommunityBasicDetails = async (id) => {
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
        setEmailData(
          response?.data?.data?.getCommunityBasicDetails?.data
            ?.communityEmail || null
        );
        setPhone(
          response?.data?.data?.getCommunityBasicDetails?.data
            ?.communityNumber || null
        );
        setCommunityName(
          response?.data?.data?.getCommunityBasicDetails?.data?.communityName ||
            ""
        );
        setCommunityPhoneCode(response?.data?.data?.getCommunityBasicDetails?.data?.communityPhoneCode ||
          "")
      }
    }
  };

  const handleChange = (value) => {
    setCaptcha({ value });
    // if value is null recaptcha expired
    if (value === null) setCaptcha({ expired: "true" });
    document.getElementById("button1").disabled = false;
  };

  const { value, callback, load, expired } = captcha || {};

  const asyncScriptOnLoad = () => {
    setCaptcha({ callback: "called!" });
  };

  const [touchedFields, setTouchedFields] = useState("");
  const [touchedField, setTouchedField] = useState("");

  const handleInputBlur = (e) => {
    if (e) {
      setTouchedFields("Mandatory Fields");
    } else {
      setTouchedFields("");
    }
  };

  const handleInputBlure = (e) => {
    if (e) {
      setTouchedField("Mandatory Fields");
    } else {
      setTouchedField("");
    }
  };

  // Toast Notification Message for Successfully sent a Mail
  const notifySuccess = () =>
    toast.success("Feedback sent successfully !", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: css({
        background: "green",
        color: "white",
        width: "200px",
      }),
    });

  // Toast Notification Message for UnSuccessfull
  const notifyError = () => {
    toast.error("Feedback Not Sent successfully ", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: css({
        background: "red",
        color: "white",
      }),
    });
  };

  // Handle Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("", {
      query: CREATE_COMMUNITY_FEEDBACK,
      variables: {
        data: {
          email,
          message,
          communityId: storeData?.communityId,
        },
      },
    });
    if (res?.data?.data?.createCommunityFeedback?.code == "200") {
      notifySuccess(res?.data?.data?.createCommunityFeedback?.message);
      setMessage("");
      setEmail("");
      setTextareaCounter(0);
      captchaRef.current.reset();
    } else {
      notifyError();
    }
  };

  return (
    <footer>

      {/* //  === footer - new - start ===   */}
      <div className="footer_new">

        <div className="footer_new_top">
          <div className="container">
            <div className="row footer_top_row">

              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-8 col-md-7">
                    <div className="footer_top_block footer_top_block_01">
                        <div className="footer_logo_block">
                          <a href="#">
                            <img className="footer_logo" src="../images/footer_logo.svg"  />
                          </a>
                        </div>
                        <div className="footer_logo_dec">
                          <p>If you want to be registered as Board member or Executive member, Please login to <br/><a className="text_green" href="#">Community Administration</a></p>
                        </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-5">
                    <div className="footer_top_block footer_top_block_02">
                      <h5>Company</h5>
                      <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Screens</a></li>
                        <li><a href="#">Training  Videos</a></li>
                        <li><a href="#">About Us</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-lg-8 col-md-7">
                    <div className="footer_top_block footer_top_block_03">  
                      <h5>Company</h5>
                      <p>App supports three languages - English, Hindi & Bengali</p>
                      <div className="footer_top_img_block">
                        <div class="app-link">
                          <a rel="noopener noreferrer" target="_blank" href="https://play.google.com/store/apps/details?id=com.communitynetworkingapp" >
                            <img src="../images/google-play.png" alt="" />
                          </a>
                          <a rel="noopener noreferrer" target="_blank" href="https://apps.apple.com/in/app/sangaraahi/id1661511878" >
                            <img src="../images/app-store.png" alt="" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-5">
                      <div className="footer_top_block footer_top_block_04">  
                        <h5>Follow us</h5>
                        <div className="footer_social">
                          <ul>
                            <li><a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
                            {/* <li><a href="#"><i class="fa-brands fa-twitter"></i></a></li>  */}
                            <li><a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
                            <li><a href="#"><i class="fa fa-linkedin" aria-hidden="true"></i></a></li>
                          </ul>
                        </div>
                      </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="footer_new_bottom">
          <div className="container">
            <div className="row footer_bottom_row">
              <div className="col-lg-6">
                <p>Copyright © 2025. All rights are reserved by <a href="#">SangaRaahi LLC, US.</a></p>
              </div>
              <div className="col-lg-6">
                <div className="footer_bottom_menu">
                  <ul>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms & Condition</a></li>
                    <li><a href="#">Safety Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* //  === footer - new - end === */}

      {/* //  === footer - Old - start === */}

{/*       
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              {emailAccess || phoneAccess ? (
                <>
                  {" "}
                  {emailData != null || phone != null ? (
                    <h3>Contact us</h3>
                  ) : (
                    ""
                  )}
                  <ul>
                    {emailAccess && emailData != null ? (
                      <li>
                        <span className="icon">
                          <img
                            src="https://sangaraahi.s3.ap-south-1.amazonaws.com/icon-email.png"
                            alt=""
                          />
                        </span>{" "}
                        {emailData}
                      </li>
                    ) : (
                      ""
                    )}
                    {phoneAccess && phone != null ? (
                      <li>
                        <span className="icon">
                          <img
                            src="https://sangaraahi.s3.ap-south-1.amazonaws.com/icon-mobile.png"
                            alt=""
                          />
                        </span>{" "}
                        {communityPhoneCode} {phone}
                      </li>
                    ) : (
                      ""
                    )}
                  </ul>
                </>
              ) : (
                ""
              )}

              <div className="footer-logo">
                <img
                  src={
                    img ||
                    "https://sangaraahi.s3.ap-south-1.amazonaws.com/group%201.png"
                  }
                  alt=""
                />
              </div>
            </div>
            <div className="col-lg-8">
              <h3>Submit Your Feedback</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    type="email"
                    className="form_data"
                    placeholder="Type your email address *"
                    value={email}
                    onChange={(e) => setEmail(e?.target?.value)}
                    onBlur={handleInputBlur}
                  />

                  {!email && (
                    <span className="error-message">{touchedFields}</span>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    className="form_data"
                    placeholder="Send us a message *"
                    value={message}
                    maxLength={maxInput}
                    onChange={(e) => handleTextareaCount(e.target.value)}
                    onBlur={handleInputBlure}
                  />
                  {!message && (
                    <span className="error-message">{touchedField}</span>
                  )}
                  &nbsp;
                  <p className="countered">
                    <span style={{ color: `${textareaCounterColor}` }}>
                      {textareaCounter}/{maxInput}
                    </span>
                  </p>
                </Form.Group>
                <Form.Group>
                  <div className="row">
                    <div className="col-lg-7">
                      <ReCAPTCHA
                        style={{ display: "inline-block" }}
                        theme="dark"
                        sitekey={TEST_SITE_KEY}
                        onChange={handleChange}
                        asyncScriptOnLoad={asyncScriptOnLoad}
                        ref={captchaRef}
                      />
                    </div>
                    <div className="col-lg-5">
                      <Button id="button1" disabled type="submit">
                        Send
                      </Button>
                    </div>
                  </div>
                </Form.Group>
              </Form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>

      <div className="copy">
        <div className="container">
          <div className="row">
            <div className="col-lg-8" style={{ color: textColor }}>
              <Link className="text-deco" href={router?.asPath || ""}>
                Copyright © {CurrentYear}. All rights are reserved by &nbsp;
                {communityName || ""} in .net Platform
              </Link>
            </div>
            <div className="col-lg-4">
              <div className="right-txt" style={{ color: textColor }}>
                <Link className="text-deco" href={router?.asPath || ""}>
                  <img
                    src="https://sangaraahi.s3.ap-south-1.amazonaws.com/image%201%20%281%29.png"
                    alt=""
                  />{" "}
                  Hosted in SangaRaahi Platform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
 */}


      {/* //  === footer - Old - end === */}
    </footer>

      

  );
};
export default Footer;
