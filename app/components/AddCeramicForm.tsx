import React from "react";

const AddCeramicForm = () => {
  function handleSubmitted(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("submitted");
  }
  return (
    <div>
      <form onSubmit={handleSubmitted}>
        <label htmlFor="size">Size:</label>
        <input type="text" placeholder="60*60" id="size" name="size" />
        <label htmlFor="name">Code:</label>
        <input type="text" placeholder="205" id="name" name="name" />
        <label htmlFor="type">Type:</label>
        <select name="type" id="type">
          <option value="digital">Digital</option>
          <option value="normal" selected>
            Normal
          </option>
          <option value="polished">Polished</option>
        </select>
        <label htmlFor="area">Total(m2):</label>
        <input type="text" placeholder="10" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddCeramicForm;
