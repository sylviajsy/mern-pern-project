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
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    };

    useEffect(() => {
        loadSightings()
    },[]);

    const grouped = groupByNickname(state.sightings);
    const nicknames = Object.keys(grouped).sort();

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
        
    </div>
  )
}

export default ListSightings
