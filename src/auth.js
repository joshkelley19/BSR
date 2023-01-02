import React, { useState } from 'react'
import { setValue } from './services/form-service';
import { login } from './services/firebase-service';

const Auth = ({ setErrorMessage }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="container">
      <div className="mb-3">
        <label htmlFor="user" className="form-label">Email</label>
        <input id="user" className="form-control" maxLength="120"
          onChange={(e) => setValue(setUserName, e)} value={userName} />
      </div>
      <div className="mb-3">
        <label htmlFor="pass" className="form-label">Password</label>
        <input id="pass" className="form-control" maxLength="120" type="password"
          onChange={(e) => setValue(setPassword, e)} value={password} />
      </div>
      <button type="button" className="btn btn-primary my-2" onClick={() => { login(userName, password, setErrorMessage) }}>Sign In</button>
    </div>
  )
}

export default Auth;