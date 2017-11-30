var mongoose = require('mongoose'); // get access to mongoDB connection
var Loc = mongoose.model('Location');
var sendJSONResponse;
var buildLocations;

var theEarth = (function() {
  var earthRadius = 6371; // in km

  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  }

  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  }

  return {
    getDistanceFromRads : getDistanceFromRads,
    getRadsFromDistance : getRadsFromDistance
  }
})();

module.exports.locationsListByDistance = function(req, res) {
  var lat = parseFloat(req.query.lat);
  var lng = parseFloat(req.query.lng);;
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  }
  var geoOptions = {
    spherical: true,
  }

  if(!lat || !lng) {
    console.log('locationsListByDistance missing params');
    sendJSONResponse(res, 404, {
      "message" : "missing lat and/or lng parameter"
    });
    return;
  }
  Loc.geoNear(point, geoOptions, function(err, result, stats) {
    var locations;

    if (err) {
      sendJSONResponse(res, 400, err);
      return;
    } else if (!res) {
      sendJSONResponse(res, 404, {
        "message": "No results found"
      });
      return;
    }

    /** Successfully found data */
    sendJSONResponse(res, 200, buildLocations(result));
  });

};

buildLocations = function(res) {
  var locations = [];

  res.forEach(function(doc) {
    locations.push({
      distance: theEarth.getDistanceFromRads(doc.dis),
      name: doc.obj.name,
      address: doc.obj.addresss,
      rating: doc.obj.rating,
      facilities: doc.obj.facilities,
      _id: doc.obj.id
    });
  });

  return locations;
}

module.exports.locationsCreate = function(req, res) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(','),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1
    }, {
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1
    }]
  }, function(err, location) {
    if (err) {
      sendJSONResponse(res, 400, err);
    } else {
      sendJSONResponse(res, 201, location);
    }
  });

};

module.exports.locationsReadOne = function(req, res) {
  Loc
    .findById(req.params.locationid)
    .exec(function(err, location) {
      if (!location) {
        sendJSONResponse(res, 404, {
          "message": "location id not found"
        });
        return;
      } else if (err) {
        sendJSONResponse(res, 400, err);
        return;
      }

      /** Successfully found data */
      sendJSONResponse(res, 200, location);
    });
};

module.exports.locationsUpdateOne = function(req, res) {
  var locationid = req.params.locationid;

  if (!locationid) {
    sendJSONResponse(res, 404, {
      "message" : "No location id given"
    });
  } else {
    Loc
      .findById(locationid)
      .select('-reviews -rating')
      .exec(function(esserr, location) {
        if (!location) {
          sendJSONResponse(res, 404, {
            "message": "Could not find location id"
          });
        } else if(err) {
          sendJSONResponse(res, 400, err);
        } else {
          /** A better approach to this function */
          // var lat, lng;
          // var openingTimes = [];
          // for (var key in req.body) {
          //   if (req.body.hasOwnProperty(key)) {
          //     if (key === 'facilities') {
          //       location.key = req.body.key.split(',');
          //     } else if (key === lng) {
          //       lng = req.body.key;
          //     } else if (key == lat) {
          //       lat = req.body.lat;
          //     } else if (key === 'day1') {
                
          //     } else {
          //       location.key = req.body.key;
          //     }
          //   }
          // }
          // if (lat && lng) {
          //   location.coords = [parseFloat(lng), parseFloat(lat)];
          // }
          location.name = req.body.name,
          location.address = req.body.address,
          location.facilities = req.body.facilities.split(','),
          location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)],
          location.openingTimes = [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1
          }, {
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1
          }]

          /**
           * Updated the location instance time to
           * save it to the database
           */
          location.save(function(err, location) {
            if (err) {
              sendJSONResponse(res, 400, err);
            } else {
              sendJSONResponse(res, 201, location);
            }
          })
        }
      });
  }
}

module.exports.locationsDeleteOne = function(req, res) {
  if (req.params.locationid) {
    Loc
    .findByIdAndRemove(req.params.locationid)
    .exec(function(err, location) {
      if (err) {
        sendJSONResponse(res, 400, err);
      } else {
        sendJSONResponse(res, 201, null);
      }
    })
  } else {
    sendJSONResponse(res, 404, {
      "message": "No locaiton id"
    });
  }
}

sendJSONResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}