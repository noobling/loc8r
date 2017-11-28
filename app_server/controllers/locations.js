/* GET home page */
module.exports.homelist = function(req, res) {
	res.render('location-list', {
		title: 'Home',
		pageHeader: {
			title: 'Loc8r',
			tagline: 'Find places to work with wifi near you!'
		},
		locations: [{
			name: 'Starbucks',
			address: '125 high sreet, Reading, RG164',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'premium wifi'],
			distance: '250m'
		},{
			name: 'Coffee Club',
			address: '125 high sreet, Reading, RG164',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'premium wifi'],
			distance: '250m'
		},{
			name: 'Jamaca Blue',
			address: '125 high sreet, Reading, RG164',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'premium wifi'],
			distance: '250m'
		}]
	});
}

/* GET locations info */
module.exports.locationInfo = function(req, res) {
    res.render('location-info', {
			title: 'Location Info',
			pageHeader: {
				title: 'Starbucks'
			},
			info: {
				address: '125 high street, reading, RNG 153',
				rating: 3,
				facilities: ['Hot drinks', 'Food', 'premium wifi'],
				distance: '250m'
			},
			openingTimes: {
				title: 'Opening Hours',
				times: {
					weekdays: '7:00am - 9:00pm',
					saturday: '8:00am - 5:00pm',
					sunday: 'closed'
				}
			},
			facilities: ['Hot drinks', 'Food', 'premium wifi'],
			map: {
				title: 'Location Map',
				url: 'https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.702147,-74.015794'
			},
			reviews: [{
				author: 'David Yu',
				timeStamp: '16 August 2018',
				userText: ''
			}, {
				author: 'Jayden Smith',
				timeStamp: '20 August 2020',
				userText: 'It was a brilliant coffee shop'
			}],
			aboutLocation: 'Great cafe space to sit down and do stuff',
			suggestion: 'If you have been there please leave a review'	
		});
}

/* GET review page */
module.exports.addReview = function(req, res) {
    res.render('location-review', {
			title: 'Add Review',
			pageHeader: {
				title: 'Review Starbucks'
			}
		});
}