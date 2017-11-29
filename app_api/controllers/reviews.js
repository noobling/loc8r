var mongoose = require('mongoose'); // get access to mongoDB connection
var Loc = mongoose.model('Location');

var sendJSONResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}

module.exports.createReview = function(req, res) {

};

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

var addReview = function(location, res, req) {
  if (!location) {
    sendJSONResponse(res, 404, {
      "message": "No location found"
    });
  } else {
    location.reviews.push({
      authorName: req.body.authorName,
      rating: req.body.rating,
      userText: req.body.userText
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