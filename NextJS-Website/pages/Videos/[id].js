import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import React, { useEffect, useState } from "react";
import {
  COMMUNITY_BASICS_DETAILS,
  GET_ALL_ANNOUNCEMENT_LIST,
  GET_COMMUNITY_HOME,
  GET_COMMUNITY_VIDEO,
  GET_MY_COMMUNITY_SETTINGS,
  MyCommunityOrgGlobalSearch,
} from "../api/queries";
import api from "../api/api";
import VideoPlayer from "../../util/VideoPlayer";
import { useRouter } from "next/router";
import TableLoader from "../../util/TableLoader";
import Modal from "../../util/ModalComponent";
import moment from "moment";

export default function Videos(props) {
  // react Hook For State Handler
  const [storeData, setStoreData] = useState("");
  const [videos, setvideos] = useState(null);
  const [textColor, setTextColor] = useState(null);
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [label, setLabel] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTruncate, setIsTruncate] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [bodyFonts, setbodyFonts] = useState("");
  const [bodyFontSizes, setbodyFontSizes] = useState("");

  const [headerFonts, setheaderFonts] = useState("");
  const [headerFontSizes, setheaderFontSizes] = useState("");
  const [background, setBackGround] = useState("");

  // calling a function to open a modal
  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  // calling a function to close a modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Restrict the max word to 220
  const MAX_WORD_LENGTH = 220;

  // Truncate the descriptions length :
  const truncate = isTruncate
    ? description.split("").slice(0, MAX_WORD_LENGTH).join("")
    : description;

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
  };

  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas, (commId) => {
        getCommunityHomeDetails(commId && commId);
        getCommunityVideo(commId && commId);
        getCommunityName(commId && commId);
        getCommunityBasicDetails(commId && commId);
      });
    }
  }, [router]);

  useEffect(() => {
    var data = JSON.parse(localStorage?.getItem("storeData"));
    setStoreData(data);
  }, []);

  useEffect(() => {
    getCommunityHomeDetails(storeData?.communityId && storeData?.communityId);
    getCommunityVideo(storeData?.communityId && storeData?.communityId);
    getCommunityName(storeData?.communityId && storeData?.communityId);
    getCommunityBasicDetails(storeData?.communityId && storeData?.communityId);
    setTextColor(storeData?.textColor);
    setLabel(storeData?.lebel);
    setbodyFonts(storeData?.bodyFont);
    setbodyFontSizes(storeData?.bodyFontSize);
    setheaderFonts(storeData?.headerFont);
    setheaderFontSizes(storeData?.headerFontSize);
    document.body.style.backgroundColor = storeData?.backgroupColor;
  }, [storeData]);

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
      setImg(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data?.logoImage
      );
      setDescription(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data
          ?.communityDescription || ""
      );
      setBackGround(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data
          ?.backgroupColor || ""
      );
      //     document.body.style.backgroundColor =
      //     response?.data?.data?.getCommunityHomePageOverviewByID?.data?.backgroupColor;
      // }
      // document.body.style.backgroundColor = storeData?.backgroupColor;
    }
    setLoading(false);
  };

  const getCommunityName = async (id) => {
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
        // setDescription(
        //   response?.data?.data?.getCommunityBasicDetails?.data
        //     ?.communityDescription || ""
        // );
        setCommunityName(
          response?.data?.data?.getCommunityBasicDetails?.data?.communityName ||
            ""
        );
      }
    }
    setLoading(false);
  };

  const [community, setCommunity] = useState(null);

  // search state
  const [searchTerm, setSearchTerm] = useState("");

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
    setvideos(response?.data?.data?.myCommunityOrgGlobalSearch?.data?.videos);
    setLoading(false);
  };

  // Render on every seach and api call :

  // submit search function:

  const handleSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  return (
    <>
      <Header
        handleSubmit={handleSubmit}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
      />{" "}
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
                  <div>
                    <img
                      src={
                        img ||
                        "https://sangaraahi.s3.ap-south-1.amazonaws.com/group%201.png"
                      }
                      alt=""
                    />
                  </div>
                </div>
                <div className="txt">
                  <h3> {communityName || ""}</h3>

                  <div>{description}</div>
                  {/* <p>
                    {truncate.length > 120
                      ? truncate.substring(0, 190) + "..."
                      : truncate}

                    {description.split("").length > 120 && isTruncate && (
                      <div>
                        <span
                          className="btn-more-popup"
                          onClick={() => openModal(description)}
                        >
                          Read More
                        </span>
                      </div>
                    )}
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="video-content">
          <div className="col-lg-12">
            {loading ? (
              <TableLoader />
            ) : videos?.length === 0 ? (
              <div className="no_data_card">No Videos Found</div>
            ) : (
              <ul className="video-display-list">
                {videos &&
                  videos?.map((item) => {
                    return (
                      <React.Fragment key={item?.id}>
                        <li>
                          <div className="video-box">
                            <Link href={item?.link || ""}>
                              <VideoPlayer
                                videoUrl={
                                  item?.link || "https://www.youtube.com/"
                                }
                              />
                            </Link>
                            <Link
                              href={item?.link || ""}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <i className="icon-next">
                                <img
                                  src="https://sangaraahi.s3.ap-south-1.amazonaws.com/arrow-right.png"
                                  alt=""
                                />
                              </i>
                            </Link>
                            <span className="play"></span>
                          </div>
                          <div className="video-info">
                            <h4
                            // style={{
                            //   color: textColor,
                            //   fontFamily: headerFonts,
                            //   fontSize: headerFontSizes,
                            // }}
                            >
                              {item?.title?.length > 30 ? (
                                <div className="txt">
                                  <div
                                    onClick={() => openModal(item?.title)}
                                    style={{
                                      color: textColor,
                                      fontFamily: bodyFonts,
                                      fontSize: bodyFontSizes,
                                    }}
                                  >
                                    {item?.title?.substring(0, 32) + "..."}
                                  </div>
                                </div>
                              ) : (
                                <div>{item?.title}</div>
                              )}{" "}
                            </h4>
                            <p
                              style={{
                                color: textColor,
                                fontFamily: bodyFonts,
                                // fontSize: bodyFontSizes,
                              }}
                            >
                              {item?.description?.length > 10 &&
                                item?.description?.substring(0, 50) + "..."}
                            </p>
                            <div className="video-footer">
                              <span
                                className="video-age"
                                style={{
                                  color: textColor,
                                  fontFamily: bodyFonts,
                                  // fontSize: bodyFontSizes,
                                }}
                              >
                                {moment(item?.createdAt).format("MMMM Do YYYY")}
                              </span>
                              <span
                                className="video-duration"
                                style={{
                                  color: textColor,
                                  fontFamily: bodyFonts,
                                  // fontSize: bodyFontSizes,
                                }}
                              >
                                {item?.duration}
                              </span>
                            </div>
                          </div>
                        </li>
                      </React.Fragment>
                    );
                  })}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        content={modalContent}
      />
      {/* video content end */}
      <Footer />
    </>
  );
}
