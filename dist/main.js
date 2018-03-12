(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Shop = require("./Shop");
class App {
    constructor() {

        this.$form          = document.getElementById("form-maps");
        this.$shop          = document.getElementById("shop_label");
        this.$description   = document.getElementById("description");
        this.$latitude      = document.getElementById("latitude");
        this.$longitude     = document.getElementById("longitude");
        /*this.$structure    = document.getElementById("structure");
        this.$filters       = document.querySelectorAll("input[type='checkbox']");*/

        this.position = {
            lat: 0,
            lng: 0
        };

        this.map = null;
        this.appMarker = null;
        this.shops = [];
    }

    initMap(idElement) {
        this.map = new google.maps.Map(document.getElementById(idElement), {
            center: {
                lat: this.position.lat,
                lng: this.position.lng
            },
            zoom: 14
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
            $shop: 'Vous êtes ici !'
        });


        this.appMarker.addListener("click", () => {
            infoWindow.open(this.map, this.appMarker);
        });
    }

    addShop() {
        const position = {
            lat: parseFloat(this.$latitude.value),
            lng: parseFloat(this.$longitude.value)
        };


        const shop = new Shop(
            this.map,
            position,
            this.$shop.value,
            this.$description.value
            //this.$form.elements["structure"].value
        );

        let content = "<h3>" + this.$shop.value + "</h3>";
        content += "<p>" + this.$description.value + "</p>";

        const infowindow = new google.maps.InfoWindow({
            content: content
        });

        //this.shops[shop.structure].push(shop);
        this.clearForm();
    }

    clearForm(){
     this.$form.reset();
    }

   /* filterMarkers(structure, checked){
        const map = checked ? this.map : null;

        for (let shop of this.shops[structure]){
            shop.g_marker.setMap(map);
        }


    }*/

    storeShops(){
        const key = "shops";
        localStorage.setItem(key,JSON.stringify(this.shops));
    }

   /* registerInLocalStorage(){

        const stringified = JSON.stringify( this.shops );
        localStorage.setItem( shops , stringified );

    }*/
}
    module.exports = App;
},{"./Shop":2}],2:[function(require,module,exports){
class Shop {
    constructor(map, position, shop, description){


        this.g_marker = null;
        this.g_infowindows = null;

        this.createG_marker(map, position, shop);
        this.createG_infowindow(shop, description);
        this.linkMarkerWindow(map);
    }

    createG_marker(map, position, shop){
        this.g_marker = new google.maps.Marker({
            position: position,
            shop: shop,
            map: map
        });
    }

    createG_infowindow(shop, description){
        let content = "<h3>" + shop + "</h3>";
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

module.exports = Shop;
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
        app.addShop();
        app.storeShops();
    }
    
    app.map.addListener("click", function (event) {
        app.$latitude.value = event.latLng.lat();
        app.$longitude.value = event.latLng.lng();


    });

  /*  for(let $filter of app.$filters){
        $filter.onclick = function () {
            const structure = $filter.value;
            const checked = $filter.checked;

            app.filterMarkers(structure, checked);
        }
    }*/



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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkY6XFxERVZfV0VCXFxKU09iamV0XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJGOi9ERVZfV0VCL0pTT2JqZXQvVFBfc2hvcC9qcy9jbGFzcy9BcHAuanMiLCJGOi9ERVZfV0VCL0pTT2JqZXQvVFBfc2hvcC9qcy9jbGFzcy9TaG9wLmpzIiwiRjovREVWX1dFQi9KU09iamV0L1RQX3Nob3AvanMvbWFpbi5qcyIsIkY6L0RFVl9XRUIvSlNPYmpldC9ub2RlX21vZHVsZXMvZ29vZ2xlLW1hcHMvbGliL0dvb2dsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBTaG9wID0gcmVxdWlyZShcIi4vU2hvcFwiKTtcclxuY2xhc3MgQXBwIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLiRmb3JtICAgICAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3JtLW1hcHNcIik7XHJcbiAgICAgICAgdGhpcy4kc2hvcCAgICAgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvcF9sYWJlbFwiKTtcclxuICAgICAgICB0aGlzLiRkZXNjcmlwdGlvbiAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZXNjcmlwdGlvblwiKTtcclxuICAgICAgICB0aGlzLiRsYXRpdHVkZSAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYXRpdHVkZVwiKTtcclxuICAgICAgICB0aGlzLiRsb25naXR1ZGUgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb25naXR1ZGVcIik7XHJcbiAgICAgICAgLyp0aGlzLiRzdHJ1Y3R1cmUgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0cnVjdHVyZVwiKTtcclxuICAgICAgICB0aGlzLiRmaWx0ZXJzICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0W3R5cGU9J2NoZWNrYm94J11cIik7Ki9cclxuXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHtcclxuICAgICAgICAgICAgbGF0OiAwLFxyXG4gICAgICAgICAgICBsbmc6IDBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm1hcCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5hcHBNYXJrZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2hvcHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0TWFwKGlkRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEVsZW1lbnQpLCB7XHJcbiAgICAgICAgICAgIGNlbnRlcjoge1xyXG4gICAgICAgICAgICAgICAgbGF0OiB0aGlzLnBvc2l0aW9uLmxhdCxcclxuICAgICAgICAgICAgICAgIGxuZzogdGhpcy5wb3NpdGlvbi5sbmdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgem9vbTogMTRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb3NpdGlvbihsYXQsIGxuZykge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ubGF0ID0gbGF0O1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24ubG5nID0gbG5nO1xyXG5cclxuICAgICAgICB0aGlzLmNlbnRlck9uTWFwUG9zaXRpb24oKTtcclxuICAgICAgICB0aGlzLnNldEFwcE1hcmtlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNlbnRlck9uTWFwUG9zaXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5tYXAuc2V0Q2VudGVyKHtcclxuICAgICAgICAgICAgbGF0OiB0aGlzLnBvc2l0aW9uLmxhdCxcclxuICAgICAgICAgICAgbG5nOiB0aGlzLnBvc2l0aW9uLmxuZ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEFwcE1hcmtlcigpIHtcclxuICAgICAgICBjb25zdCBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xyXG5cclxuICAgICAgICAgICAgY29udGVudDogXCI8aDM+IEhlbGxvIExlIFNvbGVyICEgPC9oMz5cIlxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5hcHBNYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucG9zaXRpb24sXHJcbiAgICAgICAgICAgIG1hcDogdGhpcy5tYXAsXHJcbiAgICAgICAgICAgICRzaG9wOiAnVm91cyDDqnRlcyBpY2kgISdcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuYXBwTWFya2VyLmFkZExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4odGhpcy5tYXAsIHRoaXMuYXBwTWFya2VyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTaG9wKCkge1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0ge1xyXG4gICAgICAgICAgICBsYXQ6IHBhcnNlRmxvYXQodGhpcy4kbGF0aXR1ZGUudmFsdWUpLFxyXG4gICAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQodGhpcy4kbG9uZ2l0dWRlLnZhbHVlKVxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBjb25zdCBzaG9wID0gbmV3IFNob3AoXHJcbiAgICAgICAgICAgIHRoaXMubWFwLFxyXG4gICAgICAgICAgICBwb3NpdGlvbixcclxuICAgICAgICAgICAgdGhpcy4kc2hvcC52YWx1ZSxcclxuICAgICAgICAgICAgdGhpcy4kZGVzY3JpcHRpb24udmFsdWVcclxuICAgICAgICAgICAgLy90aGlzLiRmb3JtLmVsZW1lbnRzW1wic3RydWN0dXJlXCJdLnZhbHVlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSBcIjxoMz5cIiArIHRoaXMuJHNob3AudmFsdWUgKyBcIjwvaDM+XCI7XHJcbiAgICAgICAgY29udGVudCArPSBcIjxwPlwiICsgdGhpcy4kZGVzY3JpcHRpb24udmFsdWUgKyBcIjwvcD5cIjtcclxuXHJcbiAgICAgICAgY29uc3QgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcclxuICAgICAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL3RoaXMuc2hvcHNbc2hvcC5zdHJ1Y3R1cmVdLnB1c2goc2hvcCk7XHJcbiAgICAgICAgdGhpcy5jbGVhckZvcm0oKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckZvcm0oKXtcclxuICAgICB0aGlzLiRmb3JtLnJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAvKiBmaWx0ZXJNYXJrZXJzKHN0cnVjdHVyZSwgY2hlY2tlZCl7XHJcbiAgICAgICAgY29uc3QgbWFwID0gY2hlY2tlZCA/IHRoaXMubWFwIDogbnVsbDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgc2hvcCBvZiB0aGlzLnNob3BzW3N0cnVjdHVyZV0pe1xyXG4gICAgICAgICAgICBzaG9wLmdfbWFya2VyLnNldE1hcChtYXApO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfSovXHJcblxyXG4gICAgc3RvcmVTaG9wcygpe1xyXG4gICAgICAgIGNvbnN0IGtleSA9IFwic2hvcHNcIjtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksSlNPTi5zdHJpbmdpZnkodGhpcy5zaG9wcykpO1xyXG4gICAgfVxyXG5cclxuICAgLyogcmVnaXN0ZXJJbkxvY2FsU3RvcmFnZSgpe1xyXG5cclxuICAgICAgICBjb25zdCBzdHJpbmdpZmllZCA9IEpTT04uc3RyaW5naWZ5KCB0aGlzLnNob3BzICk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oIHNob3BzICwgc3RyaW5naWZpZWQgKTtcclxuXHJcbiAgICB9Ki9cclxufVxyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBBcHA7IiwiY2xhc3MgU2hvcCB7XHJcbiAgICBjb25zdHJ1Y3RvcihtYXAsIHBvc2l0aW9uLCBzaG9wLCBkZXNjcmlwdGlvbil7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmdfbWFya2VyID0gbnVsbDtcclxuICAgICAgICB0aGlzLmdfaW5mb3dpbmRvd3MgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZUdfbWFya2VyKG1hcCwgcG9zaXRpb24sIHNob3ApO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlR19pbmZvd2luZG93KHNob3AsIGRlc2NyaXB0aW9uKTtcclxuICAgICAgICB0aGlzLmxpbmtNYXJrZXJXaW5kb3cobWFwKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVHX21hcmtlcihtYXAsIHBvc2l0aW9uLCBzaG9wKXtcclxuICAgICAgICB0aGlzLmdfbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcclxuICAgICAgICAgICAgc2hvcDogc2hvcCxcclxuICAgICAgICAgICAgbWFwOiBtYXBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVHX2luZm93aW5kb3coc2hvcCwgZGVzY3JpcHRpb24pe1xyXG4gICAgICAgIGxldCBjb250ZW50ID0gXCI8aDM+XCIgKyBzaG9wICsgXCI8L2gzPlwiO1xyXG4gICAgICAgICAgICBjb250ZW50ICs9IFwiPHA+XCIgKyBkZXNjcmlwdGlvbiArIFwiPC9wPlwiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5nX2luZm93aW5kb3dzID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xyXG4gICAgICAgICAgICAgICAgY29udGVudDogY29udGVudFxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsaW5rTWFya2VyV2luZG93KG1hcCl7XHJcbiAgICAgICAgdGhpcy5nX21hcmtlci5hZGRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+e1xyXG4gICAgICAgICAgICB0aGlzLmdfaW5mb3dpbmRvd3Mub3BlbihtYXAsIHRoaXMuZ19tYXJrZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFNob3A7IiwiY29uc3QgR29vZ2xlTWFwc0xvYWRlciA9IHJlcXVpcmUoJ2dvb2dsZS1tYXBzJyk7XHJcbiAgICBBcHAgPSByZXF1aXJlKFwiLi9jbGFzcy9BcHBcIik7XHJcblxyXG5Hb29nbGVNYXBzTG9hZGVyLktFWSA9IFwiQUl6YVN5QXNSWkhIZzZoRGxZbVJxRXAzajNQazdvUTJDNWZSbFhFXCI7XHJcbkdvb2dsZU1hcHNMb2FkZXIubG9hZChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XHJcbiAgICBhcHAuaW5pdE1hcChcIm1hcFwiKTtcclxuXHJcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3NpdGlvbikge1xyXG5cclxuICAgICAgICBhcHAuc2V0UG9zaXRpb24oXHJcbiAgICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZVxyXG4gICAgICAgIClcclxuXHJcbiAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICBhcHAuc2V0UG9zaXRpb24oXHJcbiAgICAgICAgICAgIDQyLjY5OTAyOTcsXHJcbiAgICAgICAgICAgIDIuODM0NDYxN1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLiRmb3JtLm9uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgYXBwLmFkZFNob3AoKTtcclxuICAgICAgICBhcHAuc3RvcmVTaG9wcygpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBhcHAubWFwLmFkZExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgYXBwLiRsYXRpdHVkZS52YWx1ZSA9IGV2ZW50LmxhdExuZy5sYXQoKTtcclxuICAgICAgICBhcHAuJGxvbmdpdHVkZS52YWx1ZSA9IGV2ZW50LmxhdExuZy5sbmcoKTtcclxuXHJcblxyXG4gICAgfSk7XHJcblxyXG4gIC8qICBmb3IobGV0ICRmaWx0ZXIgb2YgYXBwLiRmaWx0ZXJzKXtcclxuICAgICAgICAkZmlsdGVyLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0cnVjdHVyZSA9ICRmaWx0ZXIudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSAkZmlsdGVyLmNoZWNrZWQ7XHJcblxyXG4gICAgICAgICAgICBhcHAuZmlsdGVyTWFya2VycyhzdHJ1Y3R1cmUsIGNoZWNrZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH0qL1xyXG5cclxuXHJcblxyXG59KTtcclxuXHJcbiIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG5cblx0aWYgKHJvb3QgPT09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0dvb2dsZS1tYXBzIHBhY2thZ2UgY2FuIGJlIHVzZWQgb25seSBpbiBicm93c2VyJyk7XG5cdH1cblxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHR9IGVsc2Uge1xuXHRcdHJvb3QuR29vZ2xlTWFwc0xvYWRlciA9IGZhY3RvcnkoKTtcblx0fVxuXG59KSh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IG51bGwsIGZ1bmN0aW9uKCkge1xuXG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cblx0dmFyIGdvb2dsZVZlcnNpb24gPSAnMy4xOCc7XG5cblx0dmFyIHNjcmlwdCA9IG51bGw7XG5cblx0dmFyIGdvb2dsZSA9IG51bGw7XG5cblx0dmFyIGxvYWRpbmcgPSBmYWxzZTtcblxuXHR2YXIgY2FsbGJhY2tzID0gW107XG5cblx0dmFyIG9uTG9hZEV2ZW50cyA9IFtdO1xuXG5cdHZhciBvcmlnaW5hbENyZWF0ZUxvYWRlck1ldGhvZCA9IG51bGw7XG5cblxuXHR2YXIgR29vZ2xlTWFwc0xvYWRlciA9IHt9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5VUkwgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2pzJztcblxuXHRHb29nbGVNYXBzTG9hZGVyLktFWSA9IG51bGw7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5MSUJSQVJJRVMgPSBbXTtcblxuXHRHb29nbGVNYXBzTG9hZGVyLkNMSUVOVCA9IG51bGw7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5DSEFOTkVMID0gbnVsbDtcblxuXHRHb29nbGVNYXBzTG9hZGVyLkxBTkdVQUdFID0gbnVsbDtcblxuXHRHb29nbGVNYXBzTG9hZGVyLlJFR0lPTiA9IG51bGw7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5WRVJTSU9OID0gZ29vZ2xlVmVyc2lvbjtcblxuXHRHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FID0gJ19fZ29vZ2xlX21hcHNfYXBpX3Byb3ZpZGVyX2luaXRpYWxpemF0b3JfXyc7XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLl9nb29nbGVNb2NrQXBpT2JqZWN0ID0ge307XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLmxvYWQgPSBmdW5jdGlvbihmbikge1xuXHRcdGlmIChnb29nbGUgPT09IG51bGwpIHtcblx0XHRcdGlmIChsb2FkaW5nID09PSB0cnVlKSB7XG5cdFx0XHRcdGlmIChmbikge1xuXHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGZuKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9hZGluZyA9IHRydWU7XG5cblx0XHRcdFx0d2luZG93W0dvb2dsZU1hcHNMb2FkZXIuV0lORE9XX0NBTExCQUNLX05BTUVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmVhZHkoZm4pO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlTG9hZGVyKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChmbikge1xuXHRcdFx0Zm4oZ29vZ2xlKTtcblx0XHR9XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZUxvYWRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG5cdFx0c2NyaXB0LnNyYyA9IEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlVXJsKCk7XG5cblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLmlzTG9hZGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGdvb2dsZSAhPT0gbnVsbDtcblx0fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlVXJsID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHVybCA9IEdvb2dsZU1hcHNMb2FkZXIuVVJMO1xuXG5cdFx0dXJsICs9ICc/Y2FsbGJhY2s9JyArIEdvb2dsZU1hcHNMb2FkZXIuV0lORE9XX0NBTExCQUNLX05BTUU7XG5cblx0XHRpZiAoR29vZ2xlTWFwc0xvYWRlci5LRVkpIHtcblx0XHRcdHVybCArPSAnJmtleT0nICsgR29vZ2xlTWFwc0xvYWRlci5LRVk7XG5cdFx0fVxuXG5cdFx0aWYgKEdvb2dsZU1hcHNMb2FkZXIuTElCUkFSSUVTLmxlbmd0aCA+IDApIHtcblx0XHRcdHVybCArPSAnJmxpYnJhcmllcz0nICsgR29vZ2xlTWFwc0xvYWRlci5MSUJSQVJJRVMuam9pbignLCcpO1xuXHRcdH1cblxuXHRcdGlmIChHb29nbGVNYXBzTG9hZGVyLkNMSUVOVCkge1xuXHRcdFx0dXJsICs9ICcmY2xpZW50PScgKyBHb29nbGVNYXBzTG9hZGVyLkNMSUVOVCArICcmdj0nICsgR29vZ2xlTWFwc0xvYWRlci5WRVJTSU9OO1xuXHRcdH1cblxuXHRcdGlmIChHb29nbGVNYXBzTG9hZGVyLkNIQU5ORUwpIHtcblx0XHRcdHVybCArPSAnJmNoYW5uZWw9JyArIEdvb2dsZU1hcHNMb2FkZXIuQ0hBTk5FTDtcblx0XHR9XG5cblx0XHRpZiAoR29vZ2xlTWFwc0xvYWRlci5MQU5HVUFHRSkge1xuXHRcdFx0dXJsICs9ICcmbGFuZ3VhZ2U9JyArIEdvb2dsZU1hcHNMb2FkZXIuTEFOR1VBR0U7XG5cdFx0fVxuXG5cdFx0aWYgKEdvb2dsZU1hcHNMb2FkZXIuUkVHSU9OKSB7XG5cdFx0XHR1cmwgKz0gJyZyZWdpb249JyArIEdvb2dsZU1hcHNMb2FkZXIuUkVHSU9OO1xuXHRcdH1cblxuXHRcdHJldHVybiB1cmw7XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLnJlbGVhc2UgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciByZWxlYXNlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLktFWSA9IG51bGw7XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLkxJQlJBUklFUyA9IFtdO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5DTElFTlQgPSBudWxsO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5DSEFOTkVMID0gbnVsbDtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuTEFOR1VBR0UgPSBudWxsO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5SRUdJT04gPSBudWxsO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5WRVJTSU9OID0gZ29vZ2xlVmVyc2lvbjtcblxuXHRcdFx0Z29vZ2xlID0gbnVsbDtcblx0XHRcdGxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdGNhbGxiYWNrcyA9IFtdO1xuXHRcdFx0b25Mb2FkRXZlbnRzID0gW107XG5cblx0XHRcdGlmICh0eXBlb2Ygd2luZG93Lmdvb2dsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0ZGVsZXRlIHdpbmRvdy5nb29nbGU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2Ygd2luZG93W0dvb2dsZU1hcHNMb2FkZXIuV0lORE9XX0NBTExCQUNLX05BTUVdICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRkZWxldGUgd2luZG93W0dvb2dsZU1hcHNMb2FkZXIuV0lORE9XX0NBTExCQUNLX05BTUVdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3JpZ2luYWxDcmVhdGVMb2FkZXJNZXRob2QgIT09IG51bGwpIHtcblx0XHRcdFx0R29vZ2xlTWFwc0xvYWRlci5jcmVhdGVMb2FkZXIgPSBvcmlnaW5hbENyZWF0ZUxvYWRlck1ldGhvZDtcblx0XHRcdFx0b3JpZ2luYWxDcmVhdGVMb2FkZXJNZXRob2QgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2NyaXB0ICE9PSBudWxsKSB7XG5cdFx0XHRcdHNjcmlwdC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHNjcmlwdCk7XG5cdFx0XHRcdHNjcmlwdCA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmbikge1xuXHRcdFx0XHRmbigpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAobG9hZGluZykge1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5sb2FkKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZWxlYXNlKCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVsZWFzZSgpO1xuXHRcdH1cblx0fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIub25Mb2FkID0gZnVuY3Rpb24oZm4pIHtcblx0XHRvbkxvYWRFdmVudHMucHVzaChmbik7XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLm1ha2VNb2NrID0gZnVuY3Rpb24oKSB7XG5cdFx0b3JpZ2luYWxDcmVhdGVMb2FkZXJNZXRob2QgPSBHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZUxvYWRlcjtcblxuXHRcdEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlTG9hZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR3aW5kb3cuZ29vZ2xlID0gR29vZ2xlTWFwc0xvYWRlci5fZ29vZ2xlTW9ja0FwaU9iamVjdDtcblx0XHRcdHdpbmRvd1tHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FXSgpO1xuXHRcdH07XG5cdH07XG5cblxuXHR2YXIgcmVhZHkgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBpO1xuXG5cdFx0bG9hZGluZyA9IGZhbHNlO1xuXG5cdFx0aWYgKGdvb2dsZSA9PT0gbnVsbCkge1xuXHRcdFx0Z29vZ2xlID0gd2luZG93Lmdvb2dsZTtcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgb25Mb2FkRXZlbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRvbkxvYWRFdmVudHNbaV0oZ29vZ2xlKTtcblx0XHR9XG5cblx0XHRpZiAoZm4pIHtcblx0XHRcdGZuKGdvb2dsZSk7XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y2FsbGJhY2tzW2ldKGdvb2dsZSk7XG5cdFx0fVxuXG5cdFx0Y2FsbGJhY2tzID0gW107XG5cdH07XG5cblxuXHRyZXR1cm4gR29vZ2xlTWFwc0xvYWRlcjtcblxufSk7XG4iXX0=
