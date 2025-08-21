import { useRouter } from "next/router";
import About from "../AboutUs/[id]";
import Footer from "../components/Footer";
import Posts from "../components/Posts";
import { GET_MY_COMMUNITY_SETTINGS } from "../api/queries";
import { useEffect } from "react";
import api from "../api/api";
import Event from "../Events/[id]";


export default function Events(props) {
  const router = useRouter();

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
      <Event />
      <Footer/>
    </>
  );
}
