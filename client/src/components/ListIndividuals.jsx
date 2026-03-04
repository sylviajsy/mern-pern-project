import { useEffect, useReducer } from "react";
import moment from "moment";
import IndividualForm from "./IndividualForm";

const initialState = {
  individuals: [],
  loading: false,
  error: null,
  editingId:null
};

function individualReducer(state, action) {
  switch (action.type) {

    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, individuals: action.payload };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case 'ADD_INDIVIDUALS':
      return { ...state, individuals: [...state.individuals, action.payload] };

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

const ListIndividuals = () => {
    const [state, dispatch] = useReducer(individualReducer, initialState);

    const loadIndividuals = async () => {
      dispatch({ type: "FETCH_START" });

      try {
        const res = await fetch("/api/individuals");

        if (!res.ok) {
          throw new Error("Failed to fetch individuals");
        }

        const data = await res.json();
        console.log("individuals", data);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: data
        });

      } catch (err) {

        dispatch({
          type: "FETCH_ERROR",
          payload: err.message
        });
      }
    };

    useEffect(() => {
        loadIndividuals()
    },[]);

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
    <div className="list-individuals">
        <h2>Individuals</h2>
        <table>
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
      
            <button onClick={() => dispatch({ type: "SET_EDITING", payload: "NEW" })}>
                    ➕ Add New Individual
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
                        <IndividualForm onAdd={onAdd}/>
                    </div>    
                </div>}
    </div>

  )
}

export default ListIndividuals;
