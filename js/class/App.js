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