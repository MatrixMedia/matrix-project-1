import Link from "next/link";
import { useState } from "react";
import Posts from "../components/Posts";
import LandingPosts from "./Posts";
import Router from "next/router";

const LandingFooter = ({ parentCallback }) => {
  // const [privacy, setPrivacy] = useState(false);
  // const [terms, setTerms] = useState(false);

  const handleClick = (e, path) => {
    if (path === "/PrivacyPolicy") {
      Router.push("/PrivacyPolicy");
    }
    if (path === "/TermsConditions") {
      Router.push("/TermsConditions");
      
    }
    if (path === "/safety-policy") {
      Router.push("/safety-policy");
      
    }
  };

  const year = new Date().getFullYear();

  return (


  <footer className="landing">
    {/* //  === footer - new - start === */}
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
  </footer>


// {/* //  === footer - Old - start === */}


    // <footer className="landing">
    //   <div className="container">
    //     <div className="row">
    //       <div className="col-lg-8">
    //         <div className="landing-footer-txt">
    //           <p>
    //             If you want to be registered as Board member or Executive
    //             member, Please login to Sangaraahi.net portal.
    //           </p>

    //           <ul className="footer-link">
    //             <li>
    //               <Link
    //                 className="text-deco"
    //                 href="/PrivacyPolicy"
    //                 onClick={(e) => handleClick(e, "/PrivacyPolicy") }
    //               >
    //                 Privacy Policy
    //               </Link>
    //             </li>
    //             <li>
    //               <Link
    //                 className="text-deco"
    //                 href="/TermsConditions"
    //                 onClick={(e) => handleClick(e, "/TermsConditions")}
    //               >
    //                 Terms And Condition
    //               </Link>
    //             </li>
    //             <li>
    //               <Link
    //                 className="text-deco"
    //                 href="/SafetyPolicy"
    //                 onClick={(e) => handleClick(e, "/SafetyPolicy ")}
    //               >
    //                Safety Policy 
    //               </Link>
    //             </li>
    //           </ul>
    //         </div>
    //       </div>
    //       <div className="col-lg-4">
    //         <div className="app-link">
    //           <Link
    //             href="https://play.google.com/store/apps/details?id=com.communitynetworkingapp"
    //             rel="noopener noreferrer"
    //             target="_blank"
    //           >
    //             <img src="./images/google-play.png" alt="" />
    //           </Link>
    //           <Link
    //             href="https://apps.apple.com/in/app/sangaraahi/id1661511878"
    //             rel="noopener noreferrer"
    //             target="_blank"
    //           >
    //             <img src="./images/app-store.png" alt="" />
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="row">
    //       <div className="col-lg-8">
    //         <div className="landing-copy">
    //           Copyright © {year}. All rights are reserved by SangaRaahi LLC, US.
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </footer>


// {/* //  === footer - Old - end === */}


  );
};
export default LandingFooter;
