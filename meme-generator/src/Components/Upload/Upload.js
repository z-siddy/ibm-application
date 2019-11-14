import React from "react";
import axios from "axios";
import "./Upload.css";

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      topText: null,
      bottomText: null,
      imgUrl: null,
      previewLink: null
    };
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleTopTextChange = this.handleTopTextChange.bind(this);
    this.handleBottomTextChange = this.handleBottomTextChange.bind(this);
    this.handleImgUrlChange = this.handleImgUrlChange.bind(this);
    this.updateImg = this.updateImg.bind(this);
    this.generateMeme = this.generateMeme.bind(this);
  }

  componentDidMount() {
    axios
      .get(`/img/meme.jpg`, {
        responseType: "arraybuffer"
      })
      .then(async res => {
        var file = await new Blob([res.data]);
        file = await new File([file], "meme.jpg");
        this.setState({
          file: file,
          previewLink: URL.createObjectURL(file)
        });
      });
  }

  handleImgChange(event) {
    this.setState({
      file: event.target.files[0],
      previewLink: URL.createObjectURL(event.target.files[0])
    });
  }

  handleTopTextChange(event) {
    this.setState({
      topText: event.target.value
    });
  }

  handleBottomTextChange(event) {
    this.setState({
      bottomText: event.target.value
    });
  }

  handleImgUrlChange(event) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    this.setState({
      imgUrl: proxyurl + event.target.value
    });
  }

  updateImg() {
    axios
      .get(this.state.imgUrl, {
        responseType: "arraybuffer"
      })
      .then(async res => {
        var file = await new Blob([res.data]);
        file = await new File([file], "meme.jpg");
        this.setState({
          file: file,
          previewLink: URL.createObjectURL(file)
        });
      });
  }

  getFileExtension(filename) {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
  }

  generateMeme() {
    const data = new FormData();
    data.append("file", this.state.file);
    data.append("topText", this.state.topText);
    data.append("bottomText", this.state.bottomText);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post(`/upload`, data, config)
      .then(async res => {
        var ext = this.getFileExtension(res.data.path);
        const link = document.createElement("a");
        link.href = `/${res.data.path}/download`;
        link.setAttribute("download", "meme." + ext);
        document.body.appendChild(link);
        await link.click();
        await link.remove();
        alert("Thank you for using this amazing APP!");
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-12 text-center">
            <h2>Made by <a href="https://github.com/z-siddy/">z.siddy</a></h2>
          </div>
          <div className="col-12 col-lg-6 input-box">
            <div className="form-group">
              <label className="btn-bs-file btn btn-lg btn-custom">
                UPLOAD IMAGE
                <input type="file" onChange={this.handleImgChange} />
              </label>
            </div>
            <div className="form-group custom-box">
              <label htmlFor="meme-text-top">Image URL</label>
              <input
                type="text"
                className="form-control"
                id="url-meme"
                placeholder="http://..."
                onChange={this.handleImgUrlChange}
              />
              <button
                className="btn btn-custom"
                onClick={this.updateImg}
                style={{ marginTop: "1rem", width: "100%" }}
              >
                FETCH IMAGE
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="meme-text-top">TOP TEXT</label>
              <input
                type="text"
                className="form-control"
                id="meme-text-top"
                placeholder="That moment when..."
                onChange={this.handleTopTextChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="meme-text-bot">BOTTOM TEXT</label>
              <input
                type="text"
                className="form-control"
                id="meme-text-bot"
                placeholder="See your compiler logs"
                onChange={this.handleBottomTextChange}
              />
            </div>
            {this.state.topText && this.state.bottomText ? (
              <div className="form-group">
                <button
                  className="btn btn-custom"
                  onClick={this.generateMeme}
                  style={{ marginTop: "1rem", width: "100%" }}
                >
                  GENERATE DOWNLOAD LINK
                </button>
              </div>
            ) : null}
          </div>
          <div className="col-12 col-lg-6 meme-box">
            <img
              className="img-fluid"
              src={this.state.previewLink}
              alt="Meme pic"
            />
            <h2 className="top">{this.state.topText}</h2>
            <h2 className="bottom">{this.state.bottomText}</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Upload;
