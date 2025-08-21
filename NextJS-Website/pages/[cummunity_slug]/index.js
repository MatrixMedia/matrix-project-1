import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { GET_MY_COMMUNITY_SETTINGS } from "../api/queries";
import { Spinner } from "react-bootstrap";

function NotFound() {
  const router = useRouter();
  const [storeData, setStoreData] = useState("");
  const [showData, setShowData] = useState("");

  useEffect(() => {
    var data = JSON.parse(localStorage?.getItem("storeData"));
    setStoreData(data);
    // window.location.reload();
  }, []);

  const viewDetails = async (id) => {
    if (id !== "NotFoundScreen") {
      const response = await api.post("", {
        query: GET_MY_COMMUNITY_SETTINGS,
        variables: {
          data: {
            slug: id,
          },
        },
      });
      setShowData(response?.data?.data?.getMyCommunitiesSettingsView?.code);
      if (response?.data?.data?.getMyCommunitiesSettingsView?.code === 200) {
        router.push(
          `${response?.data?.data?.getMyCommunitiesSettingsView?.data?.slug}/Home`
        );
      } else {
        router.push("/");
      }
    }
  };
  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas);
    }
  }, [router]);

  return (
    <>
      {showData === 200 ? (
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
            Redirecting to Home
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
      ) : (
        <div
          className="notFoundWrapper text-center"
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <h1
              style={{ fontSize: "60px", marginBottom: "60px", opacity: ".5" }}
            >
              {storeData?.communityName} doesn't seem to have webpage
            </h1>
            <p className="headerTitle mt-2">
              We cannot find the page for {storeData?.communityName} that you're
              looking for
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default NotFound;
