import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataProvider } from "./context/DataContext";
import MyNavBar from "./routes/Navbar";
import ListSpecies from "./components/ListSpecies";
import ListIndividuals from "./components/ListIndividuals";
import ListSightings from "./components/ListSightings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <DataProvider>
      <div className="App">
        <MyNavBar />
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          toastStyle={{
            marginTop: "40vh",
            textAlign: "center"
          }}
        />
        <ListSpecies />
        <ListIndividuals />
        <ListSightings />
      </div>
    </DataProvider>
  );
}

export default App;
