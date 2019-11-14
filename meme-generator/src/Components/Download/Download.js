import React from 'react';

class Download extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      downloadLink: this.props.downloadLink
    }
  }

  render() {
    const style = {
      marginTop: '2rem',
      width: '100%'
    }

    return (
      <div className="row">
        <div className="col-12">
          { this.state.downloadLink ? <button className="btn btn-success" style={style}>DOWNLOAD THIS TREASURE</button> : null }
        </div>
      </div>
    );
  }
}

export default Download;