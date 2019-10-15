import DropZone from './DropZone'
import React from 'react'
import Spinner from './Spinner'
import Tempalink from './Tempalink'
import UploadActions from '../actions/UploadActions'
import UploadStore from '../stores/UploadStore'
import socket from 'filepizza-socket'
import { formatSize } from '../util'

export default class UploadPage extends React.Component {

  constructor() {
    super()
    this.state = UploadStore.getState()

    this._onChange = () => {
      this.setState(UploadStore.getState())
    }

    this.uploadFile = this.uploadFile.bind(this)
  }

  componentDidMount() {
    UploadStore.listen(this._onChange)
  }

  componentWillUnmount() {
    UploadStore.unlisten(this._onChange)
  }

  uploadFile(file) {
    UploadActions.uploadFile(file)
  }

  handleSelectedFile(event) {
    let files = event.target.files
    if (files.length > 0) {
      UploadActions.uploadFile(files[0])
    }
  }

  render() {
    switch (this.state.status) {
      case 'ready':

        return <DropZone onDrop={this.uploadFile}>
          <div className="page">

            <Spinner dir="up" />

            <h1>FilePizza</h1>
            <p>Free peer-to-peer file transfers in your browser.</p>
            <p>We never store anything. Files only served fresh.</p>
            <p>
              <label className="select-file-label">
                <input type="file" onChange={this.handleSelectedFile} required/>
                <span>select a file</span>
              </label>
            </p>
          </div>
        </DropZone>

      case 'processing':
        return <div className="page">

          <Spinner dir="up" animated />

          <h1>FilePizza</h1>
          <p>잠시만 기다려 주세요...</p>

        </div>

      case 'uploading':
        return <div className="page">

          <h1>FilePizza</h1>
          <Spinner dir="up" animated
            name={this.state.fileName}
            size={this.state.fileSize} />

          <p>파일을 받을 사람에게 이 링크를 보내세요.</p>
          <p>이 페이지가 열려있는 동안 다운로드 받을 수 있습니다.</p>
          <p>접속자: {this.state.peers} &middot; 업로드: {formatSize(this.state.speedUp)}</p>
          <Tempalink token={this.state.token} />

        </div>
    }
  }

}
