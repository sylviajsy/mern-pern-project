import { useEffect, useReducer } from "react";
import moment from "moment";
import SightingsForm from "./SightingsForm";

const initialState = {
  sightings: [],
  loading: false,
  error: null,
  editingId:null
};

function sightingsReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, sightings: action.payload };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case 'ADD_SIGHTINGS':
      return { ...state, sightings: [...state.sightings, action.payload] };

    // Edit mode
    case "SET_EDITING":
        return {
            ...state,
            editingId: action.payload
        };

    case "CLEAR_EDITING":
        return {
            ...state,
            editingId: null
        };


    default:
      return state;
  }
}

function groupByNickname(sightings) {
  return sightings.reduce((acc, s) => {
    const key = s.nickname || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
}

const ListSightings = () => {
    const [state, dispatch] = useReducer(sightingsReducer, initialState);

    const loadSightings = async () => {
      dispatch({ type: "FETCH_START" });

      try {
        const res = await fetch("/api/sightings");
        if (!res.ok) throw new Error("Failed to fetch sightings");

        const data = await res.json();
        console.log("sightings", data);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    useEffect(() => {
        loadSightings()
    },[]);

    const grouped = groupByNickname(state.sightings);
    const nicknames = Object.keys(grouped).sort();

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
                console.log("Add Success:", data);
                dispatch({
                    type: "ADD_INDIVIDUALS",
                    payload: data
                });
                dispatch({
                    type: "CLEAR_EDITING",
                });
            } else {
                const errorData = await response.json(); 
                console.error("Res not ok:", errorData); 
            }
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <div>
        <h2>Sightings</h2>

    {nicknames.map((name) => (
        <div key={name} style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 8 }}>{name}</h3>

            <table>
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

    <button onClick={() => dispatch({ type: "SET_EDITING", payload: "NEW" })}>
            ➕ Add New Sightings
    </button>

    {state.editingId && 
        <div className="modal-overlay">
            <div className="modal-content">
                <button 
                    className="close-btn" 
                    onClick={() => dispatch({ type: "CLEAR_EDITING" })}
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
