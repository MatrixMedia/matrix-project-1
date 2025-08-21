import axios from "axios";
import { GET_USER } from "./communityConstants";

export default getCommunity = (id) =>
  axios({
    url: "https://graphqlzero.almansi.me/api",
    method: "post",
    data: {
      query: GET_USER(id)
    }
  }).then((result) => {
  });
