import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function UserProfile() {
  const [userprofiledata, setUserprofiledata] = useState("");
  const { getToken } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  const handleShowPosts = () => {
    axios
      .get(`${API_URL}/home`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/userProfile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log(response);
        setUserprofiledata(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    handleShowPosts();
  }, []);
  console.log(posts);
  console.log(userprofiledata);
  return (
    <>
      <div>My Profile</div>
    </>
  );
}

export default UserProfile;
