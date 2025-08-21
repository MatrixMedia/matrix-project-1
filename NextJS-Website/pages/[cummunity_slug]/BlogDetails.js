import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api/api";
import {
  GET_MY_COMMUNITY_SETTINGS,
  GetAllUploadImage,
  GetBolgsById,
  GetCommunityBlogs,
  GetEventDetailsWithId,
  getMyCommunityEventByID,
  Countrydialcode,
  GetPhoneNumber,
  GetOtpVerification,
  GetPackageVerification,
  BlogsByCommunity,
} from "../api/queries";

const BlogDetails = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [textColor, setTextColor] = useState(null || "");
  const [headerFonts, setheaderFonts] = useState(null || "");
  const [headerFontSizes, setheaderFontSizes] = useState(null || "");
  const [activeTab, setActiveTab] = useState("pictures");
  const [storeData, setStoredData] = useState("");
  const [blogData, setBlogData] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  const getSliderSettings = (length) => ({
    autoplay: true,
    arrows: true,
    dots: true,
    infinite: length > 3,
    initialSlide: 0,
    slidesToShow: Math.min(length, 3),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(length, 3),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: Math.min(length, 2),
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
  });

  useEffect(() => {
    if (router?.query?.id && storeData?.communityId) {
      getAllBlogListById(router.query.id);
      getAllBlogList();
    }
  }, [router.query.id, storeData?.communityId]);

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
  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas);
    }

    let data = null;
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = localStorage.getItem("storeData");
      try {
        if (raw && raw !== "undefined") {
          data = JSON.parse(raw);
        }
      } catch (err) {
        console.error("Failed to parse storeData:", err);
      }
    }

    setStoredData(data);
  }, [router]);

  const getAllBlogList = async () => {
    if (storeData?.communityId) {
      const response = await api.post("", {
        query: GetCommunityBlogs,
        variables: {
          data: {
            communityId: storeData?.communityId,
            blogCategory: "Public",
          },
        },
      });
      if (response.status === 200) {
        console.log(
          response?.data?.data?.getAllBlogs?.data?.blogs,
          "=====>>>>"
        );
        setRelatedBlogs(response?.data?.data?.getAllBlogs?.data?.blogs);
      }
    }
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
        console.log("Blog =======>>>>>>>", response);
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
  return (
    <>
      <Header />
      {/* ======================= Blog Page -- start ===============================  */}

      {/* Banner inner new start ---  */}
      <div
        className="banner_inner_sec inner_banner_event"
        style={{
          backgroundImage: `url(${blogData?.thumbnailImage})`,
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      ></div>
      {/* Banner inner new end ---  */}

      {/* event details Title / Description -- new start ---  */}
      <section className="inner_page_sec innerPage_eventDetails">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="eventDetails_title">
                <h2>{blogData?.eventName}</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="blog_category">
                <span className="catLabel">Category :</span>
                <span className="cat_ul_span">
                  <ul>
                    <li>
                      <a href="#">Cultural Events</a>
                    </li>
                    <li>
                      <a href="#">Live Performances</a>
                    </li>
                    <li>
                      <a href="#">Educational & Workshops</a>
                    </li>
                    <li>
                      <a href="#">Community & Festivals</a>
                    </li>
                  </ul>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* event details Title / Description -- new end ---  */}

      {/* event details User -- new start ---  */}
      <section className="inner_page_sec innerPage_eventDetails">
        <div className="container">
          <div className="user_avatar_row border_topBottom">
            <div className="row">
              <div className="col-lg-8 col-md-9">
                <div className="eventDetails_top">
                  <div className="event_admin">
                    <div className="event_admin_img">
                      <img src={"/images/aboutImage01.png"} alt="" />
                    </div>
                    <div className="event_admin_name">
                      <b>{blogData?.postedBy}</b> is Posted |{" "}
                      {new Date(blogData?.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-3">
                <div className="social_share_inner footer_social">
                  <ul>
                    {blogData?.fbLink &&
<li>
                      <a href= {blogData?.fbLink} target="_blank">
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                      </a>
                    </li>
                    }
                    
                    {blogData?.twitterLink &&
                    <li>
                      <a href= {blogData?.twitterLink} target="_blank">
                        <i className="fa fa-twitter" aria-hidden="true"></i>
                      </a>
                    </li>
                    }
                    {blogData.likedinLink &&
                    <li>
                      <a href= {blogData?.likedinLink} target="_blank">
                        <i className="fa fa-linkedin" aria-hidden="true"></i>
                      </a>
                    </li>
                    }
                    
                  </ul>
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
                <div
                  dangerouslySetInnerHTML={{
                    __html: blogData?.blogDescription,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* event details Title / Description -- new end ---  */}

      {/* events Pic Section -- new start */}
      {blogData?.image?.length > 0 && 
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
                  Photo & Video Gallery
                </h3>

                <div className="group_slider">
                  {/*  slider --- start */}
                  <Slider {...getSliderSettings(blogData?.image?.length || 0)}>
                    {blogData?.image?.map((item, index) => (
                      <div className="slide-box" key={index}>
                        <div className="eventPic_box">
                          <img src={item} />
                        </div>
                      </div>
                    ))}
                  </Slider>

                  {/*  slider --- end */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      }

      {/* events Pic Section -- new end */}

      {/* events Pic Section -- new start */}
      {relatedBlogs &&
        relatedBlogs?.length > 0 &&
        relatedBlogs?.filter((item) => item.id !== blogData?.id)?.length >
          0 && (
          <section className="inner_page_sec inner_sec_row related_blog_sec ">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="slide-list event-list slide_card eventPic_slider">
                    <h3
                      style={{
                        color: textColor,
                        fontFamily: headerFonts,
                        fontSize: headerFontSizes,
                      }}
                    >
                      Related Blogs
                    </h3>
                    <div className="related_blog pad_b_0">
                      <div className="row">
                        {relatedBlogs &&
                          relatedBlogs?.length > 0 &&
                          relatedBlogs
                            ?.filter((item) => item.id !== blogData?.id)
                            ?.map((item, index) => (
                              <div
                                className="col-lg-3 col-md-6 mb_20"
                                key={index}
                              >
                                <div className="relatedBlog_block">
                                  <div className="relatedBlog_img">
                                    <img
                                      className=""
                                      src={item?.thumbnailImage}
                                      alt=""
                                    />
                                  </div>
                                  <div className="relatedBlog_cont">
                                    <div className="relatedBlog_date">
                                      <span>
                                        {new Date(
                                          item?.createdAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <h4 className="relatedBlog_title">
                                      {item?.blogTitle}
                                    </h4>
                                    <div
                            className="relatedBlog_description"
                            dangerouslySetInnerHTML={{ __html: item?.blogShortDesc}}
                          ></div>
                                  </div>
                                  <div className="relatedBlog_btn slide_btn_block slide_card_btn_block">
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
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      {/* events Pic Section -- new end */}
      <Footer />
    </>
  );
};

export default BlogDetails;
