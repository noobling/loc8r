/* GET home page */
module.exports.homelist = function(req, res) {
    res.render('location-list', {title: 'Home'}); // make HTML template
}

/* GET locations info */
module.exports.locationInfo = function(req, res) {
    res.render('location-info', {title: 'Location Info'});
}

/* GET review page */
module.exports.addReview = function(req, res) {
    res.render('location-review', {title: 'Add Review'});
}