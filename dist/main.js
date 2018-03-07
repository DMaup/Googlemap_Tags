(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Marker = require("./Marker");
class App {
    constructor() {

        this.$form          = document.getElementById("form-maps");
        this.$title         = document.getElementById("title");
        this.$description   = document.getElementById("description");
        this.$latitude      = document.getElementById("latitude");
        this.$longitude     = document.getElementById("longitude");
        this.$structure     = document.getElementById("structure");
        this.$filters        = document.querySelectorAll("input[type='checkbox']");

        this.position = {
            lat: 0,
            lng: 0
        };

        this.map = null;
        this.appMarker = null;
        this.markers = {
                hotel: [],
                restaurant: [],
                bar: []
        };
    }

    initMap(idElement) {
        this.map = new google.maps.Map(document.getElementById(idElement), {
            center: {
                lat: this.position.lat,
                lng: this.position.lng
            },
            zoom: 20
        });
    }

    setPosition(lat, lng) {
        this.position.lat = lat;
        this.position.lng = lng;

        this.centerOnMapPosition();
        this.setAppMarker();
    }

    centerOnMapPosition() {
        this.map.setCenter({
            lat: this.position.lat,
            lng: this.position.lng
        });
    }

    setAppMarker() {
        const infoWindow = new google.maps.InfoWindow({

            content: "<h3> Hello Le Soler ! </h3>"
        });


        this.appMarker = new google.maps.Marker({
            position: this.position,
            map: this.map,
            title: 'Vous êtes ici !'
        });


        this.appMarker.addListener("click", () => {
            infoWindow.open(this.map, this.appMarker);
        });
    }

    addMarker() {
        const position = {
            lat: parseFloat(this.$latitude.value),
            lng: parseFloat(this.$longitude.value)
        };

        const marker = new Marker(
            this.map,
            position,
            this.$title.value,
            this.$description.value,
            this.$form.elements["structure"].value
        );

        let content = "<h3>Etablissement " + this.$title.value + "</h3>";
        content += "<p>" + this.$description.value + "</p>";


        const infowindow = new google.maps.InfoWindow({
            content: content
        });

        this.markers[marker.structure].push(marker);
        this.clearForm();
    }

    clearForm(){
     this.$form.reset();
    }

    filterMarkers(structure, checked){
        const map = checked ? this.map : null;

        for (let marker of this.markers[structure]){
            marker.g_marker.setMap(map);
        }


    }
}
    module.exports = App;
},{"./Marker":2}],2:[function(require,module,exports){
class Marker {
    constructor(map, position, title, description, structure){

        this.structure = structure;

        this.g_marker = null;
        this.g_infowindows = null;

        this.createG_marker(map, position, title);
        this.createG_infowindow(title, description);
        this.linkMarkerWindow(map);


    }

    createG_marker(map, position, title){
        this.g_marker = new google.maps.Marker({
            position: position,
            title: title,
            map: map
        });
    }

    createG_infowindow(title, description){
        let content = "<h3>" + this.structure + " " + title + "</h3>";
            content += "<p>" + description + "</p>";

            this.g_infowindows = new google.maps.InfoWindow({
                content: content
            });


    }

    linkMarkerWindow(map){
        this.g_marker.addListener("click", () =>{
            this.g_infowindows.open(map, this.g_marker);
        });
    }
}

module.exports = Marker;
},{}],3:[function(require,module,exports){
const GoogleMapsLoader = require('google-maps');
    App = require("./class/App");

GoogleMapsLoader.KEY = "AIzaSyAsRZHHg6hDlYmRqEp3j3Pk7oQ2C5fRlXE";
GoogleMapsLoader.load(function () {
    const app = new App();
    app.initMap("map");

    navigator.geolocation.getCurrentPosition(function (position) {

        app.setPosition(
            position.coords.latitude,
            position.coords.longitude
        )

    }, function (error) {
        app.setPosition(
            42.6990297,
            2.8344617
        );

    });

    app.$form.onsubmit = function () {
        event.preventDefault();
        app.addMarker();
    }
    
    app.map.addListener("click", function (event) {
        app.$latitude.value = event.latLng.lat();
        app.$longitude.value = event.latLng.lng();


    });

    for(let $filter of app.$filters){
        $filter.onclick = function () {
            const structure = $filter.value;
            const checked = $filter.checked;

            app.filterMarkers(structure, checked);
        }
    }



});


},{"./class/App":1,"google-maps":4}],4:[function(require,module,exports){
(function(root, factory) {

	if (root === null) {
		throw new Error('Google-maps package can be used only in browser');
	}

	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.GoogleMapsLoader = factory();
	}

})(typeof window !== 'undefined' ? window : null, function() {


	'use strict';


	var googleVersion = '3.18';

	var script = null;

	var google = null;

	var loading = false;

	var callbacks = [];

	var onLoadEvents = [];

	var originalCreateLoaderMethod = null;


	var GoogleMapsLoader = {};


	GoogleMapsLoader.URL = 'https://maps.googleapis.com/maps/api/js';

	GoogleMapsLoader.KEY = null;

	GoogleMapsLoader.LIBRARIES = [];

	GoogleMapsLoader.CLIENT = null;

	GoogleMapsLoader.CHANNEL = null;

	GoogleMapsLoader.LANGUAGE = null;

	GoogleMapsLoader.REGION = null;

	GoogleMapsLoader.VERSION = googleVersion;

	GoogleMapsLoader.WINDOW_CALLBACK_NAME = '__google_maps_api_provider_initializator__';


	GoogleMapsLoader._googleMockApiObject = {};


	GoogleMapsLoader.load = function(fn) {
		if (google === null) {
			if (loading === true) {
				if (fn) {
					callbacks.push(fn);
				}
			} else {
				loading = true;

				window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] = function() {
					ready(fn);
				};

				GoogleMapsLoader.createLoader();
			}
		} else if (fn) {
			fn(google);
		}
	};


	GoogleMapsLoader.createLoader = function() {
		script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = GoogleMapsLoader.createUrl();

		document.body.appendChild(script);
	};


	GoogleMapsLoader.isLoaded = function() {
		return google !== null;
	};


	GoogleMapsLoader.createUrl = function() {
		var url = GoogleMapsLoader.URL;

		url += '?callback=' + GoogleMapsLoader.WINDOW_CALLBACK_NAME;

		if (GoogleMapsLoader.KEY) {
			url += '&key=' + GoogleMapsLoader.KEY;
		}

		if (GoogleMapsLoader.LIBRARIES.length > 0) {
			url += '&libraries=' + GoogleMapsLoader.LIBRARIES.join(',');
		}

		if (GoogleMapsLoader.CLIENT) {
			url += '&client=' + GoogleMapsLoader.CLIENT + '&v=' + GoogleMapsLoader.VERSION;
		}

		if (GoogleMapsLoader.CHANNEL) {
			url += '&channel=' + GoogleMapsLoader.CHANNEL;
		}

		if (GoogleMapsLoader.LANGUAGE) {
			url += '&language=' + GoogleMapsLoader.LANGUAGE;
		}

		if (GoogleMapsLoader.REGION) {
			url += '&region=' + GoogleMapsLoader.REGION;
		}

		return url;
	};


	GoogleMapsLoader.release = function(fn) {
		var release = function() {
			GoogleMapsLoader.KEY = null;
			GoogleMapsLoader.LIBRARIES = [];
			GoogleMapsLoader.CLIENT = null;
			GoogleMapsLoader.CHANNEL = null;
			GoogleMapsLoader.LANGUAGE = null;
			GoogleMapsLoader.REGION = null;
			GoogleMapsLoader.VERSION = googleVersion;

			google = null;
			loading = false;
			callbacks = [];
			onLoadEvents = [];

			if (typeof window.google !== 'undefined') {
				delete window.google;
			}

			if (typeof window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] !== 'undefined') {
				delete window[GoogleMapsLoader.WINDOW_CALLBACK_NAME];
			}

			if (originalCreateLoaderMethod !== null) {
				GoogleMapsLoader.createLoader = originalCreateLoaderMethod;
				originalCreateLoaderMethod = null;
			}

			if (script !== null) {
				script.parentElement.removeChild(script);
				script = null;
			}

			if (fn) {
				fn();
			}
		};

		if (loading) {
			GoogleMapsLoader.load(function() {
				release();
			});
		} else {
			release();
		}
	};


	GoogleMapsLoader.onLoad = function(fn) {
		onLoadEvents.push(fn);
	};


	GoogleMapsLoader.makeMock = function() {
		originalCreateLoaderMethod = GoogleMapsLoader.createLoader;

		GoogleMapsLoader.createLoader = function() {
			window.google = GoogleMapsLoader._googleMockApiObject;
			window[GoogleMapsLoader.WINDOW_CALLBACK_NAME]();
		};
	};


	var ready = function(fn) {
		var i;

		loading = false;

		if (google === null) {
			google = window.google;
		}

		for (i = 0; i < onLoadEvents.length; i++) {
			onLoadEvents[i](google);
		}

		if (fn) {
			fn(google);
		}

		for (i = 0; i < callbacks.length; i++) {
			callbacks[i](google);
		}

		callbacks = [];
	};


	return GoogleMapsLoader;

});

},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkY6XFxERVZfV0VCXFxKU09iamV0XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJGOi9ERVZfV0VCL0pTT2JqZXQvbWFwcy9qcy9jbGFzcy9BcHAuanMiLCJGOi9ERVZfV0VCL0pTT2JqZXQvbWFwcy9qcy9jbGFzcy9NYXJrZXIuanMiLCJGOi9ERVZfV0VCL0pTT2JqZXQvbWFwcy9qcy9tYWluLmpzIiwiRjovREVWX1dFQi9KU09iamV0L25vZGVfbW9kdWxlcy9nb29nbGUtbWFwcy9saWIvR29vZ2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBNYXJrZXIgPSByZXF1aXJlKFwiLi9NYXJrZXJcIik7XHJcbmNsYXNzIEFwcCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy4kZm9ybSAgICAgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybS1tYXBzXCIpO1xyXG4gICAgICAgIHRoaXMuJHRpdGxlICAgICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpdGxlXCIpO1xyXG4gICAgICAgIHRoaXMuJGRlc2NyaXB0aW9uICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlc2NyaXB0aW9uXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhdGl0dWRlICAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhdGl0dWRlXCIpO1xyXG4gICAgICAgIHRoaXMuJGxvbmdpdHVkZSAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvbmdpdHVkZVwiKTtcclxuICAgICAgICB0aGlzLiRzdHJ1Y3R1cmUgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHJ1Y3R1cmVcIik7XHJcbiAgICAgICAgdGhpcy4kZmlsdGVycyAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRbdHlwZT0nY2hlY2tib3gnXVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHtcclxuICAgICAgICAgICAgbGF0OiAwLFxyXG4gICAgICAgICAgICBsbmc6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm1hcCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5hcHBNYXJrZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubWFya2VycyA9IHtcclxuICAgICAgICAgICAgICAgIGhvdGVsOiBbXSxcclxuICAgICAgICAgICAgICAgIHJlc3RhdXJhbnQ6IFtdLFxyXG4gICAgICAgICAgICAgICAgYmFyOiBbXVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdE1hcChpZEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRFbGVtZW50KSwge1xyXG4gICAgICAgICAgICBjZW50ZXI6IHtcclxuICAgICAgICAgICAgICAgIGxhdDogdGhpcy5wb3NpdGlvbi5sYXQsXHJcbiAgICAgICAgICAgICAgICBsbmc6IHRoaXMucG9zaXRpb24ubG5nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHpvb206IDIwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UG9zaXRpb24obGF0LCBsbmcpIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmxhdCA9IGxhdDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmxuZyA9IGxuZztcclxuXHJcbiAgICAgICAgdGhpcy5jZW50ZXJPbk1hcFBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zZXRBcHBNYXJrZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjZW50ZXJPbk1hcFBvc2l0aW9uKCkge1xyXG4gICAgICAgIHRoaXMubWFwLnNldENlbnRlcih7XHJcbiAgICAgICAgICAgIGxhdDogdGhpcy5wb3NpdGlvbi5sYXQsXHJcbiAgICAgICAgICAgIGxuZzogdGhpcy5wb3NpdGlvbi5sbmdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBcHBNYXJrZXIoKSB7XHJcbiAgICAgICAgY29uc3QgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcclxuXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IFwiPGgzPiBIZWxsbyBMZSBTb2xlciAhIDwvaDM+XCJcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuYXBwTWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICBtYXA6IHRoaXMubWFwLFxyXG4gICAgICAgICAgICB0aXRsZTogJ1ZvdXMgw6p0ZXMgaWNpICEnXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmFwcE1hcmtlci5hZGRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKHRoaXMubWFwLCB0aGlzLmFwcE1hcmtlcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTWFya2VyKCkge1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge1xyXG4gICAgICAgICAgICBsYXQ6IHBhcnNlRmxvYXQodGhpcy4kbGF0aXR1ZGUudmFsdWUpLFxyXG4gICAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQodGhpcy4kbG9uZ2l0dWRlLnZhbHVlKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IG5ldyBNYXJrZXIoXHJcbiAgICAgICAgICAgIHRoaXMubWFwLFxyXG4gICAgICAgICAgICBwb3NpdGlvbixcclxuICAgICAgICAgICAgdGhpcy4kdGl0bGUudmFsdWUsXHJcbiAgICAgICAgICAgIHRoaXMuJGRlc2NyaXB0aW9uLnZhbHVlLFxyXG4gICAgICAgICAgICB0aGlzLiRmb3JtLmVsZW1lbnRzW1wic3RydWN0dXJlXCJdLnZhbHVlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSBcIjxoMz5FdGFibGlzc2VtZW50IFwiICsgdGhpcy4kdGl0bGUudmFsdWUgKyBcIjwvaDM+XCI7XHJcbiAgICAgICAgY29udGVudCArPSBcIjxwPlwiICsgdGhpcy4kZGVzY3JpcHRpb24udmFsdWUgKyBcIjwvcD5cIjtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5tYXJrZXJzW21hcmtlci5zdHJ1Y3R1cmVdLnB1c2gobWFya2VyKTtcclxuICAgICAgICB0aGlzLmNsZWFyRm9ybSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyRm9ybSgpe1xyXG4gICAgIHRoaXMuJGZvcm0ucmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJNYXJrZXJzKHN0cnVjdHVyZSwgY2hlY2tlZCl7XHJcbiAgICAgICAgY29uc3QgbWFwID0gY2hlY2tlZCA/IHRoaXMubWFwIDogbnVsbDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgbWFya2VyIG9mIHRoaXMubWFya2Vyc1tzdHJ1Y3R1cmVdKXtcclxuICAgICAgICAgICAgbWFya2VyLmdfbWFya2VyLnNldE1hcChtYXApO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG59XHJcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEFwcDsiLCJjbGFzcyBNYXJrZXIge1xyXG4gICAgY29uc3RydWN0b3IobWFwLCBwb3NpdGlvbiwgdGl0bGUsIGRlc2NyaXB0aW9uLCBzdHJ1Y3R1cmUpe1xyXG5cclxuICAgICAgICB0aGlzLnN0cnVjdHVyZSA9IHN0cnVjdHVyZTtcclxuXHJcbiAgICAgICAgdGhpcy5nX21hcmtlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5nX2luZm93aW5kb3dzID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVHX21hcmtlcihtYXAsIHBvc2l0aW9uLCB0aXRsZSk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVHX2luZm93aW5kb3codGl0bGUsIGRlc2NyaXB0aW9uKTtcclxuICAgICAgICB0aGlzLmxpbmtNYXJrZXJXaW5kb3cobWFwKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUdfbWFya2VyKG1hcCwgcG9zaXRpb24sIHRpdGxlKXtcclxuICAgICAgICB0aGlzLmdfbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcclxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxyXG4gICAgICAgICAgICBtYXA6IG1hcFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUdfaW5mb3dpbmRvdyh0aXRsZSwgZGVzY3JpcHRpb24pe1xyXG4gICAgICAgIGxldCBjb250ZW50ID0gXCI8aDM+XCIgKyB0aGlzLnN0cnVjdHVyZSArIFwiIFwiICsgdGl0bGUgKyBcIjwvaDM+XCI7XHJcbiAgICAgICAgICAgIGNvbnRlbnQgKz0gXCI8cD5cIiArIGRlc2NyaXB0aW9uICsgXCI8L3A+XCI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdfaW5mb3dpbmRvd3MgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBjb250ZW50XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgbGlua01hcmtlcldpbmRvdyhtYXApe1xyXG4gICAgICAgIHRoaXMuZ19tYXJrZXIuYWRkTGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PntcclxuICAgICAgICAgICAgdGhpcy5nX2luZm93aW5kb3dzLm9wZW4obWFwLCB0aGlzLmdfbWFya2VyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYXJrZXI7IiwiY29uc3QgR29vZ2xlTWFwc0xvYWRlciA9IHJlcXVpcmUoJ2dvb2dsZS1tYXBzJyk7XHJcbiAgICBBcHAgPSByZXF1aXJlKFwiLi9jbGFzcy9BcHBcIik7XHJcblxyXG5Hb29nbGVNYXBzTG9hZGVyLktFWSA9IFwiQUl6YVN5QXNSWkhIZzZoRGxZbVJxRXAzajNQazdvUTJDNWZSbFhFXCI7XHJcbkdvb2dsZU1hcHNMb2FkZXIubG9hZChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XHJcbiAgICBhcHAuaW5pdE1hcChcIm1hcFwiKTtcclxuXHJcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xyXG5cclxuICAgICAgICBhcHAuc2V0UG9zaXRpb24oXHJcbiAgICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZVxyXG4gICAgICAgIClcclxuXHJcbiAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICBhcHAuc2V0UG9zaXRpb24oXHJcbiAgICAgICAgICAgIDQyLjY5OTAyOTcsXHJcbiAgICAgICAgICAgIDIuODM0NDYxN1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLiRmb3JtLm9uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgYXBwLmFkZE1hcmtlcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhcHAubWFwLmFkZExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgYXBwLiRsYXRpdHVkZS52YWx1ZSA9IGV2ZW50LmxhdExuZy5sYXQoKTtcclxuICAgICAgICBhcHAuJGxvbmdpdHVkZS52YWx1ZSA9IGV2ZW50LmxhdExuZy5sbmcoKTtcclxuXHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgZm9yKGxldCAkZmlsdGVyIG9mIGFwcC4kZmlsdGVycyl7XHJcbiAgICAgICAgJGZpbHRlci5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzdHJ1Y3R1cmUgPSAkZmlsdGVyLnZhbHVlO1xyXG4gICAgICAgICAgICBjb25zdCBjaGVja2VkID0gJGZpbHRlci5jaGVja2VkO1xyXG5cclxuICAgICAgICAgICAgYXBwLmZpbHRlck1hcmtlcnMoc3RydWN0dXJlLCBjaGVja2VkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0pO1xyXG5cclxuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblxuXHRpZiAocm9vdCA9PT0gbnVsbCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignR29vZ2xlLW1hcHMgcGFja2FnZSBjYW4gYmUgdXNlZCBvbmx5IGluIGJyb3dzZXInKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0XHRkZWZpbmUoZmFjdG9yeSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdH0gZWxzZSB7XG5cdFx0cm9vdC5Hb29nbGVNYXBzTG9hZGVyID0gZmFjdG9yeSgpO1xuXHR9XG5cbn0pKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDogbnVsbCwgZnVuY3Rpb24oKSB7XG5cblxuXHQndXNlIHN0cmljdCc7XG5cblxuXHR2YXIgZ29vZ2xlVmVyc2lvbiA9ICczLjE4JztcblxuXHR2YXIgc2NyaXB0ID0gbnVsbDtcblxuXHR2YXIgZ29vZ2xlID0gbnVsbDtcblxuXHR2YXIgbG9hZGluZyA9IGZhbHNlO1xuXG5cdHZhciBjYWxsYmFja3MgPSBbXTtcblxuXHR2YXIgb25Mb2FkRXZlbnRzID0gW107XG5cblx0dmFyIG9yaWdpbmFsQ3JlYXRlTG9hZGVyTWV0aG9kID0gbnVsbDtcblxuXG5cdHZhciBHb29nbGVNYXBzTG9hZGVyID0ge307XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLlVSTCA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvanMnO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuS0VZID0gbnVsbDtcblxuXHRHb29nbGVNYXBzTG9hZGVyLkxJQlJBUklFUyA9IFtdO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuQ0xJRU5UID0gbnVsbDtcblxuXHRHb29nbGVNYXBzTG9hZGVyLkNIQU5ORUwgPSBudWxsO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuTEFOR1VBR0UgPSBudWxsO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuUkVHSU9OID0gbnVsbDtcblxuXHRHb29nbGVNYXBzTG9hZGVyLlZFUlNJT04gPSBnb29nbGVWZXJzaW9uO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuV0lORE9XX0NBTExCQUNLX05BTUUgPSAnX19nb29nbGVfbWFwc19hcGlfcHJvdmlkZXJfaW5pdGlhbGl6YXRvcl9fJztcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIuX2dvb2dsZU1vY2tBcGlPYmplY3QgPSB7fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIubG9hZCA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0aWYgKGdvb2dsZSA9PT0gbnVsbCkge1xuXHRcdFx0aWYgKGxvYWRpbmcgPT09IHRydWUpIHtcblx0XHRcdFx0aWYgKGZuKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goZm4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRsb2FkaW5nID0gdHJ1ZTtcblxuXHRcdFx0XHR3aW5kb3dbR29vZ2xlTWFwc0xvYWRlci5XSU5ET1dfQ0FMTEJBQ0tfTkFNRV0gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZWFkeShmbik7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0R29vZ2xlTWFwc0xvYWRlci5jcmVhdGVMb2FkZXIoKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGZuKSB7XG5cdFx0XHRmbihnb29nbGUpO1xuXHRcdH1cblx0fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlTG9hZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0c2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG5cdFx0c2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0Jztcblx0XHRzY3JpcHQuc3JjID0gR29vZ2xlTWFwc0xvYWRlci5jcmVhdGVVcmwoKTtcblxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblx0fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIuaXNMb2FkZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZ29vZ2xlICE9PSBudWxsO1xuXHR9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5jcmVhdGVVcmwgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdXJsID0gR29vZ2xlTWFwc0xvYWRlci5VUkw7XG5cblx0XHR1cmwgKz0gJz9jYWxsYmFjaz0nICsgR29vZ2xlTWFwc0xvYWRlci5XSU5ET1dfQ0FMTEJBQ0tfTkFNRTtcblxuXHRcdGlmIChHb29nbGVNYXBzTG9hZGVyLktFWSkge1xuXHRcdFx0dXJsICs9ICcma2V5PScgKyBHb29nbGVNYXBzTG9hZGVyLktFWTtcblx0XHR9XG5cblx0XHRpZiAoR29vZ2xlTWFwc0xvYWRlci5MSUJSQVJJRVMubGVuZ3RoID4gMCkge1xuXHRcdFx0dXJsICs9ICcmbGlicmFyaWVzPScgKyBHb29nbGVNYXBzTG9hZGVyLkxJQlJBUklFUy5qb2luKCcsJyk7XG5cdFx0fVxuXG5cdFx0aWYgKEdvb2dsZU1hcHNMb2FkZXIuQ0xJRU5UKSB7XG5cdFx0XHR1cmwgKz0gJyZjbGllbnQ9JyArIEdvb2dsZU1hcHNMb2FkZXIuQ0xJRU5UICsgJyZ2PScgKyBHb29nbGVNYXBzTG9hZGVyLlZFUlNJT047XG5cdFx0fVxuXG5cdFx0aWYgKEdvb2dsZU1hcHNMb2FkZXIuQ0hBTk5FTCkge1xuXHRcdFx0dXJsICs9ICcmY2hhbm5lbD0nICsgR29vZ2xlTWFwc0xvYWRlci5DSEFOTkVMO1xuXHRcdH1cblxuXHRcdGlmIChHb29nbGVNYXBzTG9hZGVyLkxBTkdVQUdFKSB7XG5cdFx0XHR1cmwgKz0gJyZsYW5ndWFnZT0nICsgR29vZ2xlTWFwc0xvYWRlci5MQU5HVUFHRTtcblx0XHR9XG5cblx0XHRpZiAoR29vZ2xlTWFwc0xvYWRlci5SRUdJT04pIHtcblx0XHRcdHVybCArPSAnJnJlZ2lvbj0nICsgR29vZ2xlTWFwc0xvYWRlci5SRUdJT047XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVybDtcblx0fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIucmVsZWFzZSA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIHJlbGVhc2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuS0VZID0gbnVsbDtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuTElCUkFSSUVTID0gW107XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLkNMSUVOVCA9IG51bGw7XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLkNIQU5ORUwgPSBudWxsO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5MQU5HVUFHRSA9IG51bGw7XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLlJFR0lPTiA9IG51bGw7XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLlZFUlNJT04gPSBnb29nbGVWZXJzaW9uO1xuXG5cdFx0XHRnb29nbGUgPSBudWxsO1xuXHRcdFx0bG9hZGluZyA9IGZhbHNlO1xuXHRcdFx0Y2FsbGJhY2tzID0gW107XG5cdFx0XHRvbkxvYWRFdmVudHMgPSBbXTtcblxuXHRcdFx0aWYgKHR5cGVvZiB3aW5kb3cuZ29vZ2xlICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRkZWxldGUgd2luZG93Lmdvb2dsZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiB3aW5kb3dbR29vZ2xlTWFwc0xvYWRlci5XSU5ET1dfQ0FMTEJBQ0tfTkFNRV0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGRlbGV0ZSB3aW5kb3dbR29vZ2xlTWFwc0xvYWRlci5XSU5ET1dfQ0FMTEJBQ0tfTkFNRV07XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcmlnaW5hbENyZWF0ZUxvYWRlck1ldGhvZCAhPT0gbnVsbCkge1xuXHRcdFx0XHRHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZUxvYWRlciA9IG9yaWdpbmFsQ3JlYXRlTG9hZGVyTWV0aG9kO1xuXHRcdFx0XHRvcmlnaW5hbENyZWF0ZUxvYWRlck1ldGhvZCA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzY3JpcHQgIT09IG51bGwpIHtcblx0XHRcdFx0c2NyaXB0LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcblx0XHRcdFx0c2NyaXB0ID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZuKSB7XG5cdFx0XHRcdGZuKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGlmIChsb2FkaW5nKSB7XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLmxvYWQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJlbGVhc2UoKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZWxlYXNlKCk7XG5cdFx0fVxuXHR9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5vbkxvYWQgPSBmdW5jdGlvbihmbikge1xuXHRcdG9uTG9hZEV2ZW50cy5wdXNoKGZuKTtcblx0fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIubWFrZU1vY2sgPSBmdW5jdGlvbigpIHtcblx0XHRvcmlnaW5hbENyZWF0ZUxvYWRlck1ldGhvZCA9IEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlTG9hZGVyO1xuXG5cdFx0R29vZ2xlTWFwc0xvYWRlci5jcmVhdGVMb2FkZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHdpbmRvdy5nb29nbGUgPSBHb29nbGVNYXBzTG9hZGVyLl9nb29nbGVNb2NrQXBpT2JqZWN0O1xuXHRcdFx0d2luZG93W0dvb2dsZU1hcHNMb2FkZXIuV0lORE9XX0NBTExCQUNLX05BTUVdKCk7XG5cdFx0fTtcblx0fTtcblxuXG5cdHZhciByZWFkeSA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIGk7XG5cblx0XHRsb2FkaW5nID0gZmFsc2U7XG5cblx0XHRpZiAoZ29vZ2xlID09PSBudWxsKSB7XG5cdFx0XHRnb29nbGUgPSB3aW5kb3cuZ29vZ2xlO1xuXHRcdH1cblxuXHRcdGZvciAoaSA9IDA7IGkgPCBvbkxvYWRFdmVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdG9uTG9hZEV2ZW50c1tpXShnb29nbGUpO1xuXHRcdH1cblxuXHRcdGlmIChmbikge1xuXHRcdFx0Zm4oZ29vZ2xlKTtcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjYWxsYmFja3NbaV0oZ29vZ2xlKTtcblx0XHR9XG5cblx0XHRjYWxsYmFja3MgPSBbXTtcblx0fTtcblxuXG5cdHJldHVybiBHb29nbGVNYXBzTG9hZGVyO1xuXG59KTtcbiJdfQ==
