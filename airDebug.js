//Copyright©2012, 2013. Airspring Software LLC (“airSpring”). All Rights Reserved.

/*
	Usage:
		DEBUG=airspring:some:pattern node airspring.js
			and/or
		Enable debugging from client side server-stats panel

		var mydebug = require('airspring-debug')('airspring:some:pattern');

	Functionality provided by this wrapper:
	- makes debug module configurable at run time
	- sends logging through airLogger so it can be processed however we want
	  * airLogger enables all by default, then we control what actually gets logged
	    here in this wrapper
*/


module.exports = function( pattern, logger ){

	// allow a logger to be passed in for testing purposes
	var airLogger  = (logger) ? logger : global.airLogger;

	var debug = require('debug'),
			_ = require('underscore');

	var _airDebug = debug(pattern);
	var airDebug = null;

	if ( typeof airLogger !== 'undefined') {
		// we should never get the function disabled(){} from the debug module,
		// because process.env.DEBUG is set in airLogger... register each function
		// with the airLogger so it can be enabled/disabled at runtime.
		var currentlyEnabled = false;

		_.each(_.without(airLogger.get('DEBUG').split(','),""), function(requestedDebugPattern){
			var re = new RegExp('^' + requestedDebugPattern.replace("*", ".*") + '$', 'i');
			if (re.test(pattern)) currentlyEnabled = true;
		});

		_airDebug.currentlyEnabled = currentlyEnabled;
		_airDebug.pattern = pattern;
		airLogger.registerDebug(_airDebug);

		airDebug = function(){
			airLogger.debug(_airDebug, arguments);
		};
	}
	else{
		airDebug = _airDebug;
	}

	return airDebug;
};

