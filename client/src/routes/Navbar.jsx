import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../assets/BlueTechtonicaWord.png";
import "../scss/NavBar.scss"

function MyNavBar(props) {
  return (
    <>
      <Navbar data-testid="navbar" sticky="top">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={Logo}
              height="30"
              className="d-lg-inline-block"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          
          <Navbar.Text className="navbar-title mx-auto">
            Endangered Species Tracker
          </Navbar.Text>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavBar;
