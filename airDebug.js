//Copyright©2012, 2013. Airspring Software LLC (“airSpring”). All Rights Reserved.

/*
	Usage:
	var mydebug = require(logger.debugPath)('airspring:some:pattern');

*/

var debug = require('debug');

module.exports = function( pattern ){

	var _airDebug = debug(pattern);
	var airDebug = null;

	// In the case of tests logger may not exist, or may be a different
	// logger object from the testing framework. Just use default behavior
	// if we don't have an airspring logger.
	if ( typeof logger !== 'undefined' && logger.airspringDebug ) {
		airDebug = function(){
			logger.debug(_airDebug, arguments);
		};
	}
	else{
		airDebug = _airDebug;
	}

	return airDebug;
};
