import React from 'react';
import axios from 'axios';

class Upvote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canClick: true,
      categoryId: this.props.categoryId,
      courseId: this.props.courseId,
      isClicked: false,
      displayLoginWarning: false,
    };
  }
  componentDidMount() {}

  handleUpvoteClick() {
    // Is the user logged in? Username only fills when user is logged in.
    if (this.props.username !== '') {
      this.setState({ displayLoginWarning: false });
      // Can the button be clicked? Used to prevent spamming.
      if (this.state.canClick) {
        // Disallow clicking until the upvote request has completed.
        this.setState({ canClick: false }, () => {
          // Request that the upvote is toggled.
          new Promise((resolve, reject) => {
            resolve(axios
              .patch('/api/upvote', {
                categoryId: this.props.categoryId,
                courseId: this.props.courseId,
                userId: this.props.username,
              })
              .then((response) => {
                // Once the upvote request has ben fullfilled, allow clicking.

                //Use this in setstate to take prev state and toggle isClicked
                const updateState = (prevState) => {
                  return {
                    isClicked: !prevState.isClicked,
                    canClick: true,
                  };
                };
                this.setState(updateState, () => {
                  // Then refresh the upvote data in app level state. refreshUpvotes has been bound to app level.
                  this.props.refreshUpvotes({ categoryId: this.props.categoryId });
                });
              })
              .catch((err) => {
                console.log(err);
              }));
          })
            .then((data) => {})
            .catch((err) => {});
        });
        // User is spamming the upvote button faster than the request can be processed.
      } else console.log('Can not click yet.');
      //User is not logged in, display warning
    } else {
      this.setState({ displayLoginWarning: true });
    }
    console.groupEnd();
  }

  render() {
    const { isClicked, displayLoginWarning } = this.state;
    const buttonClasses = isClicked ? 'btn btn-success' : 'btn btn-muted';
    return (
      <div>
        <button
          type="button"
          className={buttonClasses}
          onClick={() => {
            this.handleUpvoteClick();
          }}
        >
          <i className="fas fa-chevron-up" />
        </button>
        <span className="card-text text-light ml-2">
          Upvote Count:{this.props.upvotes[this.props.courseId] || 0}
        </span>
        {
          displayLoginWarning &&
          <span className="text-warning space-span-left">
            Please log in to vote!
          </span>
        }
      </div>
    );
  }
}

export default Upvote;
