// Import component Bootstrap React (opsional)
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../components/header";
import pantai from "./img/pan.png";

function Home() {
  return (
    <div>
      <Header />
      <Container fluid>
        <Row className="flex-column-reverse flex-xl-row" style={{ minHeight: "689px", fontFamily: "Verdana", position: "static", display: "flex", flexDirection: "row" }}>
          <Col style={{ backgroundColor: "#FFFDE3", display: "flex", alignItems: "center" }}>
            <div style={{ margin: "10% 10% 10% 10%", display: "flex", flexDirection: "column", alignContent: "center" }}>
              <h1 style={{ fontFamily: "Verdana" }}>Hello, I'm Violet Evergarden</h1>
              <h6>role</h6>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
            </div>
          </Col>
          <Col xl="4">
            <img src={pantai} alt="pan" style={{ width: "100%", height: "100%", objectFit: "cover" }}></img>
          </Col>
        </Row>
        <Row className="rowPorto min-vh-100" style={{ backgroundColor: "#393E46" }}>
          <div style={{ height: "150px", padding: "3% 7% 3% 7%", color: "#FFFDE3" }}>
            <h2 style={{ fontFamily: "Verdana", fontSize: "4rem", fontWeight: "bold", fontSize: "64px" }}>Portofolio</h2>
            <p>
              See more for my latest work -{" "}
              <a style={{ fontWeight: "bold" }}>
                <i> Portofolio</i>
              </a>
            </p>
          </div>
          <div
            className="d-flex justify-content-center flex-xl-row flex-column"
            style={{
              minHeight: "595px",
              padding: "5%",
              paddingBottom: "10%",
              alignItems: "center", // Menjaga agar konten di tengah
            }}
          >
            <div
              className="mb-2 bg-white"
              style={{
                margin: "20px",
                height: "100%",
                width: "80%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="gambar-portofolio" style={{ width: "95%", height: "70%", marginTop: "3%" }}>
                <img src={pantai} style={{ width: "100%", height: "100%", objectFit: "cover" }}></img>
              </div>
              <div className="title-portofolio px-3" style={{ width: "95%", height: "20%", margin: "3%", textAlign: "center", alignContent: "center" }}>
                <p style={{ fontWeight: "bold", fontSize: "1rem" }}>Lorem ipsum dolor sit amet</p>
              </div>
            </div>
            <div
              className="mb-2 bg-white"
              style={{
                margin: "20px",
                height: "100%",
                width: "80%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="gambar-portofolio" style={{ width: "95%", height: "70%", marginTop: "3%" }}>
                <img src={pantai} style={{ width: "100%", height: "100%", objectFit: "cover" }}></img>
              </div>
              <div className="title-portofolio px-3" style={{ width: "95%", height: "20%", margin: "3%", textAlign: "center", alignContent: "center" }}>
                <p style={{ fontWeight: "bold", fontSize: "1rem" }}>Lorem ipsum dolor sit amet</p>
              </div>
            </div>
            <div
              className="mb-2 bg-white"
              style={{
                margin: "20px",
                height: "100%",
                width: "80%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="gambar-portofolio" style={{ width: "95%", height: "70%", marginTop: "3%" }}>
                <img src={pantai} style={{ width: "100%", height: "100%", objectFit: "cover" }}></img>
              </div>
              <div className="title-portofolio px-3" style={{ width: "95%", height: "20%", margin: "3%", textAlign: "center", alignContent: "center" }}>
                <p style={{ fontWeight: "bold", fontSize: "1rem" }}>Lorem ipsum dolor sit amet</p>
              </div>
            </div>
          </div>
        </Row>
        <Row className="experience min-vh-100" style={{ backgroundColor: "#FFFDE3" }}>
          <div className="subtitle" style={{ height: "150px", padding: "3% 7% 3% 7%", color: "#FFFDE3", backgroundColor: "gray"  }}>
            <h2 style={{ fontFamily: "Verdana", fontSize: "4rem", fontWeight: "bold", color: "#1C2056" }}>Experience</h2>
          </div>
          <div className="konten" style={{ height: "100%",marginTop: "0px", padding: "3% 7% 3% 7%", color: "#1C2056", backgroundColor: "gray" }}>
            <div className="name">wawaa</div>
            <div className="date">awawaa</div>
            <div className="description">
              <ul>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Lorem ipsum dolor sit amet</li>
              </ul>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
