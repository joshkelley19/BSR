import React, { useState } from 'react'
import { saveMarketing } from './services/firebase-service';
import { renderOptions, setValue } from './services/form-service';

const Marketing = (props) => {
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');

  return (
    <div>
      <div id="marketing-form" className="container">
        <div className="mb-3">
          <input id="display-name" type="text" className="form-control" placeholder="Name"
            onChange={(e) => setValue(setDisplayName, e)} value={displayName} />
        </div>
        <div className="mb-3">
          <input id="marketing-url" type="url" className="form-control" placeholder="URL"
            onChange={(e) => setValue(setUrl, e)} value={url} />
        </div>
        <div className="mb-3">
          <textarea id="marketing-description" className="form-control" placeholder="Description"
            onChange={(e) => setValue(setDescription, e)} value={description} />
        </div>
        <div className="mb-3">
          <label htmlFor="marketing-type" className="form-label">Type</label>
          <select id="marketing-type" type="text" className="form-select"
            onChange={(e) => setValue(setType, e)} value={type}>
            {renderOptions(['Social Media', 'Link'])}
          </select>
        </div>
        <button type="button" className="btn btn-success" onClick={() => { saveMarketing(props.firebase.db, { displayName, description, url, type }) }}>Save</button>
      </div>
    </div>
  )
}

export default Marketing;