import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login.js";
import { useEffect } from "react";
import { getUserAuth } from "./actions";
import { connect } from "react-redux";
import JobPostingPage from './components/JobPostingPage';
import JobApplications from "./components/JobApplications";

function App(props) {

  useEffect(() => {
    props.getUserAuth();
  }, [])
  
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/home">
            <Header />
            <Home />
          </Route>
          <Route path="/job-posting/:id" component={JobPostingPage} />
          <Route path="/job-applications/job/:jobId" component={JobApplications} />
        </Switch>
      </Router>
    </div>
  );
}

const mapStateToProps = (state) =>{
  return {
    user: state.userState.user,
    jobPostings: state.jobPostingsState.jobPostings
  }
}

const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
