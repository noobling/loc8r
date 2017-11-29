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

sendJSONResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
}