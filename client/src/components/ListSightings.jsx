import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import moment from "moment";
import SightingsForm from "./SightingsForm";
import "../scss/ListSightings.scss"
import "../scss/SightingsGroup.scss"
import SearchBar from "./SearchBar";
import { toast } from "react-toastify";

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
    const [groupSightings, setGroupSightings] = useState([]);

    useEffect(() => {
        loadSightings()
    },[loadSightings]);

    const loadGroupSightings = async () => {
        try {
            const response = await fetch("/api/sightings/group");

            const data = await response.json();

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData || "Failed to load group sightings");
                return;
            }

            console.log('GroupSightings',data);
            setGroupSightings(data);
        } catch (error) {
            console.log(error);
            toast.error("Network error. Please try again later.");
        }
    };

    useEffect(() => {
        loadGroupSightings();
    }, []);

    const sightingsToShow = filteredSightings ?? state.sightings;

    const grouped = groupByNickname(sightingsToShow);
    const nicknames = Object.keys(grouped).sort();

    if (state.loading.sightings) return <p>Loading sightings...</p>;
    if (state.error.sightings) return <p style={{ color: "red" }}>{state.error.sightings}</p>;

    const onAdd = async(newSightings) => {
        try {
            const response = await fetch("/api/sightings/group", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newSightings),
            });

            if (response.ok){
                const data = await response.json();
                toast.success("Sighting added successfully");
                await actions.refreshAfterSightingChange();
                await loadGroupSightings();
                setFilteredSightings(null);
                setModal(false);
            } else {
                const errorData = await response.json(); 
                toast.error(errorData.error || "Failed to add sighting");
            }
        } catch (error) {
            console.log(error);
            toast.error("Network error. Please try again later.");
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
                    toast.error("No sightings found matching your criteria. Showing all sightings instead.");
                    setFilteredSightings(null);
                    await loadSightings();
                    return;
                }
                   setFilteredSightings(data); 
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.error);
                }
            } catch (error) {
                console.log("Search failed:", error);
                toast.error("Network error. Please try again later.");
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
            </div>
        }
        </div>

        <div className="group-sightings">
            <h2 className="header-section">Group Sightings</h2>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Animals</th>
                        <th>Healthy</th>
                        <th>Sighter Email</th>
                    </tr>
                </thead>

                <tbody>
                    {groupSightings.map((s) => (
                            <tr key={s.id}>
                                <td>{moment(s.sighting_time).format("YYYY-MM-DD HH:mm")}</td>
                                <td>{s.location}</td>
                                <td>{(s.individuals || []).join(", ")}</td>
                                <td>{s.is_healthy ? "Yes" : "No"}</td>
                                <td>{s.sighter_email}</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ListSightings
