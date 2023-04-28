import { connect } from "react-redux";
import { loginWithEmail } from "../actions";
import { useState } from "react";
import PasswordResetForm from "./PasswordResetForm";
const LoginForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  return (
    <div className="form">
      <input type="email" required={true} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" required={true} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <a onClick={() => setResetPassword(!resetPassword)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>Forgot Password?</a><br />
      {resetPassword && <PasswordResetForm />}
      <button className="apply-btn" type="submit" onClick={()=>props.login(email, password)}>Login</button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (email, password) => dispatch(loginWithEmail(email, password))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)