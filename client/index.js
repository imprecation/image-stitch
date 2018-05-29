import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent'; 

import DropZone from 'react-dropzone';
import { Button, Tooltip } from '@material-ui/core';

import './style.scss';

class ImageStitch extends React.Component {
  constructor() {
    super()
    this.MAX_FILES = 4;
    this.API_ENDPOINT = 'http://localhost:8080/image/stitch';
    this.CONTENT_TYPE = 'image/png';

    this.state = { 
      files: [],
      result: null,
      showPreview: false,
      showResult: false,
    }

    this.onDrop = this.onDrop.bind(this);
    this.onClickStitch = this.onClickStitch.bind(this);
    this.onClickResult = this.onClickResult.bind(this);
    this.onResponseStitch = this.onResponseStitch.bind(this);
    this.createBlob = this.createBlob.bind(this);
  }

  onDrop(files) {
    if (files.length > this.MAX_FILES || files.length < 2) 
      return;

    this.setState({ files, showPreview: true, showResult: false });
  }

  onClickStitch() {
    const req = request.post(this.API_ENDPOINT);

    this.state.files.forEach(i => {
      req.attach('images', i);
    })
    
    req.end(this.onResponseStitch);
  }

  onClickResult() {
    const a = document.createElement('a');
    
    a.href = window.URL.createObjectURL(this.createBlob());
    a.download = 'image.png';
    a.click();
  }

  onResponseStitch(err, res) {
    if (res.statusCode === 500) {
      alert(res.text);
      return;
    }
    // Recieves a Base64 encoded PNG
    this.setState({ result: res.text, showPreview: false, showResult: true });
  }

  createBlob() {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(this.state.result.split(',')[1]);
    // separate out the mime component
    const mimeString = this.state.result.split(',')[0].split(':')[1].split(';')[0]
    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    // create a view into the buffer
    const ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ ab ], { 'type': 'image/png' });
  }

  render() {
    const { state } = this;
    let dropzoneRef;

    return (
      <div>
        <DropZone 
          className="image-stitch__dropzone"
          activeClassName="image-stitch__dropzone--active"
          ref={ (node) => { dropzoneRef = node; } }
          onDrop={ this.onDrop }>
          <h2>Drop Files</h2>
        </DropZone>
        <div className="image-stitch__upload">
          <Button 
            variant="raised" 
            onClick={ () => dropzoneRef.open() } >
              Upload Files
          </Button>
        </div>
        {
          state.showPreview &&
          <div className="image-stitch__files">
            <div className="image-stitch__selected">
              {
                state.files.map((i, idx) => 
                  <img src={ i.preview } key={ idx } className="image-stitch__selected-image"/>
                )
              }
            </div>
            {
              !!state.files.length &&
              <Button 
                variant="raised" 
                color="secondary"
                className="image-stitch__button"
                onClick={ this.onClickStitch } >
                  Stitch Files
              </Button>
            }
          </div>
        }
        {
          state.showResult &&
            <Tooltip id="tooltip-icon" title="Click to download">
              <img src={ state.result } className="image-stitch__result" onClick={ this.onClickResult } />
            </Tooltip>
        }
      </div>
    )
  }
}

ReactDOM.render(
  <ImageStitch />,
  document.getElementById('image-stitch')
);