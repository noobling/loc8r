var mongoose = require('mongoose'); // get access to mongoDB connection
var Loc = mongoose.model('Location');

var sendJSONResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.reviewsReadOne = function(req, res) {
  Loc
    .findById(req.params.locationid)
    .select('name reviews')
    .exec(
        function(err, location) {
          var response, review;
          if (!location) {
            sendJSONResponse(res, 404, {
              "message" : "locationd id not found"
            });
            return;
          } else if (err) {
            sendJSONResponse(res, 400, err);
            return;
          }

          if (location.reviews && location.reviews.length >0) {
            review = location.reviews.id(req.params.reviewid);
            if (!review) {
              sendJSONResponse(res, 404, {
                "message" : "review id not found"
              });
              return;
            }
            sendJSONResponse(res, 200, {
              location : {
                name : location.name,
                id : location.id
              },
              review: review
            });

          }
          else {
            sendJSONResponse(res, 404, {
              "message" : "location has no reviews"
            });
            return;
          }
        }
    );
};

module.exports.reviewsCreate = function(req, res) {
  var locationid = req.params.locationid;
  if (!locationid) {
    sendJSONResponse(res, 404, {
      "message": "No location id"
    })
  } else {
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(
        function(err, location) {
          if (err) {
            sendJSONResponse(res, 400, err)
          } else if(!location) { 
            sendJSONResponse(res, 404, {
              "message": "location id not found"
            });
          } else {
            addReview(location, res, req);
          }
        }
      )
  }
};

module.exports.reviewsUpdateOne = function(req, res) {
  Loc
  .findById(req.params.locationid)
  .select('reviews')
  .exec(
    function(err, location) {
      var response, review;
      if (!location) {
        sendJSONResponse(res, 404, {
          "message" : "locationd id not found"
        });
      } else if (err) {
        sendJSONResponse(res, 400, err);
      } else if (location.reviews && location.reviews.length > 0){  
        review = location.reviews.id(req.params.reviewid);
        if (!review) {
          sendJSONResponse(res, 404, {
            "message" : "review id not found"
          });
        } else {
          review.authorName = req.body.authorName;
          review.rating = req.body.rating;
          review.userText = req.body.userText;
          updateAverageRating(location);

          location.save(function(err, location) {
            if (err) {
              sendJSONResponse(res, 400, err);
            } else {
              sendJSONResponse(res, 200, review);
            }
          })
          
        }
      } else {
        sendJSONResponse(res, 404, {
          "message" : "location has no reviews"
        });
      }          
    }
  );
}

module.exports.reviewsDeleteOne = function(req, res) {
  if (req.params.locationid && req.params.reviewid) {
    Loc
      .findById(locationid)
      .select('reviews')
      .exec(function(err, location) {
        if (loaction.reviews && location.reviews.length > 0) {
          var review = location.reviews.id(req.params.reviewid);
          review.remove();
          location.save(function(err, location) {
            if (err) {
              sendJSONResponse(res, 400, err);
            } else {
              sendJSONResponse(res, 204, null);
            }
          })
        } else {
          sendJSONResponse(res, 404, {"message": "Location has no reviews"})
        }
      });
  } else {
    sendJSONResponse(res, 404, {"message": "No location and/or review id given"});
  }
}

var addReview = function(location, res, req) {
  if (!location) {
    sendJSONResponse(res, 404, {
      "message": "No location found"
    });
  } else {
    console.log(req.body);
    location.reviews.push({
      authorName: req.body.authorName,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });
    location.save(function(err, location) {
      if (err) {
        sendJSONResponse(res, 400, err);
      } else {
        updateAverageRating(location);
        sendJSONResponse(res, 201, location.reviews[location.reviews.length-1]);
      }
    })
  }
};

var updateAverageRating = function(location) {
  var totalRating = 0;
  var avgRating;
  location.reviews.forEach(function(review) {
    totalRating += review.rating;
  });
  avgRating = parseInt(totalRating/location.reviews.length, 10);
  location.rating = avgRating;
  location.save(function(err) {
    if (err) {
      console.log('updateAverageRating: ' + err);
    } else {
      console.log('updateAverageRating: rating updated to ' + avgRating);
    }
  })
}