import { createContext, useContext, useReducer, useCallback } from "react";

const DataContext = createContext(null);

const initialState = {
  individuals: [],
  sightings: [],
  loading: { individuals: false, sightings: false },
  error: { individuals: "", sightings: "" },
};

function reducer(state, action) {
  const { slice } = action;

  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: { ...state.loading, [slice]: true },
        error: { ...state.error, [slice]: "" },
      };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: { ...state.loading, [slice]: false },
        [slice]: action.payload,
      };

    case "FETCH_ERROR":
      return {
        ...state,
        loading: { ...state.loading, [slice]: false },
        error: { ...state.error, [slice]: action.payload },
      };

    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadSlice = useCallback(async (slice, url) => {
    dispatch({ type: "FETCH_START", slice });
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${slice}`);
      const data = await res.json();
      dispatch({ type: "FETCH_SUCCESS", slice, payload: data });
    } catch (e) {
      dispatch({ type: "FETCH_ERROR", slice, payload: e.message });
    }
  }, []);

  const loadIndividuals = useCallback(
    () => loadSlice("individuals", "/api/individuals"),
    [loadSlice]
  );

  const loadSightings = useCallback(
    () => loadSlice("sightings", "/api/sightings"),
    [loadSlice]
  );

  // sightings => individuals refresh
  const refreshAfterSightingChange = useCallback(async () => {
    await Promise.all([loadSightings(), loadIndividuals()]);
  }, [loadSightings, loadIndividuals]);

  return (
    <DataContext.Provider
      value={{
        state,
        actions: { loadIndividuals, loadSightings, refreshAfterSightingChange },
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within <DataProvider />");
  return ctx;
}