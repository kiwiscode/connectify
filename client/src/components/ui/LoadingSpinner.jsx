const LoadingSpinner = () => {
  return (
    <div
      className="twitter-spinner"
      style={{ color: "#1DA1F2", textAlign: "center" }}
    >
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
