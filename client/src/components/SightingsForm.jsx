import React, { useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useData } from "../context/DataContext";
// import "../scss/SightingsForm.scss"

const SightingsForm = ({ onAdd }) => {
  const { state, actions } = useData();
  const { loadIndividuals, refreshAfterSightingChange } = actions;

  const [form, setForm] = useState({
    sighting_time: "",
    individual_ids: [],
    location: "",
    is_healthy: false,
    sighter_email: "",
  });

  useEffect(() => {
    loadIndividuals();
  },[loadIndividuals])

  //create functions that handle the event of the user typing into the form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      // group sightings checkboxes
      if (type === "checkbox" && name === "individual_ids") {
        const id = Number(value);

        return {
          ...prev,
          individual_ids: checked
            ? [...prev.individual_ids, id]
            : prev.individual_ids.filter((i) => i !== id),
        };
      }

      // normal boolean checkbox
      if (type === "checkbox") {
        return {
          ...prev,
          [name]: checked,
        };
      }

      // normal input
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const clearForm = () => {
    setForm({ sighting_time: "",
    individual_ids: "",
    location: "",
    is_healthy: true,
    sighter_email: "", });
  };

  //A function to handle the submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("sight form",form);
    await refreshAfterSightingChange();
    await onAdd(form);
    clearForm();
  };

  return (
    <div>
    <h3> Add New Sightings </h3>
    <Form
      data-testid="sightingsForm"
      className="form-sightings"
      onSubmit={handleSubmit}
    >
      <Form.Group>
        <Form.Label>Nick Name</Form.Label>
            {state.individuals.map((ind) => (
              <label key={ind.id}>
                <input
                  type="checkbox"
                  name="individual_ids"
                  value={ind.id}
                  checked={form.individual_ids.includes(ind.id)}
                  onChange={handleChange}
                />
                {ind.nickname}
              </label>
            ))}
      </Form.Group>

      <Form.Group>
        <Form.Label>Location</Form.Label>
        <input
          type="text"
          name="location"
          id="add-location"
          placeholder="Location"
          required
          value={form.location}
          onChange={handleChange}
        />
      </Form.Group>
      
      <Form.Group>
        <Form.Label>Sighting Time</Form.Label>
        <input
          type="datetime-local"
          name="sighting_time"
          id="add-sighting_time"
          placeholder="Sighting Time"
          required
          value={form.sighting_time}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Sighter Email</Form.Label>
        <input
          type="text"
          name="sighter_email"
          id="add-sighter_email"
          placeholder="Sighter Email"
          required
          value={form.sighter_email}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Healthy?</Form.Label>
        <input
          type="checkbox"
          name="is_healthy"
          id="add-is_healthy"
          value={form.is_healthy}
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

export default SightingsForm;