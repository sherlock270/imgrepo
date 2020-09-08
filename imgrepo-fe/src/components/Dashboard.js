import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadFile: "",
      fileUrl: null,
      images: [],
      name: "",
      description: "",
      loading: false,
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  componentDidMount() {
    this.refreshLib();
  }

  refreshLib = () => {
    this.setState({ loading: true });
    axios
      .get("https://img-repo.herokuapp.com/lib")
      .then((data) => this.setState({ images: data.data.data, loading: false }))
      .catch((err) => console.error(err));
  };

  changeHandler = (e) => {
    console.log();
    if (e.target.files.length > 0) {
      this.setState({
        fileUrl: URL.createObjectURL(e.target.files[0]),
        uploadFile: e.target.files[0],
      });
    } else {
      this.setState({ fileUrl: "", uploadFile: "" });
    }
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

    formData.append("name", this.state.name);
    formData.append("description", this.state.description);

    axios
      .post("https://img-repo.herokuapp.com/upload", formData)
      .then((res) => {
        this.mainInput.value = "";
        this.setState({
          uploadFile: "",
          fileUrl: null,
        });
        this.refreshLib();
      })
      .catch((err) => console.error(err));
  };

  render() {
    return (
      <div className="dash-container">
        <h1>Dashboard</h1>
        <Link to="/">Landing</Link>
        <form onSubmit={this.submitHandler}>
          <input
            type="file"
            onChange={this.changeHandler}
            accept="image/*"
            ref={(ref) => (this.mainInput = ref)}
          />
          <input
            type="text"
            onChange={(e) => {
              this.setState({ name: e.target.value });
            }}
            placeholder="Enter the name"
          />
          <input
            type="text"
            onChange={(e) => {
              this.setState({ description: e.target.value });
            }}
            placeholder="Enter description"
          />
          <button type="submit">Submit</button>
        </form>
        {this.state.fileUrl ? (
          <div className="preview">
            <h2>Preview</h2>
            <img
              src={this.state.fileUrl}
              height="100px"
              width="100px"
              alt="preview"
            />
          </div>
        ) : null}
        <div className="lib">
          <h2>Current Images</h2>
          {this.state.loading ? (
            <h2>Loading</h2>
          ) : this.state.images.length > 0 ? (
            this.state.images.map((image, index) => {
              return (
                <Link
                  to={{
                    pathname: "/image",
                    state: { image: image },
                  }}
                  key={image.img_url}
                >
                  <img
                    src={image.img_url}
                    alt={image.description}
                    height="100px"
                    width="100px"
                  />
                </Link>
              );
            })
          ) : (
            <h3>No Images to Display</h3>
          )}
        </div>
      </div>
    );
  }
}

export default Dashboard;
