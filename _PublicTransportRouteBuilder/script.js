function RouteMap (placemarks, links) {
    this.placemarks = placemarks;
    this.links = links;
}

ymaps.ready(init);

var routeMap = new RouteMap([], []);
var tempId, isSelected = false;
var curId = 0;

function init () {

    var map;

    map = new ymaps.Map("map", {
        center: [57.5262, 38.3061], // Углич
        zoom: 7
    });
    clickHandling(map, routeMap);
}

function clickHandling(map, routeMap)
{
    map.events.add('click', function(e)
    {
        var pos = e.get('coords');
        var placemark = new ymaps.Placemark(pos, undefined, {
            preset: 'islands#circleDotIcon',
            iconColor: '#1faee9'
        });

        placemark.properties.set('ID', curId);
        addSelectionEvent(placemark);
        console.log(placemark.properties.get('ID'));

        map.geoObjects.add(placemark);
        routeMap.placemarks.push(placemark);
        curId++;
    });
}

function addSelectionEvent(placemark)
{
    placemark.events.add('contextmenu', function(e){
        e.get('target').options.set('preset', 'islands#circleIcon');
    });
}
