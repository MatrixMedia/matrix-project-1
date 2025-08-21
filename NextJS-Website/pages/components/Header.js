import Link from "next/link";
import { Nav, Navbar, Form, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GET_MY_COMMUNITY_SETTINGS } from "../api/queries";
import api from "../api/api";

const Header = ({ handleSubmit, handleSearch, searchTerm }) => {
  const router = useRouter();
  const [storeData, setStoreData] = useState("");
  const [img, setImg] = useState("");
  const [slug, setSlug] = useState("");

  // To get the route of the page
  const currentRoute = router?.pathname;

  // className added automatically in scrool action :
  const [headerClassName, setHeaderClassName] = useState("");
  const [homePageStatus, setHomePageStatus] = useState("");
  const [announcementPageStatus, setannouncementPageStatus] = useState("");
  const [VideosStatus, setVideosStatus] = useState("");
  const [PaymentStatus, setPaymentPageStatus] = useState("");
  const [AboutStatus, setAboutPageStatus] = useState("");

  // calling a function to constant the header navbar
  const handleScroll = (headerClassName) => {
    if (headerClassName !== "stickyscrollin" && window.pageYOffset >= 100) {
      setHeaderClassName("stickyscrollin");
    } else if (
      headerClassName === "stickyscrollin" &&
      window.pageYOffset < 100
    ) {
      setHeaderClassName("");
    }
  };

  // To initial render the header navbar
  useEffect(() => {
    window.onscroll = () => handleScroll(headerClassName);
  }, [headerClassName]); // IMPORTANT, This will cause react to update depending on change of this value

  // To initial render for share link
  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas);
    }
  }, [router]);

  const viewDetails = async (data) => {
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
    setHomePageStatus(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.homePage
    );
    setAboutPageStatus(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.aboutPage
    );
    setPaymentPageStatus(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.paymentPage
    );
    setVideosStatus(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.videoPage
    );
    setannouncementPageStatus(
      response?.data?.data?.getMyCommunitiesSettingsView?.data?.announcementPage
    );
    setSlug(response?.data?.data?.getMyCommunitiesSettingsView?.data?.slug);
    setImg(response?.data?.data?.getMyCommunitiesSettingsView?.data?.watermark);
  };

  // Calling an intial render to get the localstorage and set the data into the state
  useEffect(() => {
    var data = JSON?.parse(localStorage?.getItem("storeData"));
    setSlug(data?.slug);
    setImg(data?.watermark);
    setStoreData(data);
  }, []);

  return (

    // ---- Old Header --- start ----
    // <header className={headerClassName}>
    //   <div className="container">
    //     <div className="row">
    //       <div className="col-lg-2 logo">
    //         <img
    //           src={
    //             img ||
    //             "https://sangaraahi.s3.ap-south-1.amazonaws.com/image%201%20%281%29.png"
    //           }
    //           alt=""
    //         />
    //       </div>
    //       <div className="col-lg-7 top-menu">
    //         <Navbar expand="lg">
    //           <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //           <Navbar.Collapse id="basic-navbar-nav">
    //             <Nav className="me-auto">
    //               {homePageStatus && (
    //                 <Nav
    //                   className={
    //                     currentRoute === `/[cummunity_slug]/Home`
    //                       ? "active"
    //                       : ""
    //                   }
    //                 >
    //                   <Link href={`/${slug}/Home`}>Home</Link>
    //                 </Nav>
    //               )}
    //               {announcementPageStatus && (
    //                 <Nav
    //                   className={
    //                     currentRoute === `/[cummunity_slug]/Announcements`
    //                       ? "active"
    //                       : ""
    //                   }
    //                 >
    //                   <Link href={`/${slug}/Announcements`}>Announcements</Link>
    //                 </Nav>
    //               )}
    //               {VideosStatus && (
    //                 <Nav
    //                   className={
    //                     currentRoute === `/[cummunity_slug]/Videos`
    //                       ? "active"
    //                       : ""
    //                   }
    //                 >
    //                   <Link href={`/${slug}/Videos`}>Videos</Link>
    //                 </Nav>
    //               )}

    //               {homePageStatus && (
    //                <Nav
    //                className={
    //                  currentRoute.includes(`/[cummunity_slug]/Events`) ||  currentRoute.includes(`/[cummunity_slug]/EventDetails`)
    //                    ? "active"
    //                    : ""
    //                }
    //              >
    //                <Link href={`/${slug}/Events?up=1&pp=1`}>Events</Link>
    //              </Nav>
    //               )}

    //               {AboutStatus && (
    //                 <Nav
    //                   className={
    //                     currentRoute === `/[cummunity_slug]/AboutUs`
    //                       ? "active"
    //                       : ""
    //                   }
    //                 >
    //                   <Link href={`/${slug}/AboutUs`}>About Us</Link>
    //                 </Nav>
    //               )}
    //             </Nav>
    //           </Navbar.Collapse>
    //         </Navbar>
    //       </div>

    //     </div>
    //   </div>
    // </header>
    // ---- Old Header --- end ----

    // ---------  New Header --- start ----
    <header id="landing" className="headerclass header_inner">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-6 logo">
            <Link href="/">
              {" "}
              <img src="../images/logo_o.svg" alt="" />
            </Link>
          </div>
          <div className="col-md-9 col-6 top-menu">
            <Navbar expand="lg">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {homePageStatus && (
                    <Nav
                      className={
                        currentRoute === `/[cummunity_slug]/Home`
                          ? "active"
                          : ""
                      }
                    >
                      <Link href={`/${slug}/Home`}>Home</Link>
                    </Nav>
                  )}
                  {announcementPageStatus && (
                    <Nav
                      className={
                        currentRoute === `/[cummunity_slug]/Announcements`
                          ? "active"
                          : ""
                      }
                    >
                      <Link href={`/${slug}/Announcements`}>Announcements</Link>
                    </Nav>
                  )}
                  {VideosStatus && (
                    <Nav
                      className={
                        currentRoute === `/[cummunity_slug]/Videos`
                          ? "active"
                          : ""
                      }
                    >
                      <Link href={`/${slug}/Videos`}>Videos</Link>
                    </Nav>
                  )}

                  {homePageStatus && (
                   <Nav
                   className={
                     currentRoute.includes(`/[cummunity_slug]/Events`) ||  currentRoute.includes(`/[cummunity_slug]/EventDetails`)
                       ? "active"
                       : ""
                   }
                 >
                   <Link href={`/${slug}/Events?up=1&pp=1`}>Events</Link>
                 </Nav>
                  )}

                  {AboutStatus && (
                    <Nav
                      className={
                        currentRoute === `/[cummunity_slug]/AboutUs`
                          ? "active"
                          : ""
                      }
                    >
                      <Link href={`/${slug}/AboutUs`}>About Us</Link>
                    </Nav>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </div>
        </div>
      </div>
    </header>
    // ---------  New Header --- end ----


  );
};
export default Header;
