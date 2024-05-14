import axios from "axios";

// when working on local version
const API_URL = "http://localhost:3000";

// when working on deployment version
// ?
export const handleRefreshPostsHomePage = async (
  getToken,
  setFollowingPosts,
  setPosts
) => {
  try {
    const homeResponse = await axios.get(`${API_URL}/home`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const followingResponse = await axios.get(`${API_URL}/followingPosts`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    setFollowingPosts(followingResponse.data);
    setPosts(homeResponse.data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const handleShowPostsProfilePageHere = () => {
  // Profil sayfasında gönderileri göstermek için gerekli işlemler burada yapılır
  console.log("Showing posts on the profile page...");
};

export const handleShowPostsHomePage1895 = () => {
  // Özel bir durumda ana sayfada gönderileri göstermek için gerekli işlemler burada yapılır
  console.log("Showing posts on the home page with ID 1895...");
};
