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

