import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import moment from "moment";
import SightingsForm from "./SightingsForm";
import "../scss/ListSightings.scss"
import SearchBar from "./SearchBar";

function groupByNickname(sightings) {
  return sightings.reduce((acc, s) => {
    const key = s.nickname || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
}

const ListSightings = () => {
    const { state, actions } = useData();
    const { loadSightings } = actions;
    const [modal, setModal] = useState(false);
    const [filteredSightings, setFilteredSightings] = useState(null);


    useEffect(() => {
        loadSightings()
    },[loadSightings]);

    const sightingsToShow = filteredSightings ?? state.sightings;

    const grouped = groupByNickname(sightingsToShow);
    const nicknames = Object.keys(grouped).sort();

    if (state.loading.sightings) return <p>Loading sightings...</p>;
    if (state.error.sightings) return <p style={{ color: "red" }}>{state.error.sightings}</p>;

    const onAdd = async(newSightings) => {
        try {
            const response = await fetch("/api/sightings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newSightings),
            });

            if (response.ok){
                const data = await response.json();
                await actions.loadSightings();
                await actions.refreshAfterSightingChange();
                setFilteredSightings(null);
                setModal(false);
            } else {
                const errorData = await response.json(); 
                console.error("Res not ok:", errorData); 
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onSearch = async (searchParams) => {
        try {
            console.log("searchParams:", searchParams);
            const response = await fetch(`/api/sightings?${searchParams}`);

            if (response.ok) {
                const data = await response.json();
                console.log('Search data', data)
                if (data.length === 0) {
                    window.alert("No sightings found matching your criteria. Showing all sightings instead.");
                    setFilteredSightings(null);
                    await loadSightings();
                    return;
                }
                   setFilteredSightings(data); 
                } else {
                    const errorData = await response.json();
                    window.alert(errorData.error);
                }
            } catch (error) {
                console.log("Search failed:", error);
            }
    }

  return (
    <div>
        <SearchBar onSearch={onSearch}/>
        <div className="list-sightings">
            <h2>Sightings</h2>

        {nicknames.map((name) => (
            <div key={name} style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 8 }} className="header-section">{name}</h3>

                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Location</th>
                            <th>Healthy</th>
                            <th>Sighter Email</th>
                        </tr>
                    </thead>

                    <tbody>
                        {grouped[name]
                            .slice()
                            .sort((a, b) => new Date(b.sighting_time) - new Date(a.sighting_time))
                            .map((s) => (
                                <tr key={s.id}>
                                    <td>{moment(s.sighting_time).format("YYYY-MM-DD HH:mm")}</td>
                                    <td>{s.location}</td>
                                    <td>{s.is_healthy ? "Yes" : "No"}</td>
                                    <td>{s.sighter_email}</td>
                                </tr>
                        ))}
                        
                    </tbody>
                </table>
            </div>

        ))}

        <button onClick={() => setModal(true)}>
                ➕ Add New Sightings
        </button>

        {modal && 
            <div className="modal-overlay">
                <div className="modal-content">
                    <button 
                        className="close-btn" 
                        onClick={() => setModal(false)}
                    >
                        &times;
                    </button>
                    <SightingsForm onAdd={onAdd}/>
                </div>    
            </div>}
            
        </div>
    </div>
  )
}

export default ListSightings
