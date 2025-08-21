import Slider from "react-slick";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import api from "../api/api";
import {
  COMMUNITY_BASICS_DETAILS,
  GET_COMMUNITY_HOME,
  GET_MY_COMMUNITY_SETTINGS,
  GetCommunityBlogs,
  GetDateWiseList,
  GetEventNameWiseList,
} from "../api/queries";
import TableLoader from "../../util/TableLoader";
import Header from "../components/Header";
import moment from "moment";
import { format } from "date-fns";
import { useMemo } from "react";
import { addDays } from 'date-fns';
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

const EventMemories = ({ specCommunity }) => {
  // react Hook For State Handler
  const [img, setImg] = useState(null || "");
  const [textColor, setTextColor] = useState(null || "");
  const [storeData, setStoreData] = useState(null || "");
  const [bannerimg, setBannertImg] = useState(null || "");
  const [description, setDescription] = useState(null || "");
  const [profit, setProfit] = useState(null || "");
  const [cultural, setCultural] = useState(null || "");
  const [communityName, setCommunityName] = useState(null || "");
  const [loading, setLoading] = useState(true);
  const [bodyFonts, setbodyFonts] = useState(null || "");
  const [bodyFontSizes, setbodyFontSizes] = useState(null || "");
  const [headerFonts, setheaderFonts] = useState(null || "");
  const [headerFontSizes, setheaderFontSizes] = useState(null || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [publicPage, setPublicPage] = useState("");
  const [blogList, setBlogList] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [filteringType, setFilteringType] = useState([]);
  const [selectedOption, setSelectedOption] = useState("events");
  const [allImages, setallImages] = useState([]);
  const [filterData, setfilterData] = useState("");
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  // const [data, setData] = useState("");
  const selectionRangeOption =  {
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  };
  const [selectionRange, setSelectionRange] = useState([]);
  const router = useRouter();

  const openModalOpen = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen === false) {
      setfilterData("");
      setIsOptionSelected(false);
      setIsRangeOpen(false);
      setSelectionRange([selectionRangeOption]);
    }
  };
  useEffect(() => {
    console.log('selectionRange--->', selectionRange)
  }, [selectionRange])

  const closeModel = () => {
    setIsModalOpen(false);
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
    // window.location.reload();
  };


  const getFilterdata = async (event, id, extraFilter = false) => {
    const selectedOption = event.target.value;
    setSelectedOption(selectedOption);
    let data = {
      communityId: id
    };
    if(selectionRange.length > 0 && extraFilter) {
      data.startDate = selectionRange[0].startDate ? selectionRange[0].startDate : new Date();
      data.endDate = selectionRange[0].endDate ? selectionRange[0].endDate : new Date();
    }
    try {
      setLoading(true);
      if (selectedOption === "events") {
        const response = await api.post("", {
          query: GetEventNameWiseList,
          variables: {
            data: data,
          },
        });

        if (response.status === 200) {
          setFilteringType(
            response?.data?.data?.orgImageListEventWise?.data?.events
          );
        }
      } else {
        const response = await api.post("", {
          query: GetDateWiseList,
          variables: {
            data: data,
          },
        });

        if (response.status === 200) {
          setFilteringType(
            response?.data?.data?.orgImageListDateWise?.data?.events
          );
          const eventsData =
            response?.data?.data?.orgImageListDateWise?.data?.events[0]
              ?.images || [];
          setallImages(eventsData);
        }
      }
    } catch (error) {
      console.error("Error fetching filter data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicPage === false) {
      router.push("/NotFoundScreen");
    }
  }, [publicPage]);

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
    getFilterdata(
      { target: { value: selectedOption } },
      storeData?.communityId && storeData?.communityId
    );
    getAllBlogList((storeData?.communityId && storeData?.communityId) || "");
    setTextColor(storeData?.textColor || "");
    setbodyFonts(storeData?.bodyFont || "");
    setbodyFontSizes(storeData?.bodyFontSize || "");
    setheaderFonts(storeData?.headerFont || "");
    setheaderFontSizes(storeData?.headerFontSize || "");
    document.body.style.backgroundColor = storeData?.backgroupColor;
  }, [storeData, selectedOption]);

  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas, (commId) => {
        getCommunityHomeDetails(commId || null);
        getCommunityBasicDetails(commId || null);
        getAllBlogList(commId || null);
        getFilterdata({ target: { value: selectedOption } }, commId || null);
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
        response?.data?.data?.getCommunityHomePageOverviewByID?.data?.logoImage
      );
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
            page: 1,
            search: "",
          },
        },
      });
      if (response.status === 200) {
        setBlogList(response?.data?.data?.getAllBlogs?.data?.blogs);
      }
    }
    setLoading(false);
  };

  // Handle search functionality :
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to chunk the array into rows
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    let currentChunk = [];

    for (let i = 0; i < array.length; i++) {
      currentChunk.push(array[i]);

      if (currentChunk.length === chunkSize || i === array.length - 1) {
        const remainingElements = array.length - i - 1;
        if (remainingElements < 4) {
          chunks.push([...currentChunk, ...array.slice(i + 1)]);
          break;
        } else {
          chunks.push(currentChunk);
          currentChunk = [];
        }
      }
    }

    return chunks;
  };

  // Memoize the rows calculation
  const rows = chunkArray(allImages, 6);
  //slider configuration for events
  var eventsdata = {
    arrows: false,
    dots: false,
    speed: 500,
    autoplaySpeed: 1000,
    infinite: true,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: true,
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
  // add eventlistener to close the modal by clicking outside the  modal

  // converting date format:
  function formatDate(dateString) {
    const date = new Date(dateString);
    const formatDate = format(date, "MM-dd-yy");
    return formatDate;
  }

 
  return (
    <>
      <Header handleSearch={handleSearch} searchTerm={searchTerm} />
      {/* home banner start */}
      {bannerimg ? (
        <div className="home-banner">
          <img src={bannerimg} alt="" />
        </div>
      ) : (
        <div className="home-fade">
          <img
            src={
              "https://sangaraahi.s3.ap-south-1.amazonaws.com/Group%2010926.png"
            }
            alt=""
          />
        </div>
      )}

      {/* home banner end */}
      {/* banner button start */}
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="banner-button">
              <div className="btn-cultural">{cultural} Community</div>
              <div className="logo-pic">
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
              <div className="btn-nonprofit">
                {profit ? "For Profit Organization" : "Non Profit Organization"}{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* banner button end */}
      {/* home txt start */}

      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="home-txt">
              <h2
                style={{
                  color: textColor,
                  fontFamily: headerFonts,
                  fontSize: headerFontSizes,
                }}
              >
                {communityName || ""}{" "}
              </h2>

              <div
                style={{
                  color: textColor,
                  fontFamily: bodyFonts,
                  fontSize: bodyFontSizes,
                }}
              >
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- ==========================    --> */}

      {/* <!-- =========== event list sec-- start ===============    --> */}
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="list_sec list_sec_title">
              <div className="sec_title_left">
                <h3 className="secTitle">Event Memories</h3>
              </div>
              <div className="sec_title_right">
                <div className="title_sec_filter">
                  <select
                    className="input_appearance_none filter_select"
                    onChange={(event) =>{
                     
                      if(event.target.value === "datewise"){
                        setSelectedOption("datewise");
                        openModalOpen()
                      } else {
                        getFilterdata(event, storeData?.communityId)
                        closeModel()
                      }
                     
                    }                    
                    }
                    value={selectedOption}
                  >
                    <option value="events">Events</option>
                    <option value="collage">Year Wise</option>
                    <option value="slideshow">SlideShow</option>
                    <option value="datewise">Date Wise</option>
                  </select>
                </div>
               
              </div>
            </div>

            {isModalOpen && (
              <div className="filter_bottom open">
                <h3>Filter Event Datewise</h3>

                <div className="filter_bottom_block">

                  {/* ---  date range picker -- ui start --- */}
                 
                    <div className="div_daterange filter_show_left">
                      <DateRangePicker
                        className="dateRange_ui"
                        onChange={item => setSelectionRange([item.selection])}                      
                        ranges={selectionRange}
                        direction="horizontal"
                      />
                    </div>
                 
                   <div className="div_daterange filter_show_right button-container div_daterange_btn">
                      <button
                        className="button_appearance_none  bg_pink"
                        onClick={closeModel}
                      >
                        Cancel
                      </button>
                      <button
                        className="button_appearance_none bg_green"
                        onClick={() =>{
                          const ev = {
                            target:{
                              value: "datewise"
                            }
                          }
                          setIsModalOpen(false)
                          getFilterdata(ev, storeData?.communityId, true)

                          
                         
                        }   }
                      >
                        {" "}
                        Filter
                      </button>
                      
                    </div>

                  {/* ---  date range picker -- ui end --- */}
                </div>
              </div>
            )}

            {loading ? (
              <TableLoader />
            ) : filteringType?.length === 0 ? (
              <div className="no_data_card">No Event Memories Found</div>
            ) : (
              <>
                {filteringType &&
                  filteringType.map((data) => {
                    return (
                      <div className="list_wrap_block">
                        {selectedOption === "events" ||
                        selectedOption === "collage" ? (
                          <div className="memorytimeline_year">
                            <h4>
                              <span className="timeline_year">
                                {data?.eventName || data?.yearOfUpload}
                              </span>
                              <span className="sideBorder"></span>
                            </h4>
                          </div>
                        ) : (
                          ""
                        )}
                        {selectedOption === "events" ||
                        selectedOption === "collage" ? (
                          <div className="event_list_bg">
                            {data?.images &&
                              data?.images.map((item) => {
                                return (
                                  <div
                                    className="event_list_block"
                                    key={item.id}
                                  >
                                    <div className="event_img_block">
                                      <img
                                        className="event_img"
                                        src={
                                          item?.uploadedImage ||
                                          "https://sangaraahi.s3.ap-south-1.amazonaws.com/Group%2010906.png"
                                        }
                                      ></img>
                                    </div>
                                    <div className="event_details_block">
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
                                          ></img>
                                        </div>
                                        <div className="upload_user_name">
                                          {item?.uploadedBy}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : rows && rows[0] && rows[0].length > 3 ? (
                          rows.map((row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                              <Slider
                                {...eventsdata}
                                className="custom_slickSlider"
                                rtl={rowIndex % 2 === 0}
                              >
                                {row &&
                                  row.map((item) => (
                                    <React.Fragment key={item?.id}>
                                      <div
                                        className="event_list_bg"
                                        style={{ color: textColor }}
                                      >
                                        <div className="event_listing_slideshow_block">
                                          <div className="imageshow">
                                            <img
                                              className="event_img"
                                              src={
                                                item?.uploadedImage ||
                                                "https://sangaraahi.s3.ap-south-1.amazonaws.com/Group%2010906.png"
                                              }
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  ))}
                              </Slider>
                            </React.Fragment>
                          ))
                        ) : (
                          <>
                            {/* =========== edit new code start  =============   */}
                            <div className="event_list_bg 111">
                              {data?.images &&
                                data?.images.map((item) => {
                                  return (
                                    <div
                                      className="event_listing_slideshow_block event_list_block"
                                      key={item.id}
                                    >
                                      <div className="imageshow">
                                        <img
                                          className="event_img"
                                          src={item?.uploadedImage}
                                        ></img>
                                      </div>
                                      <div className="eventList_slideshow_cont">
                                        <h4>
                                          <span>Uploaded on :</span>{" "}
                                          {formatDate(item?.createdAt)}
                                        </h4>
                                        <h4>Uploaded By : </h4>
                                        <div className="upload_by">
                                          <div className="upload_user_avatar">
                                            <img
                                              src={item?.uploadedImage}
                                              alt=""
                                            ></img>
                                          </div>
                                          <div className="upload_user_name">
                                            {item?.uploadedBy}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                            {/* =========== edit new code end =============   */}
                          </>
                        )}
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* <!-- =========== event list sec-- end ===============    --> */}

      {/* test new blog list end */}
    </>
  );
};
export default EventMemories;
