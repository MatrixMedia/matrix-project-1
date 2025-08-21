import Link from "next/link";
import Slider from "react-slick";
import React, { useEffect, useState, useRef  } from "react";
import { Form, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import api from "../api/api";
import {
  GET_COMMUNITY,
  GET_MY_COMMUNITY_SETTINGS,
  GetSangaraahiCommunity,
} from "../api/queries";
import { useRouter } from "next/router";
import { format } from "date-fns";
import BoxLoader from "../../util/BoxLoader";
import { useDebounce } from '@uidotdev/usehooks';


const LandingPosts = () => {
  const router = useRouter();

  // Component States
  const [community, setCommunity] = useState(null);
  const [specCommunity, setSpecCommunity] = useState("");
  const [loading, setLoading] = useState(true);
  const [featureCommunity, setFeatureCommunity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchText = useDebounce(searchTerm, 1000);

  useEffect(() => {
    searchData();
  }, [debouncedSearchText]);


  // Fetch Function for List of Videos
  const { data, isLoading, error } = useQuery("community", async () => {
    const response = await api.post("", {
      query: GET_COMMUNITY,
      variables: {
        data: {
          page: 1,
          limit: 10,
        },
      },
    });
    console.log("response qqqqqqqqqqqq",  response?.data?.data?.getFeaturedCommunities?.data?.featuredCommunities);
    
    setCommunity(
      response?.data?.data?.getFeaturedCommunities?.data?.featuredCommunities
    );
    setLoading(false);
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responsed = await api.post("", {
          query: GetSangaraahiCommunity,
        });

        setFeatureCommunity(
          responsed?.data?.data?.getSangaraahiCommunity?.data
            ?.featuredCommunities
        );
      } catch (error) {
        // Handle error
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const viewDetails = async (id) => {
    setLoading(true);
    const response = await api.post("", {
      query: GET_MY_COMMUNITY_SETTINGS,
      variables: {
        data: {
          communityId: id,
        },
      },
    });
    setSpecCommunity(response?.data?.data?.getMyCommunitiesSettingsView?.data);
    localStorage.setItem("storeData", JSON.stringify(specCommunity));
    router.push({
      pathname: `/${response?.data?.data?.getMyCommunitiesSettingsView?.data?.slug}/Home`,
    });
    setLoading(false);
  };

  useEffect(() => {
    localStorage.setItem("storeData", JSON.stringify(specCommunity));
  }, [specCommunity]);

  // slider config for FeaturedCommunitieslist
  var FeaturedCommunitieslist = {
    arrows: false,
    dots: true,
    speed: 500,
    infinite: false,
    slidesToShow: 3,
    slidesToShow: community?.length > 3 ? 3 : community?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow: community?.length > 3 ? 3 : community?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToShow: community?.length > 2 ? 2 : community?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow: community?.length > 1 ? 1 : community?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  var FeaturedCommunities = {
    arrows: false,
    dots: true,
    speed: 500,
    infinite: false,
    slidesToShow: 3,
    slidesToShow: featureCommunity?.length > 3 ? 3 : featureCommunity?.length,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToShow:
            featureCommunity?.length > 3 ? 3 : featureCommunity?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToShow:
            featureCommunity?.length > 2 ? 2 : featureCommunity?.length,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToShow:
            featureCommunity?.length > 1 ? 1 : featureCommunity?.length,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // slider config for trainingvideos
  // var trainingvideos = {
  //   autoplay: true,
  //   arrows: false,
  //   dots: true,
  //   speed: 500,
  //   infinite: true,
  //   initialSlide: 0,
  //   slidesToScroll: 1,
  //   slidesToShow:4,
    
    
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 1,
  //       },
  //     },
  //   ],
  // };

  const sliderRef = useRef(null);
  let scrollTimer = null;

  useEffect(() => {
    const sliderElement = sliderRef.current?.innerSlider?.list;

    const handleWheel = (e) => {
      e.preventDefault();

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => (scrollTimer = null), 200);

      if (scrollTimer) return;

      if (e.deltaY < 0) {
        sliderRef.current.slickNext();
      } else {
        sliderRef.current.slickPrev();
      }
    };

    if (sliderElement) {
      sliderElement.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const trainingvideos = {
    autoplay: true,
    arrows: true,
    dots: false,
    infinite: true,
    initialSlide: 0,
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
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow:1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // slider config for aboutslide
  var aboutslide = {
    autoplay: true,
    arrows: false,
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // slider config for New -- Explore our portfolios ## New changes 2025
  var exploreOurPortfolio = {
    //autoplay: true,
    arrows: false,
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // converting date format:
  function formatDate(dateString) {
    const date = new Date(dateString);
    const formatDate = format(date, "MM-dd-yy");
    return formatDate;
  }

  // Handle search functionality :
  const handleSearch = (event) => {
    setSearchTerm(event?.target?.value);
  };

  // Fetch data from API for community search
  const searchData = async () => {
    setLoading(true);
    const response = await api.post("", {
      query: GET_COMMUNITY,
      variables: {
        data: {
          page: 1,
          limit: 10,
          search: debouncedSearchText,
        },
      },
    });
    setCommunity(
      response?.data?.data?.getFeaturedCommunities?.data?.featuredCommunities
    );
    setLoading(false);
  };

  // Render on every seach and api call :
  useEffect(() => {
    const filtered = community?.filter((slide) =>
      slide?.communityName?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );
    setCommunity(filtered);
  }, []);

  // submit search function:
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const areaRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const move = scrollTop * 0.3; // Speed control
      if (areaRef.current) {
        areaRef.current.style.setProperty('--after-transform', `translateY(${move}px)`);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing">

    {/* landing portfolio start */}
      <div id="screens"></div>
      {/* <div className="landing-portfolio explore_slider_block">
        <div className="left explore_slider_block_left">
            <Slider {...exploreOurPortfolio}>

                <div className="slide-box">
                  <div className="explore_slider_box">
                    <div className="pic">
                      <img src="./images/org-img-ai-01.jpg" alt="" />
                    </div>
                  </div>
                </div>

                <div className="slide-box">
                  <div className="explore_slider_box">
                    <div className="pic">
                      <img src="./images/org-img-ai-02.jpg" alt="" />
                    </div>
                  </div>
                </div>

            </Slider>
        </div>
        <div className="right explore_slider_block_right">
          <div className="txt">
            <h2>Explore our portfolios </h2>
            <h4>Let’s have a look on the publicity website pages mockups</h4>
            <p>You build a community to provide a space to your friends and community participants to celebrate your own cultures, 
              your communities, to bring up your children with common values, and to support each other. 
              Our communities may be social, cultural or religious- sharing a common purpose, and also having a 
              diversity of opinions and preferences.</p>
              <p>
              SangaRaahi, in many languages, means a “fellow traveler”. We join with others who are on the same path- sometimes we 
              find that in spite of different destinations, the journey matters, and those who travel together share the highs and 
              lows of life together. <br/>

              We started the SangaRaahi platform to support our own community- this is a set of websites and apps to help with the 
              day-to-day mundane tasks of managing a fledgling community- manage community events, member contacts, announcements, 
              track payments and RSVPs, and share memories. We are Madhulavi and Pranab Majumder, and we live in Chapel Hill, NC. 
              Our community is Sankalp-RTP, and we are building this platform to help our friends in this community. <br/>

              Are you a community builder? How do you manage the day-to-day tasks of managing your own community? 
              We would love to hear from you- please send us an email at <a href="mailto:commnetapp@gmail.com">commnetapp@gmail.com.</a>
              </p>

            <a target="_blank" href="https://sangaraahi.net/auth" className="btn-more">
              Explore More
            </a>
          </div>
        </div>
      </div> */}
      <div ref={areaRef} className="communitiesArea">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h1>Build Transparent Supportive <span>Communities</span></h1>
              <p>You build a community to pro vide a space to your friends and community participants to celebrate your own cultures, your communities, to bring up your children with common values, and to support each other. Our communities may be social, cultural or religious- sharing a common purpose, and also having a diversity of opinions and preferences.</p>
              <p>SangaRaahi, in many languages, means a “fellow traveler”. We join with others who are on the same path- sometimes we find that in spite of different destinations, the journey matters, and those who travel together share the highs and lows of life together.</p>
              <div className="explorebtn">
                <a target="_blank" href="https://sangaraahi.net/auth" className="btn-more">
                  Explore More
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="bannerImage"> <img src="./images/bannerImage.png" alt="" /></div>
      </div>
    {/* landing portfolio end */}

    {/* Training Videos start */}
      <div id="videos"></div>
      <div className="introductoryVideoArea">
        <div className="container">
          <div class="row">
            <div className="col-md-5">
              <h2>Introductory Videos</h2>
            </div>
            <div className="col-md-5">
              <p>We have created a short video to present out vision of SangaRaahi. As this platform evolves over time, we will add videos to highlight aspects of the platform.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="videoWrapper">
        <div className="container">
          
            <Slider {...trainingvideos}>
              <div className="slide-box">
                <iframe
                  width="100%"
                  height="363px"
                  src="https://www.youtube.com/embed/xb4gp7AmqQY?si=RZ7NkMjYVGhDeM4F" 
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="slide-box">
                <iframe
                  width="100%"
                  height="363px"
                  src="https://www.youtube.com/embed/xb4gp7AmqQY?si=RZ7NkMjYVGhDeM4F" 
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="slide-box">
                <iframe
                  width="100%"
                  height="363px"
                  src="https://www.youtube.com/embed/xb4gp7AmqQY?si=RZ7NkMjYVGhDeM4F" 
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="slide-box">
                <iframe
                  width="100%"
                  height="363px"
                  src="https://www.youtube.com/embed/xb4gp7AmqQY?si=RZ7NkMjYVGhDeM4F" 
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="slide-box">
                <iframe
                  width="100%"
                  height="363px"
                  src="https://www.youtube.com/embed/xb4gp7AmqQY?si=RZ7NkMjYVGhDeM4F" 
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </Slider>
          
        </div>
      </div>

      {/* <div className="training-videos">
        <div className="container">
          <h2>Training Videos</h2>
          <h4>We have created a short video to present out vision of SangaRaahi. 
            As this platform evolves over time, we will add videos to highlight aspects of the platform.</h4>
        </div>
        
        <Slider {...trainingvideos}>
          <div className="slide-box">
            <iframe
              width="100%"
              height="450px"
              src="https://www.youtube.com/embed/xb4gp7AmqQY?si=RZ7NkMjYVGhDeM4F" 
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className="slide-box">
            <iframe
              width="100%"
              height="450px"
              src="https://www.youtube.com/embed/xb4gp7AmqQY?si=RZ7NkMjYVGhDeM4F" 
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className="slide-box">
            <iframe
              width="100%"
              height="450px"
              src="https://www.youtube.com/embed/xb4gp7AmqQY?si=RZ7NkMjYVGhDeM4F" 
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className="slide-box">
            <iframe
              width="100%"
              height="450px"
              src="https://www.youtube.com/embed/xb4gp7AmqQY?si=RZ7NkMjYVGhDeM4F" 
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </Slider>
      </div> */}
    {/* Training Videos end */}

    {/* Featured Communities start */}
    <div className="featured-communities">
      <div className="container">

        {/* heading Communities search start */}
        <div className="row featured-top">
          <div className="col-lg-6">
            <h2>Featured Community</h2>
          </div>
          <div className="col-lg-6">
            <div className="landing-search-outer">
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search Community"
                  />
                </Form.Group>
                <Button className="searchsubmitBtn" type="submit">Search</Button>
              </Form>
            </div>
          </div>
        </div>
        {/* heading Communities search start */}

        {/* Featured Communities slide start */}
        <div className="row">
          <div className="col-lg-12">
          {/* <h2>Featured Community</h2> */}
          <br/>
            {loading ? (
              <BoxLoader />
            ) : community?.length === 0 ? (
              <div className="no_data_card">No Community Found</div>
            ) : (
              <div>
                <Slider {...FeaturedCommunitieslist}>
                  {community &&
                    community?.map((item) => {
                      return (
                        <React.Fragment key={item?.id}>
                          <div className="slide-box">
                            <div className="slide-content">
                              <div className="slide-thum" onClick={() => viewDetails(item.id)}>
                                <img src={item?.bannerImage} alt="" />
                                {/* <div className="tag-top">20</div> */}
                              </div>
                              <div className="slide-txt">
                                <div className="date">
                                  <span>Created on</span> {formatDate(item?.createdAt)}
                                </div>
                                <h3>{item?.communityName}</h3>
                                <h4>{item?.type}</h4>
                                {/* <div className="authorcont">
                                  <p>Lorem ipsum dolor testersit a consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper matti</p>
                                </div> */}
                                <div className="author-date">
                                  <span className="author">
                                    {item?.ownerName}
                                  </span>
                                </div>
                                <Button
                                  onClick={() => viewDetails(item.id)}
                                  className="btn-details"
                                >
                                  View details
                                </Button>
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
        {/* Featured Communities slide end */}

        {/*  SangaraahiCommunity start */}
        
        {/* heading Communities search start */}
        <br/>
        {/* <hr className="cont_sec_hr"></hr> */}
        <div className="row featured-top">
          <div className="col-lg-9">
            <h2>Sangaraahi Community</h2>
          </div>

{/* 
          <div className="col-lg-3">
            <div className="landing-search-outer">
               <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search Community"
                  />
                </Form.Group>
                <Button type="submit"></Button>
              </Form> 
            </div>
          </div>
 */}

        </div>
        {/* heading Communities search start */}

        <div className="row">
          <div className="col-lg-12">
            {loading ? (
              <BoxLoader />
            ) : featureCommunity?.length === 0 ? (
              <div className="no_data_card">No Featured Community Found</div>
            ) : (
              <div>
                <Slider {...FeaturedCommunities}>
                  {featureCommunity &&
                    featureCommunity?.map((item) => {
                      return (
                        <React.Fragment key={item?.id}>
                          <div className="slide-box">
                            <div className="slide-content">
                              <div
                                className="slide-thum"
                                onClick={() => viewDetails(item.id)}
                              >
                                <img src={item?.bannerImage} alt="" />
                              </div>
                              <div className="slide-txt">
                                <h3>{item?.communityName}</h3>
                                <h4>{item?.type}</h4>
                                <div className="author-date">
                                  <span className="author">
                                    {item?.ownerName}
                                  </span>
                                  <span className="date">
                                    Created on {formatDate(item?.createdAt)}
                                  </span>
                                </div>
                                <Button
                                  onClick={() => viewDetails(item.id)}
                                  className="btn-details"
                                >
                                  View details
                                </Button>
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
        
        {/*  SangaraahiCommunity end */}

        {/* connect with our community start */}
        <div className="connect-with-our-community-Area">
            <div className="communityBox">
              <div className="row">
                <div className="col-lg-6">
                  <img src="./images/communityImg.svg" alt="" />
                </div>
                <div className="col-lg-6">
                  <div className="connect-community-content"> 
                    <h2>Connect with <br></br>  Your Community</h2>
                    <div className="downloadAppcontent">
                      <div className="downloadText">Download Our App</div>
                      <div className="app-downloadBtn">
                        <img src="./images/download-google-play-btn.svg" alt="" />
                        <img src="./images/download-apple-play-btn.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        {/* connect with our community end */}

        {/* landing about start */}
        <div id="aboutus"></div>
        {/* <div className="landing-about">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <Slider {...aboutslide}>
                  <div className="slide-box">
                    <div className="about-slide-box">
                      <div className="pic">
                        <img
                          src="https://sangaraahi.s3.ap-south-1.amazonaws.com/image%201%20%281%29.png"
                          alt=""
                        />
                      </div>
                      <div className="txt">
                        <h3>Pranab Majumder</h3>
                        <h4>Founder & CEO SangaRaahi</h4>
                        <p>
                          SangaRaahi helps small local cultural, artistic and
                          community organizations by simplifying the creation
                          and management of their websites, announcements,
                          events. It can help manage member and fan messaging
                          through text messages, emails and a downloadable
                          app. The development roadmap includes creating a
                          payment portal.
                        </p>
                        <p>
                          SangaRaahi LLC is a startup founded in 2022, in
                          Chapel Hill, North Carolina.
                        </p>
                        <Link
                          href="https://www.sangaraahi.com/"
                          rel="noopener noreferrer"
                          target="_blank"
                          className="btn-more"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="slide-box">
                    <div className="about-slide-box">
                      <div className="pic">
                        <img
                          src="https://sangaraahi.s3.ap-south-1.amazonaws.com/image%201%20%281%29.png"
                          alt=""
                        />
                      </div>
                      <div className="txt">
                        <h3>Pranab Majumder</h3>
                        <h4>Founder & CEO SangaRaahi</h4>
                        <p>
                          SangaRaahi helps small local cultural, artistic and
                          community organizations by simplifying the creation
                          and management of their websites, announcements,
                          events. It can help manage member and fan messaging
                          through text messages, emails and a downloadable
                          app. The development roadmap includes creating a
                          payment portal.
                        </p>
                        <p>
                          SangaRaahi LLC is a startup founded in 2022, in
                          Chapel Hill, North Carolina.
                        </p>

                        <Link
                          href="https://www.sangaraahi.com/"
                          rel="noopener noreferrer"
                          target="_blank"
                          className="btn-more"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="slide-box">
                    <div className="about-slide-box">
                      <div className="pic">
                        <img
                          src="https://sangaraahi.s3.ap-south-1.amazonaws.com/image%201%20%281%29.png"
                          alt=""
                        />
                      </div>
                      <div className="txt">
                        <h3>Pranab Majumder</h3>
                        <h4>Founder & CEO SangaRaahi</h4>
                        <p>
                          SangaRaahi helps small local cultural, artistic and
                          community organizations by simplifying the creation
                          and management of their websites, announcements,
                          events. It can help manage member and fan messaging
                          through text messages, emails and a downloadable
                          app. The development roadmap includes creating a
                          payment portal.
                        </p>
                        <p>
                          SangaRaahi LLC is a startup founded in 2022, in
                          Chapel Hill, North Carolina.
                        </p>

                        <Link
                          href="https://www.sangaraahi.com/"
                          rel="noopener noreferrer"
                          target="_blank"
                          className="btn-more"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </div> */}

        <div className="landingaboutUsArea">
          <div className="row">
            <div className="col-lg-4">
              <img src="./images/about.svg" alt="" />
            </div>
            <div className="col-lg-5">
              <div className="aboutusContent">
                <h2>About Us</h2>
                <p>SangaRaahi helps small local cultural, artistic and community organizations by simplifying the creation and management of their websites, announcements, events. It can help manage member and fan messaging through text messages, emails and a downloadable app. The development roadmap includes creating a payment portal.</p>
                <p>SangaRaahi LLC is a startup founded in 2022, in Chapel Hill, North Carolina.</p>
              </div>
              <div className="testimonialsArea">
                <Slider {...aboutslide}>
                  <div className="slide-box">
                    <div className="pic">
                      <img
                        src="https://sangaraahi.s3.ap-south-1.amazonaws.com/image%201%20%281%29.png"
                        alt=""
                      />
                    </div>
                    <div className="txt">
                        <h3>Pranab Majumder</h3>
                        <h4>Founder & CEO SangaRaahi</h4>
                        <p>
                          SangaRaahi helps small local cultural, artistic and
                          community organizations by simplifying the creation
                          and management of their websites, announcements,
                          events. It can help manage member and fan messaging
                          through text messages, emails and a downloadable
                          app. The development roadmap includes creating a
                          payment portal.
                        </p>
                        <p>
                          SangaRaahi LLC is a startup founded in 2022, in
                          Chapel Hill, North Carolina.
                        </p>
                        <Link
                          href="https://www.sangaraahi.com/"
                          rel="noopener noreferrer"
                          target="_blank"
                          className="btn-more"
                        >
                          Learn More
                        </Link>
                    </div>
                  </div>
                  <div className="slide-box">
                    <div className="pic">
                      <img
                        src="https://sangaraahi.s3.ap-south-1.amazonaws.com/image%201%20%281%29.png"
                        alt=""
                      />
                    </div>
                    <div className="txt">
                        <h3>Pranab Majumder</h3>
                        <h4>Founder & CEO SangaRaahi</h4>
                        <p>
                          SangaRaahi helps small local cultural, artistic and
                          community organizations by simplifying the creation
                          and management of their websites, announcements,
                          events. It can help manage member and fan messaging
                          through text messages, emails and a downloadable
                          app. The development roadmap includes creating a
                          payment portal.
                        </p>
                        <p>
                          SangaRaahi LLC is a startup founded in 2022, in
                          Chapel Hill, North Carolina.
                        </p>
                        <Link
                          href="https://www.sangaraahi.com/"
                          rel="noopener noreferrer"
                          target="_blank"
                          className="btn-more"
                        >
                          Learn More
                        </Link>
                    </div>
                  </div>
                  <div className="slide-box">
                    <div className="pic">
                      <img
                        src="https://sangaraahi.s3.ap-south-1.amazonaws.com/image%201%20%281%29.png"
                        alt=""
                      />
                    </div>
                    <div className="txt">
                        <h3>Pranab Majumder</h3>
                        <h4>Founder & CEO SangaRaahi</h4>
                        <p>
                          SangaRaahi helps small local cultural, artistic and
                          community organizations by simplifying the creation
                          and management of their websites, announcements,
                          events. It can help manage member and fan messaging
                          through text messages, emails and a downloadable
                          app. The development roadmap includes creating a
                          payment portal.
                        </p>
                        <p>
                          SangaRaahi LLC is a startup founded in 2022, in
                          Chapel Hill, North Carolina.
                        </p>
                        <Link
                          href="https://www.sangaraahi.com/"
                          rel="noopener noreferrer"
                          target="_blank"
                          className="btn-more"
                        >
                          Learn More
                        </Link>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </div>    

        {/* landing about end */}

        <br />
        
      </div>
    </div>
    {/* Featured Communities end */}

      

      

    </div>
  );
};

export default LandingPosts;
