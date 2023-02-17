import { connect } from "react-redux";
import { createUser } from "../actions";
import { useState } from "react";
const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form onSubmit={createUser(email, password)}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => ({
  SignUp: (email, password) => dispatch(createUser(email, password))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm)