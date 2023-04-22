import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login.js";
import { useEffect } from "react";
import { getUserAuth } from "./actions";
import { connect } from "react-redux";
import JobPostingPage from "./components/JobPostingPage";
import Network from "./components/Network";
import GroupNetwork from "./components/GroupNetwork";
import JobApplications from "./components/JobApplications";
import UserProfile from "./components/UserProfile";
import SearchingPreferences from "./components/SearchingPreferences";
import GroupPage from "./components/GroupPage";
import Messages from "./components/Messages";
import Notifications from "./components/Notifications";
import CreatePageForm from "./components/CreatePageForm";
import Pages from "./components/Pages";
import PageDetails from "./components/PageDetails";

function App(props) {
  useEffect(() => {
    props.getUserAuth();
  }, []);

  return (
    <div className="App">
      <Router>
        {props.user && <Header />}
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/network">
            <Network />
          </Route>
          <Route path="/groupNetwork">
            <GroupNetwork />
          </Route>
          <Route path="/messages">
            <Messages />
          </Route>
          <Route path="/notifications">
            <Notifications />
          </Route>
          <Route path="/user/:id" component={UserProfile} />
          <Route path="/job-posting/:id" component={JobPostingPage} />
          <Route
            path="/job-applications/job/:jobId"
            component={JobApplications}
          />
          <Route path="/job-preferences" component={SearchingPreferences} />
          <Route path="/groups/:groupId" component={GroupPage} />
          <Route path="/create-page" component={CreatePageForm} />
          <Route path="/pages" component={Pages} />
          <Route path="/page/:id" component={PageDetails} />
        </Switch>
      </Router>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.userState.user,
    jobPostings: state.jobPostingsState.jobPostings,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
