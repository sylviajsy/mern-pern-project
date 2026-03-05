import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
// import "../scss/SightingsForm.scss"

const SightingsForm = ({ onAdd }) => {
  const [nickname, setNickname] = useState([]);
  const [form, setForm] = useState({
    sighting_time: "",
    individual_id: "",
    location: "",
    is_healthy: false,
    sighter_email: "",
  });

  const loadNickname = async () => {
    try {
        const res = await fetch("/api/individuals");
        if (!res.ok) throw new Error("Failed to fetch nick name");
        const data = await res.json();
        setNickname(data);
      } catch (error) {
        console.log(error);
      };
  }

  useEffect(() => {
    loadNickname();
  },[])

  //create functions that handle the event of the user typing into the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({ sighting_time: "",
    individual_id: "",
    location: "",
    is_healthy: true,
    sighter_email: "", });
  };

  //A function to handle the submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("sight form",form);
    onAdd(form);
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
        <select
          name="individual_id"
          id="add-individual_id"
          required
          value={form.individual_id}
          onChange={handleChange}
        >
          <option value="">Select Nick Name</option>
            {nickname.map((name) => (
              <option key={name.id} value={name.id}>
                {name.nickname}
              </option>
            ))}
        </select>
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