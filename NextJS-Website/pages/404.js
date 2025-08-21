import React, { useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.css";
import Spinner from "react-bootstrap/Spinner";

const Custom404 = () => {
  const router = useRouter();

  useEffect(() => {
    if (router?.pathname === "/404") {
      router.push("/");
    }
  }, [router]);

  return (
    <>
      <div
        className="notFoundWrapper text-center"
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h5 style={{ fontSize: "60px", marginBottom: "60px", opacity: ".5" }}>
         Page Not Found 
        </h5>
        &nbsp; &nbsp;
        <Spinner
          style={{ marginBottom: "58px" }}
          animation="grow"
          variant="warning"
        />
        <Spinner
          style={{ marginBottom: "58px" }}
          animation="grow"
          variant="warning"
        />
        <Spinner
          style={{ marginBottom: "58px" }}
          animation="grow"
          variant="warning"
        />
      </div>
    </>
  );
};

export default Custom404;
