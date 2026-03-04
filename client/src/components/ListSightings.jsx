import { useEffect, useReducer } from "react";
import moment from "moment";

const initialState = {
  sightings: [],
  loading: false,
  error: null,
};

function sightingsReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, sightings: action.payload };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
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
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    useEffect(() => {
        loadSightings()
    },[]);
  return (
    <div>
        <h2>Sightings</h2>

        <table>
            <thead>
                <tr>
                    <th>Nick Name</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Healthy</th>
                    <th>Sighter Email</th>
                </tr>
            </thead>

            <tbody>
                {state.sightings.map((s) => (
                    <tr key={s.id}>
                    <td>
                        {s.sighting_time
                        ? moment(s.sighting_time).format("YYYY-MM-DD HH:mm")
                        : "—"}
                    </td>

                    <td>{s.nickname}</td>

                    <td>{s.location}</td>

                    <td>{s.is_healthy ? "Yes" : "No"}</td>

                    <td>{s.sighter_email}</td>
                    </tr>
                ))}
            </tbody>
      </table>
      
    </div>
  )
}

export default ListSightings
