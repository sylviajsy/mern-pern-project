import React, { useState, useEffect, useReducer } from "react";
import moment from "moment";
// import MyForm from "./Form";

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
      <div className="list-species">
        <h2>Species</h2>
        <table>
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
