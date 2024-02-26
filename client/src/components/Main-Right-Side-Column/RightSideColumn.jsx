import { Col } from "react-bootstrap";

function RightSideColumn() {
  return (
    <>
      <Col
        className="side-bar-column d-none d-lg-block d-xxl-block"
        xs={12} // 0px - 576px aralığı
        sm={12} // 576px - 768px aralığı
        md={6} // 768px - 992px aralığı
        lg={4} // 992px - 1400px aralığı
        xxl={4} // 1400px ve sonrası aralığı
        style={{
          position: "fixed",
          right: "0px",
          top: "0px",
          bottom: "0px",
          height: "100%",
          backgroundColor: "royalblue",
        }}
      >
        <div>Side bar column fixed position</div>
      </Col>
    </>
  );
}

export default RightSideColumn;
