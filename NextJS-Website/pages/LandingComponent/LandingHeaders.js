import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav, Navbar } from "react-bootstrap";

const LandingHeaderComponent = () => {
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
    <header id="landing" className={headerClassName}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 logo">
          <Link href="/"> <img src="./images/landing-logo.svg" alt="" /></Link>
          </div>
        </div>
      </div>
    </header>
  );
};
export default LandingHeaderComponent;
