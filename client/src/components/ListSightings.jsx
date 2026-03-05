import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import moment from "moment";
import SightingsForm from "./SightingsForm";
import "../scss/ListSightings.scss"

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

    useEffect(() => {
        actions.loadSightings()
    },[loadSightings]);

    const grouped = groupByNickname(state.sightings);
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
                setModal(false);
            } else {
                const errorData = await response.json(); 
                console.error("Res not ok:", errorData); 
            }
        } catch (error) {
            console.log(error);
        }
    }


  return (
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
  )
}

export default ListSightings
