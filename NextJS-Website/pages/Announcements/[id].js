import Slider from "react-slick";
import Header from "../components/Header";
import Footer from "../components/Footer";
import React, { useEffect, useState } from "react";
import {
  COMMUNITY_BASICS_DETAILS,
  GET_ALL_ANNOUNCEMENT_LIST,
  GET_COMMUNITY_EVENTS,
  GET_COMMUNITY_HOME,
  GET_MY_COMMUNITY_SETTINGS,
  MyCommunityOrgGlobalSearch,
} from "../api/queries";
// import api from "../../api/api";
import TableLoader from "../../util/TableLoader";
import { useRouter } from "next/router";
import Modal from "../../util/ModalComponent";
import api from "../api/api";

export default function AnnouncementPage(props) {
  // react Hook For State Handler
  const [publicevents, setPublicEvents] = useState(null || "");
  const [pastEvents, setPastEvents] = useState(null || "");
  const [memberEvents, setMemberEvents] = useState(null || "");
  const [publicAnnouncements, setPublicAnnouncements] = useState(null || "");
  const [memberAnnouncements, setMemberAnnouncements] = useState(null || "");
  const [storeData, setStoreData] = useState("");

  const [showPublicEventsType, setShowPublicEvents] = useState(null || "");
  const [showPublicAnnouncement, setShowPublicAnnouncement] = useState(
    null || ""
  );
  const [showPastEvents, setshowPastEvents] = useState(null || "");
  const [showMembersOnlyEvents, setShowMembersOnlyEvents] = useState(
    null || ""
  );
  const [showMemberAnnouncement, setShowMemberAnnouncement] = useState(
    null || ""
  );
  const [textColor, setTextColor] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [label, setLabel] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTruncate, setIsTruncate] = useState(true);

  const [bodyFonts, setbodyFonts] = useState("");
  const [bodyFontSizes, setbodyFontSizes] = useState("");

  const [headerFonts, setheaderFonts] = useState("");
  const [headerFontSizes, setheaderFontSizes] = useState("");

  const [community, setCommunity] = useState(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [background, setBackGround] = useState("");

  // search state
  const [searchTerm, setSearchTerm] = useState("");

  const MAX_WORD_LENGTH = 220;

  const router = useRouter();

  // Truncate the descriptions length :
  const truncate = isTruncate
    ? description.split("").slice(0, MAX_WORD_LENGTH).join("")
    : description;

  // calling an api for link sharable time for reload the data
  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas, (commId) => {
        getCommunityHomeDetails((commId && commId) || null);
        getPublicEvents((commId && commId) || null);
        getPastEvents((commId && commId) || null);
        getMemeberAnnouncements((commId && commId) || null);
        getPulicAnnouncements((commId && commId) || null);
        getMemberEvents((commId && commId) || null);
        getCommunityBasicDetails(commId && commId);
      });
    }
  }, [router]);

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

    setShowPublicEvents(
      response?.data?.data?.getMyCommunitiesSettingsView?.data
        ?.announcementSettings?.showPublicEvents || null
    );

    setShowPublicAnnouncement(
      response?.data?.data?.getMyCommunitiesSettingsView?.data
        ?.announcementSettings?.showPublicAnnouncement || ""
    );

    setshowPastEvents(
      response?.data?.data?.getMyCommunitiesSettingsView?.data
        ?.announcementSettings?.showPastEvents || ""
    );
    setShowMembersOnlyEvents(
      response?.data?.data?.getMyCommunitiesSettingsView?.data
        ?.announcementSettings?.showMembersOnlyEvents || ""
    );
    setShowMemberAnnouncement(
      response?.data?.data?.getMyCommunitiesSettingsView?.data
        ?.announcementSettings?.showMemberAnnouncement || ""
    );
    setTextColor(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.textColor || ""
    );
    setLabel(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.lebel || ""
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

  // function for calling for open a modal
  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };
  // function for calling for close a modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Fetch Function for List of Videos
  useEffect(() => {
    var data = JSON.parse(localStorage?.getItem("storeData"));
    setStoreData(data);
  }, []);

  // converting date format:
  const formatDate = (dateString) => {
    var date = new Date(dateString),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [mnth, day, date.getFullYear()].join("-");
  };

  // creating all function and passing an community id as a parameter
  useEffect(() => {
    getCommunityHomeDetails(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getPublicEvents((storeData?.communityId && storeData?.communityId) || null);
    getPastEvents((storeData?.communityId && storeData?.communityId) || null);
    getMemeberAnnouncements(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getPulicAnnouncements(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getMemberEvents((storeData?.communityId && storeData?.communityId) || null);
    setShowPublicEvents(
      storeData?.announcementSettings?.showPublicEvents || null
    );
    getCommunityBasicDetails(
      (storeData?.communityId && storeData?.communityId) || null
    );
    setShowPublicAnnouncement(
      storeData?.announcementSettings?.showPublicAnnouncement || ""
    );
    setshowPastEvents(storeData?.announcementSettings?.showPastEvents || "");
    setShowMembersOnlyEvents(
      storeData?.announcementSettings?.showMembersOnlyEvents || ""
    );
    setShowMemberAnnouncement(
      storeData?.announcementSettings?.showMemberAnnouncement || ""
    );
    setTextColor(storeData?.textColor || "");
    setLabel(storeData?.lebel || "");
    setbodyFonts(storeData?.bodyFont || "");
    setbodyFontSizes(storeData?.bodyFontSize || "");
    setheaderFonts(storeData?.headerFont || "");
    setheaderFontSizes(storeData?.headerFontSize || "");
    document.body.style.backgroundColor = storeData?.backgroupColor;
  }, [storeData]);

  // Public events function calling
  const getPublicEvents = async (id) => {
    setLoading(true);

    if (id) {
      const response = await api.post("", {
        query: GET_COMMUNITY_EVENTS,
        variables: {
          data: {
            page: 1,
            communityId: id,
            eventType: "Public",
            isActive: "active",
          },
        },
      });
      if (response.status === 200) {
        setPublicEvents(
          response?.data?.data?.getMyCommunityEvents?.data?.events || ""
        );
      }
    }
    setLoading(false);
  };
  // Past events function calling
  const getPastEvents = async (id) => {
    setLoading(true);

    if (id) {
      const response = await api.post("", {
        query: GET_COMMUNITY_EVENTS,
        variables: {
          data: {
            page: 1,
            communityId: id,
            eventType: "Past",
            isActive: "past",
          },
        },
      });
      if (response.status === 200) {
        setPastEvents(
          response?.data?.data?.getMyCommunityEvents?.data?.events || ""
        );
      }
    }
    setLoading(false);
  };

  // Member events function calling
  const getMemberEvents = async (id) => {
    setLoading(true);

    if (id) {
      const response = await api.post("", {
        query: GET_COMMUNITY_EVENTS,
        variables: {
          data: {
            page: 1,
            communityId: id,
            eventType: "Member",
            isActive: "active",
          },
        },
      });
      if (response.status === 200) {
        setMemberEvents(
          response?.data?.data?.getMyCommunityEvents?.data?.events || ""
        );
      }
    }
    setLoading(false);
  };

  // Public Announcement function calling

  const getPulicAnnouncements = async (id) => {
    setLoading(true);

    if (id) {
      const response = await api.post("", {
        query: GET_ALL_ANNOUNCEMENT_LIST,
        variables: {
          data: {
            communityId: id,
            announcementType: "Public",
            page: 1,
            isActive: "active",
          },
        },
      });
      if (response?.status === 200) {
        setPublicAnnouncements(
          response?.data?.data?.getAllAnnouncementOrganization?.data
            ?.announcements || ""
        );
      }
    }
    setLoading(false);
  };

  // Member Announcement function calling
  const getMemeberAnnouncements = async (id) => {
    setLoading(true);

    if (id) {
      const response = await api.post("", {
        query: GET_ALL_ANNOUNCEMENT_LIST,
        variables: {
          data: {
            communityId: id,
            announcementType: "Member",
            page: 1,
            isActive: "active",
          },
        },
      });
      if (response.status === 200) {
        setMemberAnnouncements(
          response?.data?.data?.getAllAnnouncementOrganization?.data
            ?.announcements || ""
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
          ?.backgroupColor
      );
    }
    setLoading(false);
  };

  // calling a api for basic details for particular community id
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
        setCommunityName(
          response?.data?.data?.getCommunityBasicDetails?.data?.communityName ||
            ""
        );
      }
    }
    setLoading(false);
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

    setPublicAnnouncements(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.announcements
        ?.publicAnnouncement || ""
    );
    setMemberAnnouncements(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.announcements
        ?.memberAnnouncement || ""
    );
    setMemberEvents(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.events
        ?.membersOnlyEvents || ""
    );
    setPastEvents(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.events
        ?.pastEvents || ""
    );
    setPublicEvents(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.events
        ?.publicEvents || ""
    );

    setLoading(false);
  };

  // submit search function:
  const handleSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  // Slide config for PublicEventslist
  var PublicEventslist = {
    arrows: true,
    dots: false,
    speed: 500,
    infinite: false,
    slidesToShow: 4,
    slidesToShow: publicevents?.length > 4 ? 4 : publicevents?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow: publicevents?.length > 3 ? 3 : publicevents?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToShow: publicevents?.length > 2 ? 2 : pastEvents?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow: publicevents?.length > 1 ? 1 : publicevents?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Slide config for PastEventslist
  var PastEventslist = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    infinite: false,
    slidesToShow: 4,
    slidesToShow: pastEvents?.length > 4 ? 4 : pastEvents?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow: pastEvents?.length > 3 ? 3 : pastEvents?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToShow: pastEvents?.length > 2 ? 2 : pastEvents?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow: pastEvents?.length > 1 ? 1 : pastEvents?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Slide config for MemberEventslist
  var MemberEventslist = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    infinite: false,
    slidesToShow: 4,
    slidesToShow: memberEvents?.length > 4 ? 4 : memberEvents?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow: memberEvents?.length > 3 ? 3 : memberEvents?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToShow: memberEvents?.length > 2 ? 2 : memberEvents?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow: memberEvents?.length > 1 ? 1 : memberEvents?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Slide config for PublicAnnouncementslist
  var PublicAnnouncementslist = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    infinite: false,
    slidesToShow: 4,
    slidesToShow:
      publicAnnouncements?.length > 4 ? 4 : publicAnnouncements?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow:
            publicAnnouncements?.length > 3 ? 3 : publicAnnouncements?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToShow:
            publicAnnouncements?.length > 2 ? 2 : publicAnnouncements?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow:
            publicAnnouncements?.length > 1 ? 1 : publicAnnouncements?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Slide config for MemberAnnouncementslist
  var MemberAnnouncementslist = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    infinite: false,
    slidesToShow: 4,
    slidesToShow:
      memberAnnouncements?.length > 4 ? 4 : memberAnnouncements?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow:
            memberAnnouncements?.length > 3 ? 3 : memberAnnouncements?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToShow:
            memberAnnouncements?.length > 2 ? 2 : memberAnnouncements?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow:
            memberAnnouncements?.length > 1 ? 1 : memberAnnouncements?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Header
        handleSubmit={handleSubmit}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        community={community}
      />
      {/* inner banner start */}
      <div
        className="inner-banner video box_shadow_line"
        style={{
          backgroundColor: background,
          color: textColor,
          fontFamily: headerFonts,
          fontSize: headerFontSizes,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="video-top">
                <div className="pic">
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
                <div className="txt">
                  <h3>{communityName || ""}</h3>

                  <div>{description}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* inner banner end */}

      {/* announcements content  start */}
      <div className="announcements-content">
        {/* List of Public Events start */}
        {showPublicEventsType == true && (
          <>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="slide-list gen-slide green">
                    <h3
                      style={{
                        color: textColor,
                        fontFamily: headerFonts,
                        fontSize: headerFontSizes,
                      }}
                    >
                      List of Public Events
                    </h3>
                    {loading ? (
                      <TableLoader />
                    ) : publicevents?.length === 0 ? (
                      <div className="no_data_card">No Public Event Found</div>
                    ) : (
                      <div>
                        <Slider {...PublicEventslist}>
                          {publicevents &&
                            publicevents?.map((item) => {
                              return (
                                <React.Fragment key={item?.id}>
                                  <div
                                    className="slide-box"
                                    style={{ color: textColor }}
                                  >
                                    <div className="slide-content">
                                      <div className="slide-thum">
                                        <img
                                          src={
                                            item?.image ||
                                            "https://sangaraahi.s3.ap-south-1.amazonaws.com/Group%2010906.png"
                                          }
                                        />
                                        <div className="tag-line">Public</div>
                                      </div>
                                      <div className="slide-txt">
                                        {/* <h4>{item?.title}</h4> */}
                                        {item?.title?.length > 30 ? (
                                          <div className="txt">
                                            <div
                                              onClick={() =>
                                                openModal(item?.title)
                                              }
                                              style={{
                                                color: textColor,
                                                fontFamily: bodyFonts,
                                                fontSize: bodyFontSizes,
                                              }}
                                            >
                                              {item?.title?.substring(0, 32) +
                                                "..."}
                                            </div>
                                          </div>
                                        ) : (
                                          <span>{item?.title}</span>
                                        )}

                                        <div
                                          style={{
                                            color: textColor,
                                            fontFamily: bodyFonts,
                                            fontSize: bodyFontSizes,
                                          }}
                                        >
                                          {item?.description?.length > 50 ? (
                                            <div
                                              className="txt"
                                              style={{ color: textColor }}
                                            >
                                              <div
                                                onClick={() =>
                                                  openModal(item?.description)
                                                }
                                                className="btn-readmore"
                                              >
                                                {item?.description?.substring(
                                                  0,
                                                  22
                                                ) + "..."}
                                                <div className="btn-readmore">
                                                  Read More
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <span>{item?.description}</span>
                                          )}
                                        </div>
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
        {/* List of Public Events end */}

        {/* List of  Past Events start */}
        {showPastEvents == true && (
          <>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="slide-list gen-slide red">
                    <h3
                      style={{
                        color: textColor,
                        fontFamily: headerFonts,
                        fontSize: headerFontSizes,
                      }}
                    >
                      List of Past Events
                    </h3>
                    {loading ? (
                      <TableLoader />
                    ) : pastEvents?.length === 0 ? (
                      <div className="no_data_card">No Past Event Found</div>
                    ) : (
                      <div>
                        <Slider {...PastEventslist}>
                          {pastEvents &&
                            pastEvents?.map((item) => {
                              return (
                                <React.Fragment key={item?.id}>
                                  <div
                                    className="slide-box"
                                    style={{ color: textColor }}
                                  >
                                    <div className="slide-content">
                                      <div className="slide-thum">
                                        <img
                                          src={
                                            item?.image ||
                                            "https://sangaraahi.s3.ap-south-1.amazonaws.com/Group%2010906.png"
                                          }
                                        />
                                        <div className="tag-line">
                                          {item?.invitationType}
                                        </div>
                                      </div>
                                      <div className="slide-txt">
                                        {item?.title?.length > 30 ? (
                                          <div className="txt">
                                            <div
                                              onClick={() =>
                                                openModal(item?.title)
                                              }
                                              style={{
                                                color: textColor,
                                                fontFamily: bodyFonts,
                                                fontSize: bodyFontSizes,
                                              }}
                                            >
                                              {item?.title?.substring(0, 32) +
                                                "..."}
                                            </div>
                                          </div>
                                        ) : (
                                          <span>{item?.title}</span>
                                        )}{" "}
                                        <div
                                          style={{
                                            color: textColor,
                                            fontFamily: bodyFonts,
                                            fontSize: bodyFontSizes,
                                          }}
                                        >
                                          {item?.description?.length > 50 ? (
                                            <div
                                              className="txt"
                                              style={{
                                                color: textColor,
                                                fontFamily: bodyFonts,
                                                fontSize: bodyFontSizes,
                                              }}
                                            >
                                              <span
                                                onClick={() =>
                                                  openModal(item?.description)
                                                }
                                              >
                                                {item?.description?.substring(
                                                  0,
                                                  22
                                                ) + "..."}
                                                <div className="btn-readmore">
                                                  Read More
                                                </div>
                                              </span>
                                            </div>
                                          ) : (
                                            <span>{item?.description}</span>
                                          )}
                                        </div>
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
        {/* List of  Past Events end */}

        {/* List of Member only events start */}
        {showMembersOnlyEvents == true && (
          <>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="slide-list gen-slide green ">
                    <h3
                      style={{
                        color: textColor,
                        fontFamily: headerFonts,
                        fontSize: headerFontSizes,
                      }}
                    >
                      List of Member only events
                    </h3>
                    {loading ? (
                      <TableLoader />
                    ) : memberEvents?.length === 0 ? (
                      <div className="no_data_card">No Member Event Found</div>
                    ) : (
                      <div>
                        <Slider {...MemberEventslist}>
                          {memberEvents &&
                            memberEvents?.map((item) => {
                              return (
                                <React.Fragment key={item?.id}>
                                  <div
                                    className="slide-box"
                                    style={{
                                      color: textColor,
                                      fontFamily: bodyFonts,
                                      fontSize: bodyFontSizes,
                                    }}
                                  >
                                    <div className="slide-content">
                                      <div className="slide-thum">
                                        <img
                                          src={
                                            item?.image ||
                                            "https://sangaraahi.s3.ap-south-1.amazonaws.com/Group%2010906.png"
                                          }
                                        />
                                        <div className="tag-line">Member</div>
                                      </div>
                                      <div className="slide-txt">
                                        {/* <h4>{item?.title}</h4> */}
                                        {item?.title?.length > 30 ? (
                                          <div className="txt">
                                            <div
                                              onClick={() =>
                                                openModal(item?.title)
                                              }
                                              style={{
                                                color: textColor,
                                                fontFamily: bodyFonts,
                                                fontSize: bodyFontSizes,
                                              }}
                                            >
                                              {item?.title?.substring(0, 32) +
                                                "..."}
                                            </div>
                                          </div>
                                        ) : (
                                          <span>{item?.title}</span>
                                        )}{" "}
                                        <div style={{ color: textColor }}>
                                          {item?.description?.length > 50 ? (
                                            <div
                                              className="txt"
                                              style={{
                                                color: textColor,
                                                fontFamily: bodyFonts,
                                                fontSize: bodyFontSizes,
                                              }}
                                            >
                                              <span
                                                onClick={() =>
                                                  openModal(item?.description)
                                                }
                                              >
                                                {item?.description?.substring(
                                                  0,
                                                  22
                                                ) + "..."}
                                                <div className="btn-readmore">
                                                  Read More
                                                </div>{" "}
                                              </span>
                                            </div>
                                          ) : (
                                            <span>{item?.description}</span>
                                          )}
                                        </div>
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
        {/* List of Member only events end */}

        {/* List of Public Announcements start */}
        {showPublicAnnouncement == true && (
          <>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="slide-list gen-slide yellow">
                    <h3
                      style={{
                        color: textColor,
                        fontFamily: headerFonts,
                        fontSize: headerFontSizes,
                      }}
                    >
                      List of Public Announcements
                    </h3>
                    {loading ? (
                      <TableLoader />
                    ) : publicAnnouncements?.length === 0 ? (
                      <div className="no_data_card">
                        No Public Announcement Found
                      </div>
                    ) : (
                      <div>
                        <Slider {...PublicAnnouncementslist}>
                          {publicAnnouncements &&
                            publicAnnouncements?.map((item) => {
                              return (
                                <React.Fragment key={item?.id}>
                                  <div className="slide-box">
                                    <div className="announcement-box">
                                      <div className="top-icon">
                                        <img
                                          src="https://sangaraahi.s3.ap-south-1.amazonaws.com/icon-mike.png"
                                          alt=""
                                        />
                                      </div>
                                      <div className="tag-line">
                                        {item?.toWhom}
                                      </div>
                                      <h5>
                                        {" "}
                                        {item?.title?.length < 35
                                          ? item?.title
                                          : item?.title?.substring(0, 35) +
                                            "..."}
                                      </h5>
                                      <span>
                                        {item?.description?.length < 50
                                          ? item?.description
                                          : item?.description?.substring(
                                              0,
                                              30
                                            ) + "..."}
                                      </span>
                                      <div className="bottom-part">
                                        <div className="left">
                                          {formatDate(item?.endDate)}
                                        </div>
                                        {item?.description?.length > 50 && (
                                          <div className="right">
                                            <span
                                              onClick={() =>
                                                openModal(item?.description)
                                              }
                                            >
                                              Read More
                                            </span>
                                          </div>
                                        )}
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
        {/* List of Public Announcements end */}

        {/* List of Member Announcements start */}
        {showMemberAnnouncement == true && (
          <>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="slide-list gen-slide yellow">
                    <h3
                      style={{
                        color: textColor,
                        fontFamily: headerFonts,
                        fontSize: headerFontSizes,
                      }}
                    >
                      List of Member Announcements
                    </h3>
                    {loading ? (
                      <TableLoader />
                    ) : memberAnnouncements?.length === 0 ? (
                      <div className="no_data_card">
                        No Member Announcement Found
                      </div>
                    ) : (
                      <div>
                        <Slider {...MemberAnnouncementslist}>
                          {memberAnnouncements &&
                            memberAnnouncements?.map((item) => {
                              return (
                                <React.Fragment key={item?.id}>
                                  <div className="slide-box">
                                    <div className="announcement-box">
                                      <div className="top-icon">
                                        <img
                                          src="https://sangaraahi.s3.ap-south-1.amazonaws.com/icon-mike.png"
                                          alt=""
                                        />
                                      </div>
                                      <div className="tag-line">
                                        {item?.toWhom}
                                      </div>
                                      <h5>
                                        {" "}
                                        {item?.title?.length < 20
                                          ? item?.title
                                          : item?.title?.substring(0, 20) +
                                            "..."}
                                      </h5>
                                      <p
                                      // style={{
                                      //   color: textColor,
                                      //   fontFamily: bodyFonts,
                                      //   fontSize: bodyFontSizes,
                                      // }}
                                      >
                                        {item?.description?.length < 50
                                          ? item?.description
                                          : item?.description?.substring(
                                              0,
                                              30
                                            ) + "..."}
                                      </p>
                                      <div className="bottom-part">
                                        <div className="left">
                                          {formatDate(item?.endDate)}
                                        </div>
                                        {item?.description?.length > 50 && (
                                          <div className="right">
                                            <span
                                              onClick={() =>
                                                openModal(item?.description)
                                              }
                                            >
                                              Read More
                                            </span>
                                          </div>
                                        )}
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
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          content={modalContent}
        />
        {/* List of Member Announcements end */}
      </div>
      {/* announcements content end */}
      <Footer />
    </>
  );
}
