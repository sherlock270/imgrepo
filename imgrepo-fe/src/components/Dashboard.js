import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadFile: null,
      fileUrl: null,
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  changeHandler = (e) => {
    // console.log(e.target.files[0].name);
    this.setState({
      fileUrl: URL.createObjectURL(e.target.files[0]),
      uploadFile: e.target.files[0],
    });
  };

  submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Update the formData object
    formData.append(
      "uploadFile",
      this.state.uploadFile,
      this.state.uploadFile.name
    );

    // console.log(typeof formData);

    axios
      .post("http://localhost:8800", formData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  };

  render() {
    return (
      <div className="dash-container">
        <h1>Dashboard</h1>
        <Link to="/">Landing</Link>
        <form onSubmit={this.submitHandler}>
          <input type="file" onChange={this.changeHandler} />
          <button type="submit">Submit</button>
        </form>
        {this.state.fileUrl ? (
          <img
            src={this.state.fileUrl}
            height="100px"
            width="100px"
            alt="preview"
          />
        ) : null}
      </div>
    );
  }
}

export default Dashboard;
