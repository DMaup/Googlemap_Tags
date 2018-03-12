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