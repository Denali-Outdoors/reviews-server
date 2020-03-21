/* eslint-disable no-useless-constructor */
import React from 'react';
import $ from 'jquery';
import Pagination from './Pagination.jsx';
import ReviewList from './ReviewList.jsx';
import ListHeader from './ListHeader.jsx';
import '../styles/styles.scss';

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sort: '',
      currentPage: 1,
    };
    this.searchReviews = this.searchReviews.bind(this);
    this.sortHandler = this.sortHandler.bind(this);
    this.selectNextPage = this.selectNextPage.bind(this);
    this.selectPreviousPage = this.selectPreviousPage.bind(this);
  }

  componentDidMount() {
    this.getTotalReviews();
    this.getReviews();
  }

  getReviews() {
    $.get('http://localhost:5000/restaurants/100?sort_by=date_desc', (results) => {
      this.setState({
        data: results,
      });
    });
  }

  getTotalReviews() {
    $.get('http://localhost:5000/reviews/100', (results) => {
      const total = Number(results);
      this.setState({
        totalReviews: total,
      });
    });
  }

  selectNextPage() {
    let nextPage = this.state.currentPage;
    nextPage += 1;
    // if (nextPage <= Math.ceil(this.state.totalReviews/20))
    this.setState({
      currentPage: nextPage,
    });
  }

  selectPreviousPage() {
    let previousPage = this.state.currentPage;
    previousPage -= 1;
    this.setState({
      currentPage: previousPage,
    });
  }

  searchReviews(value) {
    $.get(`http://localhost:5000/restaurants/100?sort_by=date_desc&q=${value}`, (results) => {
      this.setState({
        data: results,
      });
    });
  }

  sortHandler(value) {
    let sortQuery;
    if (value === '') {
      console.log('nothing');
    } else if (value === 'Highest Rated') {
      sortQuery = 'sort_by=rating_desc';
      $.get(`http://localhost:5000/restaurants/100?${sortQuery}`, (results) => {
        this.setState({
          data: results,
        });
      });
    } else if (value === 'Lowest Rated') {
      sortQuery = 'sort_by=rating_asc';
      $.get(`http://localhost:5000/restaurants/100?${sortQuery}`, (results) => {
        this.setState({
          data: results,
        });
      });
    } else if (value === 'Newest First') {
      this.getReviews();
    } else if (value === 'Oldest First') {
      sortQuery = 'sort_by=date_asc';
      $.get(`http://localhost:5000/restaurants/100?${sortQuery}`, (results) => {
        this.setState({
          data: results,
        });
      });
    }
  }

  render() {
    return (
      <div>
        <ListHeader sortHandler={this.sortHandler} searchHandle={this.searchReviews} />
        <ReviewList data={this.state.data} />
        <Pagination previous={this.selectPreviousPage} totalReviews={this.state.totalReviews} next={this.selectNextPage} info={this.state} />
      </div>
    );
  }
}

export default App;
