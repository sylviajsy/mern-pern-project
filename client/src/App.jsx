import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavBar from "./routes/Navbar";
import ListSpecies from "./components/ListSpecies";
import ListIndividuals from "./components/ListIndividuals";
import ListSightings from "./components/ListSightings";

function App() {
  return (
    <div className="App">
      <MyNavBar />
      <h1>Endangered Species Tracker</h1>
      <ListSpecies />
      <ListIndividuals />
      <ListSightings />
    </div>
  );
}

export default App;
