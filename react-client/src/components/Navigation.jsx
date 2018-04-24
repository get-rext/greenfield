import React from 'react';
import UserModal from './UserModal.jsx';
import { Link } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Modal,
  Button,
} from 'reactstrap';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: '',
      dropdownOpen: false,
      modal: false,
      modalSelected: '',
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleSignupModal = this.toggleSignupModal.bind(this);
    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.onDropdownChange = this.onDropdownChange.bind(this);
  }

  toggleDropdown() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  toggleSignupModal() {
    this.setState({ modalSelected: 'Sign Up' }, this.toggleModal);
  }

  toggleLoginModal() {
    this.setState({ modalSelected: 'Login' }, this.toggleModal);
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal });
  }

  onDropdownChange(event) {
    const category = event.target.value;
    new Promise((resolve, reject) => {
      resolve(this.props.changeCategory(category));
    })
      .then(() => {
        console.log('Change category fired.');
      })
      .catch(err => console.log(err));
    new Promise((resolve, reject) => {
      resolve(this.props.refreshUpvotes({ categoryId: category }));
    })
      .then(() => {
        console.log('Refreshed upvotes.');
      })
      .catch(err => console.log(err));
  }

  render() {
    const modalDisplay = (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <UserModal
            toggleModal={this.toggleModal}
            addCurrentUser={this.props.addCurrentUser}
            logInUser={this.props.logInUser}
            modalClicked={this.state.modalSelected}
            currentUser={this.props.currentUser}
          />
        </Modal>
      </div>
    );

    const logInLogOutNav =
      this.props.currentUser !== '' ? (
        <li className="nav-item clickable">
          <a className="nav-link" onClick={this.props.logOutUser}>
            Logout
          </a>
        </li>
      ) : (
        <li className="nav-item clickable">
          <a className="nav-link" onClick={this.toggleLoginModal}>
            Login
          </a>
        </li>
      );

    return (
      <nav className="navbar navbar-expand-md bg-info">
        <div className="container">
          <div className="navbar-translate">
            <a className="navbar-brand" href="/">
              Home
            </a>
            <button
              className="navbar-toggler navbar-toggler-right"
              type="button"
              data-toggle="collapse"
              data-target="#navigation"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <div className="collapse navbar-collapse justify-content-end" id="navigation">
            <ul className="navbar-nav">
              <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle nav caret>
                  Categories
                </DropdownToggle>
                <DropdownMenu>
                  {this.props &&
                    this.props.categories &&
                    this.props.categories.map(category => (
                      <Link
                        className="text-primary"
                        to={{
                          pathname: `/${category.name}/courses/`,
                          state: { category },
                        }}
                        key={category.name}
                      >
                        <DropdownItem className="clickable" value={category._id} onClick={this.onDropdownChange}>
                          {category.name}
                        </DropdownItem>
                      </Link>
                    ))}
                </DropdownMenu>
              </Dropdown>
              {logInLogOutNav}
            </ul>
          </div>
        </div>
        {modalDisplay}
      </nav>
    );
  }
}

export default Navigation;
