import { connect } from "react-redux";
import { createUserByEmail } from "../actions";
import { useState } from "react";
const SignUpForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("")

  return (
    <div className="form">
      <input type="email" required={true} placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
      <input type="text" required={true} placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} />
      <input type="password" required={true} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="apply-btn" onClick={()=>props.SignUp(email, password, fullName)}>Sign Up</button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
  }
}

const mapDispatchToProps = (dispatch) => ({
  SignUp: (email, password, fullName) => dispatch(createUserByEmail(email, password, fullName))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm)