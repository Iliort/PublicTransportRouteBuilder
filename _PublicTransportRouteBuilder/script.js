function RouteMap (placemarks, links, lines) {
    this.placemarks = placemarks;
    this.links = links;
    this.lines = lines;
}

ymaps.ready(init);

var routeMap = new RouteMap([], [], []);
var isSelected = false;
var selectedId = -1;
var curId = 0;
var map;

function init () {

    map = new ymaps.Map("map", {
        center: [57.5262, 38.3061], // Углич
        zoom: 7
    });
    clickHandling();
}

function clickHandling()
{
    map.events.add('click', function(e)
    {
        var pos = e.get('coords');
        var placemark = new ymaps.Placemark(pos, undefined, {
            preset: 'islands#circleDotIcon',
            iconColor: '#1faee9'
        }, {
            draggable: true
        });
        placemark.options.draggable = true;
        placemark.properties.set('ID', curId);
        addPlacemarkEvents(placemark);
        console.log(placemark.properties.get('ID'));

        map.geoObjects.add(placemark);
        routeMap.placemarks.push(placemark);
        curId++;
    });
}

function addPlacemarkEvents(placemark)
{
    var id = placemark.properties.get('ID');
    placemark.events.add('contextmenu', function(e){
        e.get('target').options.set('preset', 'islands#circleIcon');

        if (isSelected == false) {
            isSelected = true;
            selectedId = id;
        }
        else {
            if (id !== selectedId)
            {
                routeMap.links.push([selectedId, id]);
                getPlacemark(selectedId).options.set('preset', 'islands#circleDotIcon');
                linkPlacemarks(getPlacemark(id), getPlacemark((selectedId)))
                selectedId = -1;
                isSelected = false;

                console.log(routeMap);
            }
            getPlacemark(id).options.set('preset', 'islands#circleDotIcon');
        }

    });

    placemark.events.add('click', function(e){
        var index = routeMap.placemarks.indexOf(getPlacemark(id));
        if(index > -1) routeMap.placemarks.splice(index, 1);


        map.geoObjects.remove(placemark);
        //map.geoObjects.removeAll();
        console.log(map.geoObjects);
        for(var i = 0; i < routeMap.links.length; i++)
        {
            if (routeMap.links[i][0] == id || routeMap.links[i][1] == id) routeMap.links.splice(i, 1);
        }

        for(var i = 0; i < routeMap.lines.length; i++)
        {
            if (routeMap.lines[i].properties.get('IDs')[0] == id || routeMap.lines[i].properties.get('IDs')[1] == id)
            {
                map.geoObjects.remove(routeMap.lines[i]);
                routeMap.lines.splice(i, 1);
            }
        }
        console.log(routeMap);
    });

}

function getPlacemark(id){

    for(var i = 0; i < routeMap.placemarks.length; i++)
    {
        if(routeMap.placemarks[i].properties.get('ID') == id) return routeMap.placemarks[i];
    }
}

function linkPlacemarks(placemark1, placemark2){
    var line = new ymaps.Polyline([
        placemark1.geometry.getCoordinates(),
        placemark2.geometry.getCoordinates()
    ], {
    }, {
        strokeColor: "#000000",
        strokeWidth: 4,
        strokeOpacity: 0.5
    });
    line.properties.set('IDs', [placemark1.properties.get('ID'), placemark2.properties.get('ID')]);
    map.geoObjects.add(line);
    routeMap.lines.push(line);
}