import React from "react";
import Download from "../Download/Download";
import axios from "axios";

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      topText: null,
      bottomText: null,
      imgUrl: null,
      downloadLink: null,
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
    axios.get(`http://localhost:3000/img/meme.jpg`, {
      responseType: 'arraybuffer'
    }).then(async res => {
      var file = await new Blob([res.data]);
      file = await new File([file], "meme.jpg");
      console.log(file);
      this.setState({
        file: file,
        previewLink: URL.createObjectURL(file)
      });
    })
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
    axios.get(this.state.imgUrl, {
      responseType: 'arraybuffer'
    }).then(async res => {
      var file = await new Blob([res.data]);
      file = await new File([file], "meme.jpg");
      console.log(file);
      this.setState({
        file: file,
        previewLink: URL.createObjectURL(file)
      });
    })
  }

  generateMeme() {
    const data = new FormData();
    data.append("file", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    axios
      .post(`http://localhost:3001/upload`, data, config)
      .then(response => {
        alert("The file is successfully uploaded");
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="form-group">
              <label htmlFor="upload">Choose custom image</label>
              <input
                type="file"
                className="form-control-file"
                id="upload"
                onChange={this.handleImgChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="meme-text-top">Choose meme from URL</label>
              <input
                type="text"
                className="form-control"
                id="url-meme"
                placeholder="http://..."
                onChange={this.handleImgUrlChange}
              />
              <button
                className="btn btn-primary"
                onClick={this.updateImg}
                style={{ marginTop: "1rem", width: "100%" }}
              >
                Fetch
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="meme-text-top">Top text</label>
              <input
                type="text"
                className="form-control"
                id="meme-text-top"
                placeholder="That moment when..."
                onChange={this.handleTopTextChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="meme-text-bot">Bottom text</label>
              <input
                type="text"
                className="form-control"
                id="meme-text-bot"
                placeholder="See your compiler logs"
                onChange={this.handleBottomTextChange}
              />
            </div>
            <div className="form-group">
              <button
                className="btn btn-primary"
                onClick={this.generateMeme}
                style={{ marginTop: "1rem", width: "100%" }}
              >
                Generate this meme
              </button>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <img
              className="img-fluid"
              src={this.state.previewLink}
              alt="Meme pic"
            />
          </div>
        </div>
        <Download downloadLink={this.state.downloadLink} />
      </div>
    );
  }
}

export default Upload;
