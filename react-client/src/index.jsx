import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Navigation from './components/Navigation.jsx';
import CategoryView from './components/CategoryView.jsx';
import CourseDetailView from './components/CourseDetailView.jsx';
import LoginModal from './components/LoginModal.jsx';
import SignupModal from './components/SignupModal.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signupModalTriggered: false,
      loginModalTriggered: false,
      currentUser: {},
      categories: [
        {
          _id: 1,
          name: 'React',
          courses: [
            {
              _id: 1,
              name: 'Reactify',
              upvotes: 100,
              description: {
                createdOn: '01.01.2001',
                instructor: 'Nick Fray',
                price: 8,
                videoUrl: 'http://via.placeholder.com/350x150',
                text: 'party',
              },
              courseUrl: 'http://www.awesomedogpics.com',
            },
          ],
        },
      ],
      users: [
        {
          _id: 1,
          name: 'johncrogers',
          password: '1234',
          coursesUpvoted: [],
        },
      ],
    };

    this.handleSignupClick = this.handleSignupClick.bind(this);
    this.addCurrentUser = this.addCurrentUser.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.logUserIn = this.logUserIn.bind(this);
  }

  componentDidMount() {
    axios
      .get('/api/categories')
      .then(res =>
        this.setState({
          categories: res,
        }))
      .catch(err => console.log(err));
  }

  handleLoginClick() {
    this.setState({ loginModalTriggered: true });
  }

  handleSignupClick() {
    this.setState({ signupModalTriggered: true });
  }

  addCurrentUser(user) {
    this.setState({ currentUser: user });
    axios
      .post('/api/users', user)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  logUserIn(user) {}

  render() {
    if (this.state.signupModalTriggered) {
      return (
        <div>
          <Navigation
            handleSignupClick={this.handleSignupClick}
            categories={this.state.categories}
          />
          <SignupModal addCurrentUser={this.addCurrentUser} />
        </div>
      );
    } else if (this.state.loginModalTriggered) {
      return (
        <div>
          <Navigation
            handleSignupClick={this.handleSignupClick}
            categories={this.state.categories}
          />
          <LoginModal logUserIn={this.logUserIn} />
        </div>
      );
    }

    return (
      <div>
        <Navigation handleSignupClick={this.handleSignupClick} categories={this.state.categories} />
        <CategoryView categories={this.state.categories} />
        <CourseDetailView course={this.state.categories[0].courses[0]} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
