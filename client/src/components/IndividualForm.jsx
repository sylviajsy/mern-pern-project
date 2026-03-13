import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import "../scss/IndividualForm.scss";
import { toast } from "react-toastify";

const IndividualForm = ({ onAdd }) => {
  const [species, setSpecies] = useState([]);
  const [form, setForm] = useState({
    nickname: "",
    scientist_name: "",
    species_id: "",
  });

  const loadSpecies = async () => {
    try {
        const res = await fetch("/api/species");
        if (!res.ok) {
          toast.error(data.error || "Failed to fetch species");
          return;
        }
        const data = await res.json();
        setSpecies(data);
      } catch (error) {
        console.log(error);
        toast.error("Network error. Please try again later.");
      };
  }

  useEffect(() => {
    loadSpecies();
  },[])

  //create functions that handle the event of the user typing into the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({ nickname: "", scientist_name: "", species: "" });
  };

  //A function to handle the submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    clearForm();
  };

  return (
    <div>
    <h3> Add New Individual </h3>
    <Form
      data-testid="individualsForm"
      className="form-individuals"
      onSubmit={handleSubmit}
    >
      <Form.Group>
        <Form.Label>Nick Name</Form.Label>
        <input
          type="text"
          name="nickname"
          id="add-nickname"
          placeholder="Nick Name"
          required
          value={form.nickname}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Species</Form.Label>
        <select
          name="species_id"
          id="add-species"
          required
          value={form.species_id}
          onChange={handleChange}
        >
          <option value="">Select species</option>
            {species.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.common_name}
              </option>
            ))}
        </select>
      </Form.Group>
      <Form.Group>
        <Form.Label>Scientist Name</Form.Label>
        <input
          type="text"
          name="scientist_name"
          id="add-scientist-name"
          placeholder="Scientist Name"
          required
          value={form.scientist_name}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="d-flex justify-content-center mt-3">
        <Button type="submit" variant="outline-success">
          Add
        </Button>
      </Form.Group>
    </Form>
    </div>
  );
};

export default IndividualForm;
