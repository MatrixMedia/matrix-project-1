import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav, Navbar } from "react-bootstrap";

const LandingHeader = () => {
  const [headerClassName, setHeaderClassName] = useState("");

  // calling a function for navbar constant
  const handleScroll = (headerClassName) => {
    if (headerClassName !== "stickyscroll" && window.pageYOffset >= 100) {
      setHeaderClassName("stickyscroll");
    } else if (headerClassName === "stickyscroll" && window.pageYOffset < 100) {
      setHeaderClassName("");
    }
  };

  // intial calling for navbar constant
  useEffect(() => {
    window.onscroll = () => handleScroll(headerClassName);
  }, [headerClassName]); // IMPORTANT, This will cause react to update depending on change of this value
  return (
    // <header id="landing" className={headerClassName}>
    //   <div className="container">
    //     <div className="row">
    //       <div className="col-lg-4 logo">
    //         <Link href="/">
    //           {" "}
    //           <img src="./images/landing-logo.svg" alt="" />
    //         </Link>
    //       </div>
    //       <div className="col-lg-8 top-menu">
    //         <Navbar expand="lg">
    //           <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //           <Navbar.Collapse id="basic-navbar-nav">
    //             <Nav className="me-auto">
    //               <Nav>
    //                 <Link href="/">Home</Link>
    //               </Nav>
    //               <Nav>
    //                 <Link href="/#screens">Screens</Link>
    //               </Nav>
    //               <Nav>
    //                 <Link href="/#videos">Training Videos</Link>
    //               </Nav>
    //               <Nav>
    //                 <Link href="/#aboutus">About Us</Link>
    //               </Nav>
    //             </Nav>
    //           </Navbar.Collapse>
    //         </Navbar>
    //       </div>
    //     </div>
    //   </div>
    // </header>

    <header id="landing" className="headerclass">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-6 logo">
            <Link href="/">
              {" "}
              <img src="./images/logo_o.svg" alt="" />
            </Link>
          </div>
          <div className="col-md-9 col-6 top-menu">
            <Navbar expand="lg">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav>
                    <Link href="/">Home</Link>
                  </Nav>
                  <Nav>
                    <Link href="/">Introductory Videos</Link>
                  </Nav>
                  <Nav>
                    <Link href="/">Features Communities</Link>
                  </Nav>
                  <Nav>
                    <Link href="/">Download App</Link>
                  </Nav>
                  
                  {/* <Nav>
                    <Link href="/#screens">Screens</Link>
                  </Nav>
                  <Nav>
                    <Link href="/#videos">Training Videos</Link>
                  </Nav> */}
                  <Nav>
                    <Link href="/#aboutus">About Us</Link>
                  </Nav>
                  <Nav className="contactus">
                    <Link href="/#contactus">Contact us</Link>
                  </Nav>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </div>
        </div>
      </div>
    </header>
  );
};
export default LandingHeader;
