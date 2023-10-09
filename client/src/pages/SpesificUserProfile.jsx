import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?

function SpesificUserProfile() {
  const { id } = useParams();
  const { userInfo, getToken } = useContext(UserContext);
  const handleShowSpesificUserProfile = (userId) => {
    axios
      .get(`${API_URL}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleShowSpesificUserProfile();
  }, []);
  console.log("Id getting from parameters meaning URL ! ", id);
  return (
    <>
      <div></div>
    </>
  );
}

export default SpesificUserProfile;
