import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [uploadFile, setUploadFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const changeHandler = (e) => {
    setFileUrl(URL.createObjectURL(e.target.files[0]));
    setUploadFile(e.target.files[0]);
    console.log(URL.createObjectURL(e.target.files[0]));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Update the formData object
    formData.append("uploadFile", uploadFile, uploadFile.name);

    console.log(formData);
  };

  return (
    <div className="dash-container">
      <h1>Dashboard</h1>
      <Link to="/">Landing</Link>
      <form onSubmit={submitHandler}>
        <input type="file" onChange={changeHandler} />
        <button type="submit">Submit</button>
      </form>
      {uploadFile ? (
        <img src={fileUrl} height="100px" width="100px" alt="preview" />
      ) : null}
    </div>
  );
}
