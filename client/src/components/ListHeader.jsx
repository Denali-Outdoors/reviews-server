import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Sort from './Sort.jsx';
import '../styles/ListHeader.styles.scss';

class ListHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      searched: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  handleSubmit(event) {
    if (this.state.value === '') {
      this.setState({
        searched: false
      });
    } else {
      this.setState({
        searched: true,
        query: this.state.value
      });
      this.props.searchHandle(this.state.value);
    }
    event.preventDefault();
  }

  render() {
    if (this.state.searched === false) {
      return (
        <div>
          <h3>Recommended Reviews</h3>
          <input type="text" className="searchBar" placeholder="Search Within Reviews" value={this.state.value} onChange={this.handleChange} />
          <button type="submit" className="searchBtn" onClick={this.handleSubmit}>
            <FontAwesomeIcon icon={faSearch} className="searchIcon" size="lg" />
          </button>
          <Sort sortHandler={this.props.sortHandler} />
          {/* <div>{this.props.totalReviews} reviews mentioning "{this.state.value}"</div> */}
        </div>
      );
    }
    return (
      <div>
        <h3>Recommended Reviews</h3>
        <input type="text" className="searchBar" placeholder="Search Within Reviews" value={this.state.value} onChange={this.handleChange} />
        <button type="submit" className="searchBtn" onClick={this.handleSubmit}>
          <FontAwesomeIcon icon={faSearch} className="searchIcon" size="lg" />
        </button>
        <Sort sortHandler={this.props.sortHandler} />
        <div>
          <span>{this.props.totalReviews} reviews mentioning "{this.state.query}"  </span>
          <button className="clearResults">  Clear Results  <button className="closebox"><strong>x</strong></button></button>
        </div>
      </div>
    );
  }
}

export default ListHeader;
