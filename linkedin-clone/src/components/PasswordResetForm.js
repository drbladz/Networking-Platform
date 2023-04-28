import React, { useState } from 'react'
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const PasswordResetForm = () => {

const [email, setEmail] = useState(''); 

const handleResetPassword = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent successfully
        alert("Password reset email sent successfully!")
      })
      .catch((error) => {
        // Handle error
        alert(error.message)
      });
  };

return (
  <div>
    <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <button className="apply-btn" onClick={() => handleResetPassword(email)}>Reset Password</button>
  </div>
);
}

export default PasswordResetForm;


