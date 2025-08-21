import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Form, Button, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { css } from "glamor";
import {
  GET_COMMUNITY_HOME,
  GET_MY_COMMUNITY_SETTINGS,
  GetCommunityPayments,
} from "../api/queries";
import api from "../api/api";
import { useRouter } from "next/router";
import TableLoader from "../../util/TableLoader";
import Modal from "../../util/ModalComponent";

export default function PaymentDetails(props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [storeData, setStoreData] = useState(null || "");
  const [des, setDes] = useState(null || "");
  const [qr, setQr] = useState(null || "");
  const [link, setLink] = useState(null || "");
  const [authName, setAuthName] = useState(null || "");
  const [Otherpayment, setOtherPayment] = useState(null || "");
  const [textColor, setTextColor] = useState(null || "");
  const [isTruncate, setIsTruncate] = useState(true);
  const [loading, setLoading] = useState(true);

  const [bodyFonts, setbodyFonts] = useState(null || "");
  const [bodyFontSizes, setbodyFontSizes] = useState(null || "");

  const [headerFonts, setheaderFonts] = useState(null || "");
  const [headerFontSizes, setheaderFontSizes] = useState(null || "");

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null || "");

  const [background, setBackGround] = useState("");

  const MAX_WORD_LENGTH = 220;

  const router = useRouter();

  


  // calling a function to open a model
  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  // calling a function to close a model
  const closeModal = () => {
    setModalOpen(false);
  };

  // calling a function to intial render for shareable link
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
  };

  // intial render for sharable link
  useEffect(() => {
    const datas = router.query.cummunity_slug;
    if (datas) {
      viewDetails(datas, (commId) => {
        GetCommunityPaymentsDetails(commId);
      });
    }
  }, [router]);

  // intial render to store data in state from local storage
  useEffect(() => {
    var data = JSON.parse(localStorage?.getItem("storeData"));
    setTextColor(data?.textColor || "");
    setbodyFonts(storeData?.bodyFont || "");
    setbodyFontSizes(storeData?.bodyFontSize || "");
    setheaderFonts(storeData?.headerFont || "");
    setheaderFontSizes(storeData?.headerFontSize || "");
    setStoreData(data || "");
  }, []);

  // creating all function and passing an community id as a parameter
  useEffect(() => {
    document.body.style.backgroundColor = storeData?.backgroupColor;
    GetCommunityPaymentsDetails(
      storeData?.communityId && storeData?.communityId
    );
    getCommunityHomeDetails(storeData?.communityId && storeData?.communityId);
  }, [storeData]);

  // Api if firing with the dependicies of community Id :
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

      // document.body.style.backgroundColor = response?.data?.data?.getCommunityHomePageOverviewByID?.data?.backgroupColor;
      setBackGround(
        response?.data?.data?.getCommunityHomePageOverviewByID?.data
          ?.backgroupColor
      );
    }
    setLoading(false);
  };
  // calling an api for payment details
  const GetCommunityPaymentsDetails = async (id) => {
    if (id) {
      const response = await api.post("", {
        query: GetCommunityPayments,
        variables: {
          data: {
            id: id,
            isOrgPortal: true,
          },
        },
      });
      if (response?.status === 200) {
        // setDes(
        //   response?.data?.data?.getCommunityPayments?.data
        //     ?.paymentDescription || ""
        // );
        setLink(response?.data?.data?.getCommunityPayments?.data?.link || "");
        setAuthName(
          response?.data?.data?.getCommunityPayments?.data?.authorityName || ""
        );
        setOtherPayment(
          response?.data?.data?.getCommunityPayments?.data?.otherpaymentLink ||
            ""
        );
        setDes(
          response?.data?.data?.getCommunityPayments?.data
            ?.paymentDescription || ""
        );
        setQr(
          response?.data?.data?.getCommunityPayments?.data?.qrcodeImage || ""
        );
      }
    }
    setLoading(false);
  };

  // Truncate the descriptions length :
  const truncate = isTruncate
    ? des.split("").slice(0, MAX_WORD_LENGTH).join("")
    : des;

  // Toast Notification Message for Successfully sent a Mail
  const notifySuccess = () =>
    toast.success("Message Sent Suceessfully !", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: css({
        background: "green",
      }),
    });

  // Toast Notification Message for UnSuccessfull
  const notifyError = () => {
    toast.error("Message Not Sent !", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: css({
        background: "red",
      }),
    });
  };
  return (
    <>
      <Header />

      {/* Payment info start */}

      {loading ? (
        <TableLoader />
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="payment-info">
                <div className="left">
                  <h4 className="qrcode">
                    Scan the QR for your charity & donation
                  </h4>
                  {qr ? (
                    <div className="barcode">
                      <img src={qr} alt="" />
                    </div>
                  ) : (
                    <div>
                      <img
                        src={
                          "https://sangaraahi.s3.ap-south-1.amazonaws.com/qr-code_1_clipdrop-background-removal-removebg-preview.png"
                        }
                        alt=""
                      />
                      <br />
                      <h5 className="qrcodes">No QR Code Found</h5>
                    </div>
                  )}
                </div>
                <div className="right">
                  <h4 className="qrcode">
                    Send your charity & donation amount to the Authority
                  </h4>
                  {authName ? (
                    <div
                      className="doner-name"
                      style={{
                        color: textColor,
                        fontFamily: bodyFonts,
                        fontSize: bodyFontSizes,
                      }}
                    >
                      {authName}
                    </div>
                  ) : (
                    <div>
                      <img
                        src={
                          "https://sangaraahi.s3.ap-south-1.amazonaws.com/caution%201.png"
                        }
                        alt=""
                      />
                      <h5 className="qrcode">No Payment Method Found</h5>
                    </div>
                  )}

                  {link?.length > 0 && (
                    <div className="doner-phone">
                      <Link
                        href={link}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="icon-link">
                          <img
                            src="https://sangaraahi.s3.ap-south-1.amazonaws.com/link.png"
                            alt=""
                          />
                        </span>
                        {Otherpayment}
                      </Link>
                    </div>
                  )}

                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        content={modalContent}
      />
      {/* Payment info end */}
    </>
  );
}
