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