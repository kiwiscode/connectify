const CustomNotification = ({ senderName, type, contactHasBeenMade }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        background: "#1da1f2",
        color: "#fff",
        borderRadius: "8px",
      }}
    >
      <img
        src={`https://www.example.com/${username}.jpg`}
        alt={username}
        style={{
          borderRadius: "50%",
          marginRight: "10px",
          width: "40px",
          height: "40px",
        }}
      />
      <div>
        <strong>{username}</strong>
        <p>{message}</p>
        <small>{time}</small>
      </div>
    </div>
  );
};

export default CustomNotification;
