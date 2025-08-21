import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
  ABOUT_US,
  COMMUNITY_BASICS_DETAILS,
  GET_COMMUNITY_HOME,
  GET_MY_COMMUNITY_SETTINGS,
} from "../api/queries";
import { useRouter } from "next/router";
import TableLoader from "../../util/TableLoader";
import Modal from "../../util/ModalComponent";

const About = (props) => {
  // react Hook For State Handler
  const [about, setAbout] = useState(null);
  const [storeData, setStoreData] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [profit, setProfit] = useState("");
  const [cultural, setCultural] = useState("");
  const [location, setLocation] = useState("");
  const [executivemember, setExecutiveMember] = useState("");

  const [boardMemberSetting, setBoardMemberSetting] = useState("");
  const [executivememberSetting, setExecutiveMemberSeting] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTruncate, setIsTruncate] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [boardMember, setBoardMember] = useState("");
  const [executive, setExecutive] = useState("");

  const [descriptionAccess, setDescriptionAccess] = useState("");
  const [addressAccess, setaddressAcess] = useState("");

  const [bodyFonts, setbodyFonts] = useState("");
  const [bodyFontSizes, setbodyFontSizes] = useState("");

  const [headerFonts, setheaderFonts] = useState("");
  const [headerFontSizes, setheaderFontSizes] = useState("");

  const [textColor, setTextColor] = useState("");
  const [background, setBackGround] = useState("");

  const MAX_WORD_LENGTH = 450;

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const router = useRouter();

  // intial rendering with slugs
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
    setDescriptionAccess(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.aboutUsSettings
        ?.showOrganizationDescription || ""
    );
    setaddressAcess(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.aboutUsSettings
        ?.showOrganizationAddress || ""
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
    setTextColor(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.textColor || ""
    );

    setBoardMemberSetting(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.aboutUsSettings
        ?.showBoardMembers || ""
    );
    setExecutiveMemberSeting(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.aboutUsSettings
        ?.showExecutiveMembers || ""
    );
    setBoardMember(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.aboutUsSettings
        ?.boardMembersLabelName || ""
    );
    setExecutive(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.aboutUsSettings
        ?.executiveMembersLabelName || ""
    );

    document.body.style.backgroundColor =
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.backgroupColor;
  };

  useEffect(() => {
    const datas = router.query.id;
    if (datas) {
      viewDetails(datas, (commId) => {
        getCommunityHomeDetails((commId && commId) || null);
        get_board_member((commId && commId) || null);
        get_executive_member((commId && commId) || null);
        getCommunityBasicDetails((commId && commId) || null);
      });
    }
  }, [router]);

  useEffect(() => {
    var data = JSON.parse(localStorage?.getItem("storeData"));
    setBoardMemberSetting(data?.aboutUsSettings?.showBoardMembers || "");
    setExecutiveMemberSeting(data?.aboutUsSettings?.showExecutiveMembers || "");
    setBoardMember(data?.aboutUsSettings?.boardMembersLabelName || "");
    setExecutive(data?.aboutUsSettings?.executiveMembersLabelName || "");
    setDescriptionAccess(
      data?.aboutUsSettings?.showOrganizationDescription || ""
    );
    setaddressAcess(data?.aboutUsSettings?.showOrganizationAddress || "");
    setStoreData(data || "");
    setbodyFonts(data?.bodyFont || "");
    setbodyFontSizes(data?.bodyFontSize || "");
    setheaderFonts(data?.headerFont || "");
    setheaderFontSizes(data?.headerFontSize || "");
    setTextColor(data?.textColor || "");
  }, []);

  useEffect(() => {
    getCommunityHomeDetails(
      (storeData?.communityId && storeData?.communityId) || null
    );
    get_board_member(
      (storeData?.communityId && storeData?.communityId) || null
    );
    get_executive_member(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getCommunityBasicDetails(
      (storeData?.communityId && storeData?.communityId) || null
    );
    document.body.style.backgroundColor = storeData?.backgroupColor;
  }, [storeData]);

  // Truncate the descriptions length :
  const truncate = isTruncate
    ? description.split("").slice(0, MAX_WORD_LENGTH).join("")
    : description;

  // To get Board member data from api response
  const get_board_member = async (id) => {
    setLoading(true);
    if (id) {
      const response = await api.post("", {
        query: ABOUT_US,
        variables: {
          data: {
            communityId: id,
            memberType: ["board_member"],
            isOrgPortal: true,
          },
        },
      });
      if (response?.status === 200) {
        setAbout(response?.data?.data?.communityMemberRoleFilter?.data || "");
      }
    }
    setLoading(false);
  };
  // To get Executive member data from api response
  const get_executive_member = async (id) => {
    setLoading(true);
    if (id) {
      const response = await api.post("", {
        query: ABOUT_US,
        variables: {
          data: {
            communityId: id,
            memberType: ["executive_member"],
            isOrgPortal: true,
          },
        },
      });
      if (response?.status === 200) {
        setExecutiveMember(
          response?.data?.data?.communityMemberRoleFilter?.data || ""
        );
      }
    }
    setLoading(false);
  };

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
        setLocation(
          response?.data?.data?.getCommunityBasicDetails?.data
            ?.communityLocation || ""
        );
      }
    }
    setLoading(false);
  };

  // Api if firing with the dependicies of community Id :
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
      setDescription(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data
          ?.communityDescription || ""
      );
      setImg(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data
          ?.logoImage || ""
      );
      setBackGround(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data
          ?.backgroupColor || ""
      );
    }
    setLoading(false);
  };

  // Board Member list slider config
  var BoardMemberslist = {
    arrows: true,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
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
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  // Executive Member list slider config

  var ExecutiveMemberslist = {
    arrows: true,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
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
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Header />
      {/* inner banner start */}
      <div
        className="inner-banner "
        style={{
          // backgroundColor: background,
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
                  {profit
                    ? "For Profit Organization"
                    : "Non Profit Organization"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* inner banner end */}

      {/* about top start */}
      <div
        className="about-top box_shadow_line_inset"
        // style={{
        //   backgroundColor: background,
        //   color: textColor,
        //   fontFamily: headerFonts,
        //   fontSize: headerFontSizes,
        // }}
      >
        <div className="container" >
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
                  About Us
                </h3>
              </div>

            </div>
          </div>
        </div>
        

        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="about-txt">
                {descriptionAccess && (
                  <div
                    style={{
                      color: textColor,
                      fontFamily: bodyFonts,
                      fontSize: bodyFontSizes,
                    }}
                  >
                    {description}
                  </div>
                )}
                {addressAccess && (
                  <p className="location">
                    {location && (
                      <span className="icon">
                        <img
                          src="https://sangaraahi.s3.ap-south-1.amazonaws.com/location-tick.png"
                          alt=""
                        />
                      </span>
                    )}

                    <span
                      className="txt"
                      style={{
                        color: textColor,
                        fontFamily: bodyFonts,
                        fontSize: bodyFontSizes,
                      }}
                    >
                      {location}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* about top end */}

      {/* Board Members list start */}

      {boardMemberSetting == true && (
        <>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="about-list">
                  <h3
                    style={{
                      color: textColor,
                      fontFamily: headerFonts,
                      fontSize: headerFontSizes,
                    }}
                  >
                    List of {boardMember}
                  </h3>
                  {loading ? (
                    <TableLoader />
                  ) : about?.length === 0 ? (
                    <div className="no_data_card">No Data Found</div>
                  ) : (
                    <Slider {...BoardMemberslist}>
                      {about &&
                        about?.map((item) => {
                          return (
                            <React.Fragment key={item?.id}>
                              <div className="slide-box">
                                <div className="slide-content slide-contented">
                                  <div className="slide-thum">
                                    <img
                                      src={
                                        item?.members?.user?.profileImage ||
                                        "https://sangaraahi.s3.ap-south-1.amazonaws.com/group%201.png"
                                      }
                                      alt=""
                                    />{" "}
                                  </div>
                                  <div className="slide-txt">
                                    <h4
                                      style={{
                                        // color: textColor,
                                        fontFamily: headerFonts,
                                        // fontSize: headerFontSizes,
                                      }}
                                    >
                                      {item?.members?.user?.name}
                                    </h4>
                                    <p
                                      style={{
                                        // color: textColor,
                                        fontFamily: bodyFonts,
                                        // fontSize: bodyFontSizes,
                                      }}
                                    >
                                      {boardMember}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })}
                    </Slider>
                  )}
                  <Modal
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    content={modalContent}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Board Members list end */}

      {/* Executive Members list start */}

      {executivememberSetting == true && (
        <>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="about-list">
                  <h3
                    style={{
                      color: textColor,
                      fontFamily: headerFonts,
                      fontSize: headerFontSizes,
                    }}
                  >
                    List of {executive}
                  </h3>
                  {loading ? (
                    <TableLoader />
                  ) : executivemember?.length === 0 ? (
                    <div className="no_data_card">No Data Found</div>
                  ) : (
                    <div>
                      <Slider {...ExecutiveMemberslist}>
                        {executivemember &&
                          executivemember.map((item) => {
                            return (
                              <React.Fragment key={item?.id}>
                                <div className="slide-box">
                                  <div className="slide-content slide-contented">
                                    <div className="slide-thum">
                                      <img
                                        src={
                                          item?.members?.user?.profileImage ||
                                          "https://sangaraahi.s3.ap-south-1.amazonaws.com/group%201.png"
                                        }
                                        alt=""
                                      />{" "}
                                    </div>
                                    <div className="slide-txt">
                                      <h4
                                        style={{
                                          // color: textColor,
                                          fontFamily: headerFonts,
                                          // fontSize: headerFontSizes,
                                        }}
                                      >
                                        {item?.members?.user?.name}
                                      </h4>
                                      <p
                                        style={{
                                          // color: textColor,
                                          fontFamily: bodyFonts,
                                          // fontSize: bodyFontSizes,
                                        }}
                                      >
                                        {executive}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          })}
                      </Slider>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Executive Members list end */}

      <Footer />
    </>
  );
};
export default About;
