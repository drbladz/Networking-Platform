import { connect } from "react-redux";
import { createUserByEmail } from "../actions";
import { useState } from "react";
const SignUpForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={()=>props.SignUp(email, password)}>Sign Up</button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  }
}

const mapDispatchToProps = (dispatch) => ({
  SignUp: (email, password) => dispatch(createUserByEmail(email, password))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm)