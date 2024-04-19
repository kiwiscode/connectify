{
  /* post boxun tamamı start to check  */
}
{
  /* owner img,fullname,username,created date,three dots start to check */
}
<Stack
  style={{
    cursor: "pointer",
  }}
  to={`/${post.userId?.username}/status/${
    !post.isReposted ? post._id : post.repostedFromThisOriginalPost[0]._id
  }`}
  onClick={() => setclickedPostBox(post)}
  className="outside-of-inner-circle-post-info-user-info-svg-three-dots"
  direction="horizontal"
  gap={1}
>
  {" "}
  {/* profile image start to check DONE*/}
  <div className="p-1 ">
    {post.userId.imageUrl.slice(0, 3) !== "../" ? (
      <Link
        className="post-circle-profile-image-on-point"
        style={{ cursor: "pointer" }}
        to={`/profile/${post ? post.userId._id : null}`}
      >
        <img
          width={40}
          height={40}
          src={post?.userId?.imageUrl ? post?.userId?.imageUrl : null}
          alt="??"
          style={{ borderRadius: "50%" }}
        />
      </Link>
    ) : (
      <Link
        className="post-circle-profile-svg-on-point"
        to={`/profile/${post.userId ? post.userId._id : null}`}
        style={{ cursor: "pointer" }}
      >
        {" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={40}
          height={40}
          fill="rgb(83, 100, 113)"
          className="bi bi-person-circle"
          viewBox="0 0 16 16"
          style={{
            borderRadius: "50%",
          }}
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
        </svg>
      </Link>
    )}
  </div>
  {/* profile image finish to check  DONE*/}
  {/* post owner full name + verified account svg + post owner user name + post created date start to check */}
  <div className="p-1">
    {post.userId ? (
      <>
        <Link
          className="post-circle-postowner-fullname"
          to={`/profile/${post.userId._id}`}
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <span
            className="hover-fullname"
            style={{
              color: themeName === "dark-theme" ? "white" : "",
              fontWeight: "700",
              fontSize: "15px",
              lineHeight: "20px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "120px",
            }}
          >
            {post.authorFullName}
          </span>
        </Link>{" "}
        <span>
          {/* start to check  */}{" "}
          <span className="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3 r-1awozwy r-xoduu5">
            <svg
              width={`${1.25}em`}
              height={`${1.25}em`}
              viewBox="0 0 22 22"
              aria-label="Verified account"
              role="img"
              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-f9ja8p r-og9te1 r-9cviqr"
              data-testid="icon-verified"
              color="rgba(29,155,240,1.00)"
              fill="currentColor"
            >
              <g>
                <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
              </g>
            </svg>
          </span>{" "}
        </span>{" "}
        <Link
          to={`/profile/${post.userId._id}`}
          style={{
            textDecoration: "none",
            color: "rgb(83, 100, 113)",
            lineHeight: "20px",
            fontSize: "15px",
            fontWeight: "400",
          }}
        >
          <span className="post-circle-postowner-username">
            <span>@{post.authorUserName}</span>
          </span>
        </Link>
        <Link
          style={{
            textDecoration: "none",
          }}
          to={`/${post.userId.username}/status/${
            !post.isReposted
              ? post._id
              : post.repostedFromThisOriginalPost[0]._id
          }`}
        >
          <span
            className="post-circle-date-post-detail"
            style={{
              color: "rgb(83, 100, 113)",
              lineHeight: "20px",
              fontSize: "15px",
              fontWeight: "400",
            }}
          >
            {" "}
            ·{" "}
            <span className="date-post-detail">
              {getCreatedDate(post.createdAt)}
            </span>
          </span>
        </Link>
        {/* finish to check  */}
      </>
    ) : null}
  </div>
  {/* post owner full name + verified account svg + post owner user name + post created date  finish to check  */}
  {/* three dots svg start to check */}
  <div className="p-1 ms-auto">
    <span className="svg-three-dots-post-detail">
      {/* show if post owner userId !equal currentUserId */}
      {post.userId && post.userId._id !== userInfo._id ? (
        <svg
          style={{
            cursor: "pointer",
            backgroundColor: "rgb(29, 155, 240)",
          }}
          onClick={() => handleShowDetailPostFromHomePage(post._id)}
          color="rgb(83, 100, 113)"
          fill="currentColor"
          width={`${1.25}em`}
          height={`${1.25}em`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="bi-three-dots positioning-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
        >
          <g>
            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
          </g>
        </svg>
      ) : (
        <svg
          style={{
            cursor: "pointer",
            backgroundColor: "crimson",
          }}
          onClick={() => handleDeletePostFromHomePage(post._id)}
          color="rgb(83, 100, 113)"
          fill="currentColor"
          width={`${1.25}em`}
          height={`${1.25}em`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="bi-three-dots positioning-dots r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
        >
          <g>
            <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
          </g>
        </svg>
      )}
    </span>
  </div>
  {/* three dots svg finish to check */}
</Stack>;
{
  /* owner img,fullname,username,created date,three dots finish to check */
}
{
  /* post content start to check  */
}
<Stack
  to={`/${post.userId.username}/status/${
    !post.isReposted ? post._id : post.repostedFromThisOriginalPost[0]._id
  }`}
  onClick={() => setclickedPostBox(post)}
  className="outside-of-inner-circle-action-comment-text"
  direction="vertical"
  gap={1}
>
  {" "}
  {post.isComment ? (
    <div
      to={`/${post.userId.username}/status/${
        !post.isReposted ? post._id : post.repostedFromThisOriginalPost[0]._id
      }`}
      onClick={() => setclickedPostBox(post)}
      className="p-2 parent-comment-text"
    >
      <span
        style={{
          color: "rgb(83, 100, 113)",
          fontSize: "15px",
          lineHeight: "20px",
          fontWeight: "400",
        }}
      >
        Replying to {""}
      </span>
      <Link
        to={`/profile/${post.commentedForThisUsersPost._id}`}
        style={{
          textDecoration: "none",
        }}
      >
        <span
          className="replying-to-text"
          style={{
            color: "rgb(29, 155, 240)",
            cursor: "pointer",
            fontSize: "15px",
            lineHeight: "20px",
            fontWeight: "400",
          }}
        >
          @{post.commentedForThisUsersPost.username}
        </span>
      </Link>
    </div>
  ) : null}
  <Link
    to={`/${post.userId.username}/status/${
      !post.isReposted ? post._id : post.repostedFromThisOriginalPost[0]._id
    }`}
    style={{
      textDecoration: "none",
      color: "rgb(15, 20, 25)",
    }}
  >
    <div
      style={{
        fontSize: "15px",
        fontWeight: "400",
        lineHeight: "20px",
        overflowWrap: "break-word",
        maxWidth: "100%",
        cursor: "pointer",
        color: themeName === "dark-theme" ? "white" : "",
      }}
      className="p-2"
    >
      {post.content}
    </div>
  </Link>
</Stack>;
{
  /* post content finish to check  */
}
{
  /* start to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */
}
{
  post.image.url !== "image@url" ? (
    <>
      <Link
        to={`/${post.userId.username}/status/${
          !post.isReposted ? post._id : post.repostedFromThisOriginalPost[0]._id
        }/photo/${1}`}
        style={{
          textDecoration: "none",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            border: "2px solid #ddd", // Kenarlık rengi ve kalınlığı
            borderRadius: "8px", // Kenarlık köşelerinin yuvarlatılması
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Gölge efekti
          }}
        >
          <img
            src={post.image.url}
            alt="Description"
            style={{
              width: "100%",
              display: "block",
            }}
          />
        </div>
      </Link>
    </>
  ) : null;
}
{
  /* finish to check NOTE if there is no internet connection images would be hidden because of 'cloudinary connection' */
}
{
  /* new version favorite repost comment start to check */
}
<Stack
  className="mt-0 parent-footer-stack"
  onClick={() => setclickedPostBox(post)}
  direction="horizontal"
  style={{
    justifyContent: "space-between",
    margin: "5px 0px 5px 0px",
    cursor: "pointer",
  }}
>
  <div onClick={() => setclickedPostBox(post)} className="p-1 next-to-comment">
    <CommentModal
      post={post ? post : null}
      width={`${1.25}em`}
      height={`${1.25}em`}
      refreshPosts={handleShowPostsHomePage}
      setLoadingFalse={setLoadingFalse}
      setLoadingTrue={setLoadingTrue}
      postSharedMessage={postSharedMessage}
    />
  </div>
  <div onClick={() => setclickedPostBox(post)} className="p-1 next-to-repost">
    {post.reposted.length > 0 && getRepostedIds(post).includes(userInfo._id) ? (
      <div>
        <svg
          onClick={() => handleDeleteRepostMainPage(post._id)}
          width={`${1.25}em`}
          height={`${1.25}em`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
          fill="rgb(0, 186, 124)"
        >
          <g>
            <path
              stroke="rgb(83, 100, 113)"
              strokeWidth="0.1"
              d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
            ></path>
          </g>
        </svg>

        <span
          style={{
            color: "rgb(0, 186, 124)",
          }}
          className="post-description"
        >
          {/* some test */}
          {post.reposted.length ? <span>{post.reposted.length}</span> : null}
        </span>
      </div>
    ) : (
      <div>
        {" "}
        <svg
          style={{
            cursor: "pointer",
          }}
          onClick={() => handleRepost(post._id, post)}
          width={`${1.25}em`}
          height={`${1.25}em`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="svg-repost r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
          fill={
            !shouldHide && post.reposted.includes(userInfo._id)
              ? "rgb(0, 186, 124)"
              : "rgb(83, 100, 113)"
          }
        >
          <g>
            <path
              stroke="rgb(83, 100, 113)"
              strokeWidth="0.1"
              d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"
            ></path>
          </g>
        </svg>
        <span
          className="post-description"
          style={{
            color:
              !shouldHide && post.reposted.includes(userInfo._id)
                ? "rgb(0, 186, 124)"
                : "rgb(83, 100, 113)",
          }}
        >
          {post.reposted.length ? <span>{post.reposted.length}</span> : null}
        </span>
      </div>
    )}
  </div>
  <div
    to={`/${post.userId.username}/status/${
      !post.isReposted ? post._id : post.repostedFromThisOriginalPost[0]._id
    }`}
    onClick={() => setclickedPostBox(post)}
    className="p-1 next-to-like"
  >
    {getLikerIds(post).includes(userInfo._id) ? (
      <div>
        <svg
          onClick={() => handleDeleteLikeFromHomePage(post._id)}
          width={`${1.25}em`}
          height={`${1.25}em`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="rgb(249, 24, 128)"
          className="svg-heart r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
        >
          <g>
            <path
              stroke="black"
              strokeWidth="0.2"
              d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"
            ></path>
          </g>
        </svg>
        <span className="post-description">
          {post.likes.length ? (
            <span
              style={{
                color: "rgb(249, 24, 128)",
              }}
            >
              {post.likes.length}
            </span>
          ) : null}
        </span>
      </div>
    ) : (
      <div>
        {" "}
        <svg
          // real time notification start to check test
          onClick={() => handlePostLikesFromHomePage(post._id, post)}
          // real time notification finish to check test

          width={`${1.25}em`}
          height={`${1.25}em`}
          viewBox="0 0 24 24"
          aria-hidden="true"
          color="rgb(83, 100, 113)"
          fill="currentColor"
          className="svg-heart r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1xvli5t r-1hdv0qi"
        >
          <g>
            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
          </g>
        </svg>
        <span className="post-description">
          {post.likes.length ? <span>{post.likes.length}</span> : null}
        </span>
      </div>
    )}
  </div>
</Stack>;
{
  /* new version favorite repost comment finish to check */
}
{
  /* post boxun tamamı finish to check  */
}
