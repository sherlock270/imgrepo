import React, { useState } from "react";
import axios from "axios";

export default function ImageDetail(props) {
  const image = props.location.state.image;
  const [name, setName] = useState(image.name);
  const [description, setDescription] = useState(image.description);
  const [editMode, setEditMode] = useState(false);

  function imgDelete(id) {
    axios
      .delete(`http://localhost:8800/delete/${id}`)
      .then(() => {
        props.history.push("/dashboard");
      })
      .catch((err) => console.error(err));
  }

  function submitHandler() {
    axios
      .put("http://localhost:8800/edit", {
        id: image.id,
        description: description,
        name: name,
      })
      .then((res) => {
        setEditMode(false);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="img-detail-container">
      <button type="button" onClick={props.history.goBack}>
        {"< Back"}
      </button>
      {editMode ? null : (
        <button type="button" onClick={() => setEditMode(true)}>
          Edit
        </button>
      )}
      {editMode ? (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      ) : (
        <h1>{name}</h1>
      )}

      <img src={image.img_url} alt={description} />
      <h2>Description:</h2>
      {editMode ? (
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      ) : (
        <p>{description}</p>
      )}
      <p>
        Created: {image.created_at} by {image.user}
      </p>
      {editMode ? (
        <button type="button" onClick={submitHandler}>
          Done
        </button>
      ) : (
        <button type="button" onClick={() => imgDelete(image.id)}>
          Delete
        </button>
      )}
    </div>
  );
}
