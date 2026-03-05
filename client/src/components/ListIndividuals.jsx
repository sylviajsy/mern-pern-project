import { useEffect, useReducer } from "react";
import { useData } from "../context/DataContext";
import moment from "moment";
import IndividualForm from "./IndividualForm";
import "../scss/ListIndividuals.scss"

const ListIndividuals = () => {
    const { state, actions } = useData();
    const [editingId, setEditingId] = useState(null);

    // Use Context actions to fetch
    useEffect(() => {
        actions.loadIndividuals()
    },[actions]);

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
                console.log("Add Success:", data);
                await actions.loadIndividuals();
                // await actions.refreshAfterSightingChange();
            } else {
                const errorData = await response.json(); 
                console.error("Res not ok:", errorData); 
            }
        } catch (error) {
            console.log(error);
        }
    }

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
                        <td>{ind.nickname}</td>
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
      
            <button onClick={() => setEditingId("NEW")}>
                    ➕ Add New Individual
            </button>

            {state.editingId && 
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            className="close-btn" 
                            onClick={() => setEditingId(null)}
                        >
                            &times;
                        </button>
                        <IndividualForm onAdd={onAdd}/>
                    </div>    
                </div>}
    </div>

  )
}

export default ListIndividuals;
