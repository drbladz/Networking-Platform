import { connect } from "react-redux";
import { loginWithEmail } from "../actions";
import { useState } from "react";
const LoginForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" onClick={()=>props.login(email, password)}>Login</button>
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