// import mysql
const mysql = require('mysql');
// import config for connection
const mysqlConfig = require('./config.js');
// create connection
const connection = mysql.createConnection(mysqlConfig);

connection.connect((err) => {
  if (err) {
    console.log('FAILED TO CONNECT TO DB');
  } else {
    console.log('CONNECTED TO DB');
  }
});

// SELECT * FROM reviews INNER JOIN users ON (reviews.id_User = users.user_id)
// WHERE (id_Restaurants = ${businessId});

// order reviews by highest rating
// SELECT rating FROM reviews INNER JOIN users ON (reviews.id_User = users.user_id)
// WHERE (id_Restaurants = 44) ORDER BY reviews.rating DESC;

// order reviews by most recent

// `SELECT date FROM reviews INNER JOIN users ON (reviews.id_User = users.user_id) 
// WHERE (id_Restaurants = 44) ORDER BY reviews.date DESC;`

// SEARCH TEXT for latin words
// SELECT body FROM reviews WHERE body LIKE '%maxime eum%';

// SEARCH TEXT for 'nihil' and order reviews by descending rating
// SELECT rating FROM reviews INNER JOIN users ON (reviews.id_User = users.user_id) WHERE
// (id_Restaurants = 44 AND body LIKE '%nihil%') ORDER BY reviews.rating DESC;

// SEARCH TEXT for 'nihil' and order reviews by descending date
// SELECT rating FROM reviews INNER JOIN users ON (reviews.id_User = users.user_id) 
// WHERE (id_Restaurants = 44 AND body LIKE '%nihil%') ORDER BY reviews.date DESC;


function getReviews(businessId, start = null, sort = null, search = null, callback) {
  let sortBy = '';
  console.log()
  if (sort !== null) {
    if (sort === 'rating_desc') {
      sortBy = 'ORDER BY reviews.rating DESC';
    } else if (sort === 'rating_asc') {
      sortBy = 'ORDER BY reviews.rating ASC';
    } else if (sort === 'date_asc') {
      sortBy = 'ORDER BY reviews.date ASC';
    } else if (sort === 'date_desc') {
      sortBy = 'ORDER BY reviews.date DESC';
    }
  } else {
    sortBy = '';
  }
  let searchQuery = '';

  if (search !== null) {
    searchQuery = ` AND body LIKE '%${search}%'`;
  } else {
    searchQuery = '';
  }
  let startQuery;
  if (!isNaN(start)) {
    startQuery = `LIMIT ${start}, 20`;
  } else {
    startQuery = 'LIMIT 20';
  }
//   console.log('search', searchQuery)
//   console.log('start', startQuery)
//   console.log('sort', sort)
//   const queryString = `SELECT * FROM reviews INNER JOIN users ON (reviews.id_User = users.user_id) WHERE (id_Restaurants = ${businessId}${searchQuery});`;

  const queryString = `SELECT * FROM reviews INNER JOIN users ON (reviews.id_User = users.user_id) WHERE id_Restaurants = ${businessId}${searchQuery} ${sortBy} ${startQuery}`;
  // let qString =  `SELECT date FROM reviews INNER JOIN users ON (reviews.id_User = users.user_id)
  // WHERE (id_Restaurants = 44) ORDER BY reviews.date DESC;`
  connection.query(queryString, callback, (err, results) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
}


// define functions to extract and update data

// const getReviewsByRestId = function (restaurauntId, callback)

function updateReviewVote(reviewInfo, callback) {
  console.log(reviewInfo, 'db');
  let queryString;
  if (reviewInfo.voted === 'true') {
    queryString = `UPDATE reviews SET ${reviewInfo.voteType} = ${reviewInfo.voteType}+1 WHERE review_id=${reviewInfo.id}`;
  } else {
    queryString = `UPDATE reviews SET ${reviewInfo.voteType} = ${reviewInfo.voteType}-1 WHERE review_id=${reviewInfo.id}`;
  }
  connection.query(queryString, (err) => {
    if (err) {
      console.log(err);
    } else {
      const updatedInfoQuery = `SELECT * FROM reviews WHERE review_id = ${reviewInfo.id}`;
      connection.query(updatedInfoQuery, (error, result) => {
        if (error) {
          console.log(err, 'second callback');
        } else {
          callback(null, result);
        }
      });
    //   callback(null, results);
    }
  });
}


// module.exports {
// getReviews = getReviewsByRestId,
// updateVote = updateVoteByReviewId
// }

module.exports.connection = connection;
module.exports.getReviews = getReviews;
module.exports.updateReviewVote = updateReviewVote;
