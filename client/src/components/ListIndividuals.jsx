import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import moment from "moment";
import IndividualForm from "./IndividualForm";
import IndividualDetailModal from "./IndividualDetailModal";
import "../scss/ListIndividuals.scss"

const ListIndividuals = () => {
    const { state, actions } = useData();
    const { loadIndividuals } = actions;
    const [modal, setModal] = useState(false);
    const [selectedIndividuals, setSelectedIndividuals] = useState(null);
    const [detailModal, setDetailModal] = useState(false);

    // Use Context actions to fetch
    useEffect(() => {
        actions.loadIndividuals()
    },[loadIndividuals]);

    const onAdd = async(newIndividuals) => {
        try {
            const response = await fetch("/api/individuals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newIndividuals),
            });

            if (response.ok){
                const data = await response.json();
                console.log("Individuals:", data);
                await actions.loadIndividuals();
                setModal(false);
            } else {
                const errorData = await response.json(); 
                console.error("Res not ok:", errorData); 
            }
        } catch (error) {
            console.log(error);
        }
    }

    // View Details Page
    const handleDetails = async (id) => {
        try{
            const response = await fetch(`/api/individuals/${id}`);
            const data = await response.json();

            if (!response.ok) {
                window.alert(data.error || "Failed to fetch details");
                return;
            }

            setSelectedIndividuals(data);
            setDetailModal(true);
        } catch (error) {
            console.log(error);
        }
    }

    if (state.loading.individuals) return <p>Loading individuals...</p>;
    if (state.error.individuals) return <p style={{ color: "red" }}>{state.error.individuals}</p>;

  return (
    <div className="list-individuals">
        <div className="header-section">
            <h2>Individuals</h2>
        </div>

        <table className="custom-table">
            <thead>
                <tr>
                    <th>Nickname</th>
                    <th>Species</th>
                    <th>Scientist</th>
                    <th>Sightings count</th>
                    <th>First Sighting</th>
                    <th>Latest Sighting</th>
                </tr>
            </thead>

            <tbody>
                {state.individuals.map((ind) => (
                    <tr key={ind.id}>
                        <td>
                            <button
                                onClick={() => handleDetails(ind.id)}
                            >
                                {ind.nickname}
                            </button>
                        </td>
                        <td>{ind.species}</td>
                        <td>{ind.scientist_name}</td>
                        <td>{ind.sighting_count}</td>

                        <td>
                            {ind.first_sighting
                                ? moment(ind.first_sighting).format("YYYY-MM-DD HH:mm")
                                : "None"}
                        </td>

                        <td>
                            {ind.latest_sighting
                                ? moment(ind.latest_sighting).format("YYYY-MM-DD HH:mm")
                                : "None"}
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
      
            <button onClick={() => setModal(true)}>
                    ➕ Add New Individual
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
                        <IndividualForm onAdd={onAdd}/>
                    </div>    
                </div>}

            {detailModal &&
                <div className="modal-overlay">
                    <div className="modal-content individual-detail-modal">
                        <button 
                            className="close-btn" 
                            onClick={() => setDetailModal(false)}
                        >
                            &times;
                        </button>
                        <IndividualDetailModal individual={selectedIndividuals}/>
                    </div>
                </div>}
    </div>

  )
}

export default ListIndividuals;
