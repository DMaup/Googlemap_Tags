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