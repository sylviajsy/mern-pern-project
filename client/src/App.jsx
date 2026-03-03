import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavBar from "./routes/Navbar";
import ListStudents from "./components/ListStudents";

function App() {
  return (
    <div className="App">
      <MyNavBar />
      <ListStudents />
    </div>
  );
}

export default App;
