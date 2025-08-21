import Link from "next/link";
import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from 'next/navigation';
import api from "../api/api";
import {
  COMMUNITY_BASICS_DETAILS,
  GET_ALL_ANNOUNCEMENT_LIST,
  GET_COMMUNITY_EVENTS,
  GET_COMMUNITY_HOME,
  GET_COMMUNITY_VIDEO,
  GET_MY_COMMUNITY_SETTINGS,
  GetCommunityBlogs,
  GetCommunityIdFromSlug,
  GetMyCommunityGroup,
  GetEventNameWiseList,
  MyCommunityOrgGlobalSearch,
} from "../api/queries";
import ContentComponent from "../../util/ContentComponent";
import Content from "../../util/ContentComponent";

import Modal from "../../util/ModalComponent";
import VideoPlayer from "../../util/VideoPlayer";
import { format } from "date-fns";
import TableLoader from "../../util/TableLoader";
import Header from "./Header";
import moment from "moment";
import { Button } from "react-bootstrap";

const Posts = ({ specCommunity }) => {
  // react Hook For State Handler
  const [videos, setvideos] = useState(null || "");
  const [img, setImg] = useState(null || "");
  const [pulicevents, setPublicevents] = useState([]);
  const [publicAnnouncements, setPublicAnnouncements] = useState([]);
  const [textColor, setTextColor] = useState(null || "");

  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [storeData, setStoreData] = useState(null || "");
  const [bannerimg, setBannertImg] = useState(null || "");
  const [description, setDescription] = useState(null || "");
  const [label, setLabel] = useState(null || "");

  const [profit, setProfit] = useState(null || "");
  const [cultural, setCultural] = useState(null || "");
  const [showPastEvents, setshowPastEvents] = useState(null || "");
  const [showMembersOnlyEvents, setShowMembersOnlyEvents] = useState(
    null || ""
  );
  const [pastEvents, setPastEvents] = useState([]);
  const [memberEvents, setMemberEvents] = useState([]);

  const [memberAnnouncements, setMemberAnnouncements] = useState([]);
  const [showMemberAnnouncement, setShowMemberAnnouncement] = useState(
    null || ""
  );

  const [showPublicAnnouncement, setShowPublicAnnouncement] = useState(
    null || ""
  );

  const [groupList, setGroupList] = useState([]);

  const [modalShown, toggleModal] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null || "");

  const [communityName, setCommunityName] = useState(null || "");

  const [loading, setLoading] = useState(true);

  const [isTruncate, setIsTruncate] = useState(true);

  const [bodyFonts, setbodyFonts] = useState(null || "");
  const [bodyFontSizes, setbodyFontSizes] = useState(null || "");

  const [headerFonts, setheaderFonts] = useState(null || "");
  const [headerFontSizes, setheaderFontSizes] = useState(null || "");

  const [videoStatus, setvideosStatus] = useState("");
  const [announcementPageStatus, setannouncementPage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [publicPage, setPublicPage] = useState("");
  const [blogList, setBlogList] = useState("");
  const [allImages, setallImages] = useState([]);

  const MAX_WORD_LENGTH = 220;

  // const [data, setData] = useState("");

  const router = useRouter();

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

    setvideosStatus(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.videoPage
    );
    setPublicPage(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.publicityPage
    );
    setannouncementPage(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.announcementPage
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
    // window.location.reload();
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

  const openModal = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const plainText = doc.body.textContent || "";
    console.log(plainText, "plainText");
    setModalContent(plainText);
    console.log(modalContent, "modal");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    var data = JSON.parse(localStorage?.getItem("storeData"));
    setStoreData(data);
    setvideosStatus(data?.videoPage);
  }, []);

  // storing logo image and calling a function
  useEffect(() => {
    getCommunityHomeDetails(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getCommunityVideo(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getCommunityEvents(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getPulicAnnouncements(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getCommunityBasicDetails(
      (storeData?.communityId && storeData?.communityId) || null
    );
    getEventdata((storeData?.communityId && storeData?.communityId) || null);
    setshowPastEvents(storeData?.announcementSettings?.showPastEvents || null);
    setShowMembersOnlyEvents(
      storeData?.announcementSettings?.showMembersOnlyEvents || ""
    );
    getMemeberAnnouncements(
      (storeData?.communityId && storeData?.communityId) || ""
    );

    getPastEvents((storeData?.communityId && storeData?.communityId) || "");

    setShowPublicAnnouncement(
      storeData?.announcementSettings?.showPublicAnnouncement || ""
    );
    getMemberEvents((storeData?.communityId && storeData?.communityId) || "");
    getAllBlogList((storeData?.communityId && storeData?.communityId) || "");
    getGroupDetails((storeData?.communityId && storeData?.communityId) || "");
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

  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas, (commId) => {
        getCommunityHomeDetails(commId || null);
        getCommunityVideo(commId || null);
        getCommunityEvents(commId || null);
        getPulicAnnouncements(commId || null);
        getCommunityBasicDetails(commId || null);
        setshowPastEvents(commId || null);
        setShowMembersOnlyEvents(commId || null);
        getMemeberAnnouncements(commId || null);
        getPastEvents(commId || null);
        setShowPublicAnnouncement(commId || null);
        getMemberEvents(commId || null);
        getAllBlogList(commId || null);
        getGroupDetails(commId || null);
        getEventdata(commId || null);
      });
    }
  }, [router]);

  // Calling fetch api for group list
  const getGroupDetails = async (id) => {
    setLoading(true);
    if (id) {
      const response = await api.post("", {
        query: GetMyCommunityGroup,
        variables: {
          data: {
            communityId: id,
            page: 1,
            isActive: true,
            groupType: "Public",
          },
        },
      });
      if (response?.status === 200) {
        setGroupList(response?.data?.data?.getMyCommunityGroup?.data?.groups);
      }
    }
    setLoading(false);
  };

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
        console.log(
          "Community Basic Details: ",
          response?.data?.data?.getCommunityBasicDetails?.data);
        
        setCultural(
          response?.data?.data?.getCommunityBasicDetails?.data?.communityType ||
            ""
        );
        setProfit(
          response?.data?.data?.getCommunityBasicDetails?.data?.nonProfit || ""
        );
        setDescription(
          response?.data?.data?.getCommunityBasicDetails?.data
            ?.communityDescription || ""
        );
        setCommunityName(
          response?.data?.data?.getCommunityBasicDetails?.data?.communityName ||
            ""
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
            ?.announcements
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
        response?.data?.data?.getCommunityHomePageOverviewByID?.data?.logoImage
      );
    }
    setLoading(false);
  };

  // Truncate the descriptions length :
  const truncate = isTruncate
    ? description?.split("").slice(0, MAX_WORD_LENGTH).join("")
    : description;

  // calling an video api to fetch the data
  const getCommunityVideo = async (id) => {
    setLoading(true);
    if (id) {
      const response = await api.post("", {
        query: GET_COMMUNITY_VIDEO,
        variables: {
          data: {
            id: id,
            isOrgPortal: true,
          },
        },
      });
      if (response.status === 200) {
        setvideos(response?.data?.data?.getCommunityVideos?.data);
      }
    }
    setLoading(false);
  };

  // calling an community api to fetch the data
  const getCommunityEvents = async (id) => {
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
        setPublicevents(
          response?.data?.data?.getMyCommunityEvents?.data?.events
        );
      }
    }
    setLoading(false);
  };

  // calling an Pulic Announcements api to fetch the data
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
      if (response.status === 200) {
        setPublicAnnouncements(
          response?.data?.data?.getAllAnnouncementOrganization?.data
            ?.announcements || ""
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

  // get All blogs List
  const getAllBlogList = async (id) => {
    setLoading(true);
    if (id) {
      const response = await api.post("", {
        query: GetCommunityBlogs,
        variables: {
          data: {
            communityId: id,
            blogCategory: "Public",
            // blogStatus: true,
          },
        },
      });
      if (response.status === 200) {
        setBlogList(response?.data?.data?.getAllBlogs?.data?.blogs);
        console.log("=====>>>>",response?.data?.data?.getAllBlogs?.data?.blogs);
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
    setvideos(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.videos || ""
    );
    setPublicevents(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.events
        ?.publicEvents || ""
    );
    setPastEvents(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.events
        ?.pastEvents || ""
    );
    setMemberEvents(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.events
        ?.membersOnlyEvents || ""
    );
    setGroupList(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.groups || ""
    );
    setPublicAnnouncements(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.announcements
        ?.publicAnnouncement || ""
    );
    setMemberAnnouncements(
      response?.data?.data?.myCommunityOrgGlobalSearch?.data?.announcements
        ?.memberAnnouncement || ""
    );

    setLoading(false);
  };

  const allEventsType = [].concat(pulicevents, pastEvents, memberEvents);
  const memberEventTypes = [].concat(publicAnnouncements, memberAnnouncements);

  // Render on every seach and api call :

  // submit search function:

  const handleSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  // show all event memories
  const viewMoreMemories = async () => {
    setLoading(true);
    const response = await api.post("", {
      query: GET_MY_COMMUNITY_SETTINGS,
      variables: {
        data: {
          communityId: storeData?.communityId && storeData?.communityId,
        },
      },
    });

    router.push({
      pathname: `/${response?.data?.data?.getMyCommunitiesSettingsView?.data?.slug}/EventMemories`,
    });
    setLoading(false);
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
        setallImages(() => {
          let newImages = [];
          for (const event of eventsData) {
            if (Array.isArray(event.images)) {
              newImages.push(...event.images);
            }
          }
          return newImages;
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // global searching all logic ends

  // slider configuration for videolist
  var videolist = {
    arrows: true,
    // dots: false,
    dots: true,
    infinite: true,
    speed: 500,
    // slidesToShow: 4,
    slidesToShow: 3,
    slidesToShow: videos?.length > 3 ? 3 : videos?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow: videos?.length > 3 ? 3 : videos?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToShow: videos?.length > 2 ? 2 : videos?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow: videos?.length > 1 ? 1 : videos?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };
  // slider configuration for bloglist
  var bloglistEvent = {
    arrows: true,
    dots: false,
    speed: 500,
    infinite: false,
    slidesToShow: 4,
    slidesToShow: blogList?.length > 4 ? 4 : blogList?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow: blogList?.length > 3 ? 3 : blogList?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToShow: blogList?.length > 2 ? 2 : blogList?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow: blogList?.length > 1 ? 1 : blogList?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // slider configuration for eventGrouplist
  var eventGrouplist = {
    arrows: true,
    dots: true,
    speed: 500,
    infinite: false,
    // slidesToShow: 4,
    // slidesToShow: groupList?.length > 4 ? 4 : groupList?.length,
    slidesToShow: 3,
    slidesToShow: groupList?.length > 3 ? 3 : groupList?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow: groupList?.length > 3 ? 3 : groupList?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToShow: groupList?.length > 2 ? 2 : groupList?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow: groupList?.length > 1 ? 1 : groupList?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };
  //slider configuration for events
  var eventsdata = {
    arrows: true,
    // dots: false,
    dots: true,
    speed: 500,
    infinite: false,
    slidesToShow: 4,
    slidesToShow: allImages?.length > 4 ? 4 : allImages?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow: allImages?.length > 3 ? 3 : allImages?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToShow: allImages?.length > 2 ? 2 : allImages?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow: allImages?.length > 1 ? 1 : allImages?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // slider configuration for eventlist
  var eventlist = {
    arrows: true,
    dots: true,
    speed: 500,
    infinite: false,
    // slidesToShow: 4,
    slidesToShow: 3,
    // slidesToShow: allEventsType?.length > 4 ? 4 : allEventsType?.length,
    slidesToShow: allEventsType?.length > 3 ? 3 : allEventsType?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow: allEventsType?.length > 3 ? 3 : allEventsType?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToShow: allEventsType?.length > 2 ? 2 : allEventsType?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow: allEventsType?.length > 1 ? 1 : allEventsType?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // slider configuration for announcementlist
  var announcementlist = {
    arrows: true,
    // dots: false,
    dots: true,
    speed: 500,
    infinite: false,
    // slidesToShow: 4,
    // slidesToShow: memberEventTypes?.length > 4 ? 4 : memberEventTypes?.length,
    slidesToShow: 3,
    slidesToShow: memberEventTypes?.length > 3 ? 3 : memberEventTypes?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow:
            memberEventTypes?.length > 3 ? 3 : memberEventTypes?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToShow:
            memberEventTypes?.length > 2 ? 2 : memberEventTypes?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow:
            memberEventTypes?.length > 1 ? 1 : memberEventTypes?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };
//  banner image parallex
  const convertToPlainText = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    return doc.body.textContent || "";
  };

  //  --- text character limit -- scripte start ----
  const truncateText = (text, limit = 50) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };
  const eventTitle = "Blog Title -- This is a very long event title that should be truncated for display purposes";
  //  --- text character limit -- scripte end ----

  return (
    <>
      <Header
        handleSubmit={handleSubmit}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
      />
      {/* -- old -- home banner start */}

      <section className="inner_banner banner_community">
        <div className="community_banner_bg"  
            style={{
              backgroundImage: "url('https://cdn.memiah.co.uk/blog/wp-content/uploads/counselling-directory.org.uk/2019/04/shutterstock_1464234134-1024x684.jpg')",                    
            }}>
              <div className="banner_comm_name_block">
                {communityName && <h3>{communityName}</h3>}
                <div className="breadcrumbs">
                  <ul>
                    <li>
                      <a href="/">Home</a>
                    </li>
                    <li>
                      Featured Communities
                    </li>
                  </ul>
                </div>
              </div>
        </div>
      </section>
      {description &&  <section className="inner_sec_row carousel_sec video_list_sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
                <div
                  className="description"
                  dangerouslySetInnerHTML={{
                    __html:description,
                  }}
                />
          </div>
          </div>
        </div>
        </section>}

      <section className="inner_sec_row carousel_sec video_list_sec">

        {videoStatus && (
          <>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="slide-list green video-list slide_card">
                    {/* {
                } */}

                    <h3
                      style={{
                        color: textColor,
                        fontFamily: headerFonts,
                        fontSize: headerFontSizes,
                      }}
                    >
                      List of Videos
                    </h3>
                    <div>
                      {loading ? (
                        <TableLoader />
                      ) : videos?.length === 0 ? (
                        <div className="no_data_card">No Videos Found</div>
                      ) : (
                        <div>
                          <Slider {...videolist}>
                            {videos &&
                              videos?.map((item) => {
                                return (
                                  <React.Fragment key={item?.id}>
                                    <div
                                      className="video-frame"
                                      style={{ color: textColor }}
                                    >
                                      <VideoPlayer
                                        videoUrl={
                                          item?.link || "https://www.youtube.com/"
                                        }
                                      />
                                      
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
            </div>
          </>
        )}

      </section>

      <section className="inner_sec_row carousel_sec event_list_sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="slide-list event-list slide_card">
                <h3
                  style={{
                    color: textColor,
                    fontFamily: headerFonts,
                    fontSize: headerFontSizes,
                  }}
                >
                  List of All Events
                </h3>
                {loading ? (
                  <TableLoader />
                ) : allEventsType?.length === 0 ? (
                  <div className="no_data_card">No Events Found</div>
                ) : (
                  <div>
                    <Slider {...eventlist}>
                      {allEventsType &&
                        allEventsType?.map((item) => {
                          return (
                            <React.Fragment key={item?.id}>
                              <div
                                className="slide-box event_list_card"
                                style={{ color: textColor , cursor: 'pointer' }}
                                onClick={()=>router.push({
      pathname: `/${router.query.cummunity_slug}/EventDetails`,
      query: { id: item?.id },
    })}
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

                                  {/* -- new content block -- start --  */}
                                    <div className="event_content_block">
                                      <div className="event_card_time">
                                        <span>
                                          {new Date(item?.time?.from).toLocaleString(
                                            "default",
                                            {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                            }
                                          )}
                                        </span>{" "}
                                        |{" "}
                                        <span>
                                          {new Date(item?.time?.from).toLocaleTimeString(
                                            "en-US",
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            }
                                          )}{" "}
                                          -{" "}
                                          {new Date(item?.time?.to).toLocaleTimeString(
                                            "en-US",
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            }
                                          )}
                                        </span>
                                      </div>
                                      <div className="event_card_title">
                                        <h4>{item?.title}</h4>
                                      </div>
                                      <div className="event_card_des">
                                        <p>
                                          {item?.description
                                            ? item?.description.replace(/<[^>]+>/g, "").replace(/<(.|\n)*?>/g, '').length > 40
                                              ? item?.description.replace(/<[^>]+>/g, "").replace(/<(.|\n)*?>/g, '').substring(0, 40) + "..."
                                              : item?.description.replace(/<[^>]+>/g, "").replace(/<(.|\n)*?>/g, '')
                                            : ""}
                                        </p>
                                      </div>
                                      <div className="event_card_user">
                                        <div className="event_user_img_block">
                                            <img className="event_user_img" src={"https://developmentmatrix.s3.ap-south-1.amazonaws.com/comp%20logo002.png"} />
                                        </div>
                                        <div className="event_user_details">
                                            <b>Arnab Sadhukhan</b> is inviting you for the event
                                        </div>
                                      </div>
                                    </div>
                                  {/* -- new content block -- end --  */}
                                
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
      </section>

      <section className="inner_sec_row carousel_sec announcements_list_sec">
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
                  List of All Announcements
                </h3>

                <div className="annoucement_slider">

                  {loading ? (
                      <TableLoader />
                    ) : memberEventTypes?.length === 0 ? (
                      <div className="no_data_card">No Announcement Found</div>
                    ) : (
                      <div>
                        <Slider {...announcementlist}>
                          {memberEventTypes &&
                            memberEventTypes?.map((item) => {
                              return (
                                <React.Fragment key={item?.id}>
                                  <div className="slide-box">
                                    <div className=" announcement_slide">

                                      <a  href="#">
                                        <div className="announcement_card">
                                            <div className="annu_date annu_left">
                                              29
                                              <h6>April</h6>
                                            </div>
                                            <div className="annu_details annu_right">
                                              <h5>Lorem ipsum dolor sit</h5>
                                              <p>Lorem ipsum dolor testersit consectetur adipiscing elit.</p>
                                            </div>
                                        </div>
                                      </a>

                                      <a  href="#">
                                        <div className="announcement_card">
                                            <div className="annu_date annu_left">
                                              23
                                              <h6>June</h6>
                                            </div>
                                            <div className="annu_details annu_right">
                                              <h5>Lorem ipsum dolor sit</h5>
                                              <p>Lorem ipsum dolor testersit consectetur adipiscing elit.</p>
                                            </div>
                                        </div>
                                      </a>

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

          <div className="row">
            <div className="col-lg-12">
              
            </div>
          </div>

        </div>
      </section>


      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="slide-list event-list gen-slide red">
              <h3
                style={{
                  color: textColor,
                  fontFamily: headerFonts,
                  fontSize: headerFontSizes,
                }}
              >
                List of Event Memories -- ( ** old section ** )
              </h3>

              {loading ? (
                <TableLoader />
              ) : allImages?.length === 0 ? (
                <div className="no_data_card">No Event Memories Found</div>
              ) : (
                <div>


                  {/* ==============   new card for event memory listing -- start ===============   */}

                  <Slider {...eventsdata}>
                    {allImages &&
                      allImages?.map((item) => {
                        return (
                          <React.Fragment key={item?.id}>
                            <div
                              className="slide-box"
                              style={{ color: textColor }}
                            >
                              <div className="slide-content eventMemory_block_img_bg">
                                <div className="eventMemory_img">
                                  <img
                                    src={
                                      item?.uploadedImage ||
                                      "https://sangaraahi.s3.ap-south-1.amazonaws.com/Group%2010906.png"
                                    }
                                    alt=""
                                  />
                                </div>
                                <div className="eventMemory_hoverContent">
                                  <div className="eventMemory_event_details_block">
                                    <h5>
                                      <span>Uploaded on :</span>{" "}
                                      {formatDate(item?.createdAt)}
                                    </h5>
                                    <h4>Uploaded By : </h4>
                                    <div className="upload_by">
                                      <div className="upload_user_avatar">
                                        <img
                                          src={
                                            item?.profileImage ||
                                            "https://sangaraahi.s3.ap-south-1.amazonaws.com/Group%2010906.png"
                                          }
                                          alt=""
                                        />
                                      </div>
                                      <div className="upload_user_name">
                                        {item?.uploadedBy}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                  </Slider>

                   {/* ==============   new card for event memory listing -- end  ===============   */}

                  {/* VIEW MORE EVENTS BUTTON */}
                  <div className="view_more_btn_sec">
                    <button
                      onClick={viewMoreMemories}
                      className="button_appearance_none list_view_more_btn"
                    >
                      View More
                    </button>
                  </div>

                </div>
              )}




            </div>
          </div>
        </div>
      </div>
      

      {/* <!-- old Event Memories -- end ==========================    --> */}

      {/* test new blog list end */}


      {/* Blog -- new start */}
      {blogList && blogList?.length > 0  &&
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
                    {blogList[0] &&
                    <div className="col-lg-6 blog_left">
                      <div className="blog_box_bg blog_box_big">
                        <div className="blog_box">
                          <div className="blog_img">
                            <img src={blogList[0].thumbnailImage && blogList[0].thumbnailImage ? blogList[0].thumbnailImage : ""} />
                          </div>

                          <div className="blog_cont">
                            <div className="event_content_block">
                              <div className="event_card_time">
                                <span>{formatDate(blogList[0].createdAt)}</span> 
                                {/* <span>{formatTimeUp(blogList[0].createdAt)}</span> */}
                              </div>
                              <div className="event_card_title">
                                <h4>{blogList[0]?.blogTitle}</h4>
                                {/* <h4>{truncateText(eventTitle, 50)}</h4> */}
                              </div>
                              <div className="event_card_des">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: blogList[0]?.blogShortDesc,
                                  }}
                                ></p>
                              </div>
                              <div className="slide_btn_block slide_card_btn_block">
                                <button
                                  className="button_appearance_none"
                                  onClick={() => {
                                    router.push(
                                      `/${router.query.cummunity_slug}/BlogDetails?id=${blogList[0]?.id}`
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
                    {blogList[1] &&
                    <div className="col-lg-6 blog_right">
                      {blogList.slice(1).map((item, index) =>(
                      <div className="blog_box_bg blog_small_bg">
                        <div className="blog_box blog_box_small">
                          <div className="blog_img">
                            <img src={item?.thumbnailImage && item?.thumbnailImage ? item?.thumbnailImage : ""} />
                          </div>

                          <div className="blog_cont">
                            <div className="event_content_block">
                              <div className="event_card_time">
                                <span>{formatDate(item?.createdAt)}</span>
                                {/* <span>{formatTimeUp(item?.createdAt)}</span> */}
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

      {/* Blog -- new start */}



    </>
  );
};
export default Posts;
