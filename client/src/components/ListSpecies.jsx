import React, { useState, useEffect, useReducer } from "react";
import * as ioicons from "react-icons/io5";
// import MyForm from "./Form";
// import Student from "./Student";

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

  //this is the state needed for the UpdateRequest
  // const [editingStudent, setEditingStudent] = useState(null);

  const loadSpecies = async () => {
    dispatch({ type: "FETCH_START" });

    try {
        const res = await fetch("/api/species");

        if (!res.ok) throw new Error(`Failed to fetch species (${res.status})`);

        const data = await res.json();
        console.log("species", data);
        
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
  };

  useEffect(() => {
    loadSpecies();
  }, []);

  // const onSaveStudent = (newStudent) => {
  //   //console.log(newStudent, "From the parent - List of Students");
  //   setStudents((students) => [...students, newStudent]);
  // };

  // //A function to control the update in the parent (student component)
  // const updateStudent = (savedStudent) => {
  //   // console.log("Line 29 savedStudent", savedStudent);
  //   // This function should update the whole list of students -
  //   loadStudents();
  // };

  // //A function to handle the Delete functionality
  // const onDelete = (student) => {
  //   //console.log(student, "delete method")
  //   return fetch(`http://localhost:8080/api/students/${student.id}`, {
  //     method: "DELETE"
  //   }).then((response) => {
  //     //console.log(response);
  //     if (response.ok) {
  //       loadStudents();
  //     }
  //   });
  // };

  // //A function to handle the Update functionality
  // const onUpdate = (toUpdateStudent) => {
  //   //console.log(toUpdateStudent);
  //   setEditingStudent(toUpdateStudent);
  // };

  return (
    <div className="mybody">
      <div className="list-students">
        <h1>Endangered Animals</h1>
        <h2>Species</h2>
        <ul>
          {state.species.map((sp) => {
            return (
              <li key={sp.id}>
                <strong>{sp.common_name}</strong>
                {sp.scientific_name ? ` (${sp.scientific_name})` : ""}
                {" — "}
                status: {sp.conservation_status_code}
                {sp.estimated_wild_count !== null && sp.estimated_wild_count !== undefined
                  ? ` — est: ${sp.estimated_wild_count}`
                  : ""}
              </li>
            );
          })}
        </ul>
      </div>
      {/* <MyForm
        key={editingStudent ? editingStudent.id : null}
        onSaveStudent={onSaveStudent}
        editingStudent={editingStudent}
        onUpdateStudent={updateStudent}
      /> */}
    </div>
  );
};

export default ListSpecies;
