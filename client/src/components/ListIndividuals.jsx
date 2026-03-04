import { useEffect, useReducer } from "react";
import moment from "moment";

const initialState = {
  individuals: [],
  loading: false,
  error: null
};

function individualReducer(state, action) {
  switch (action.type) {

    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, individuals: action.payload };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

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

  return (
    <div>
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
                            ? moment(ind.first_sighting).format("YYYY-MM-DD HH:MM")
                            : "None"}
                    </td>

                    <td>
                        {ind.latest_sighting
                            ? moment(ind.latest_sighting).format("YYYY-MM-DD HH:MM")
                            : "None"}
                    </td>

                </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListIndividuals;
