import React, { useState, useEffect, useReducer } from "react";
import moment from "moment";
import "../scss/ListSpecies.scss"

const initialState = {
  species: [],
  loading: false,
  error: null,
};

function speciesReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, species: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    // case 'ADD_SPECIES':
    //   return { ...state, species: [...state.species, action.payload] };
    // case 'UPDATE_SPECIES':
    //   return {
    //     ...state,
    //     data: state.species.map((item) =>
    //       item.id === action.payload.id ? action.payload : item
    //     ),
    //   };
    // case 'DELETE_SPECIES':
    //   return {
    //     ...state,
    //     data: state.data.filter((item) => item.id !== action.payload),
    //   };
    default:
      return state;
  }
}

const ListSpecies = () => {
  const [state, dispatch] = useReducer(speciesReducer, initialState);

  const loadSpecies = async () => {
    dispatch({ type: "FETCH_START" });

    try {
        const res = await fetch("/api/species");

        if (!res.ok) throw new Error(`Failed to fetch species (${res.status})`);

        const data = await res.json();
        console.log("species", data);
        
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
  };

  useEffect(() => {
    loadSpecies();
  }, []);

  return (
    <div>
      <div className="list-species">
        <h2 className="header-section">Species</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Common Name</th>
              <th>Scientific Name</th>
              <th>Status</th>
              <th>Estimated Wild Count</th>
            </tr>
          </thead>
            
            <tbody>
              {state.species.map((sp) => (
                <tr key={sp.id}>
                  <td>{sp.common_name}</td>
                  <td>{sp.scientific_name}</td>
                  <td>{sp.conservation_status_code}</td>
                  <td>{sp.estimated_wild_count}</td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListSpecies;
