import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const IndividualForm = ({ onAdd }) => {

  const [form, setForm] = useState({
    nickname: "",
    scientist_name: "",
    species: "",
  });

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
        <input
          type="text"
          name="species"
          id="add-species"
          required
          value={form.species}
          onChange={handleChange}
        />
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
      <Form.Group>
        <Button type="submit" variant="outline-success">
          Add
        </Button>
      </Form.Group>
    </Form>
  );
};

export default IndividualForm;
