function RouteMap (coords, links)
{
    this.coords = coords;
    this.links = links;
}

function StationMark(coords, id)
{
    this.id = id;
    this.coords = coords;
    //this.prototype = new ymaps.Placemark(coords);
    this.events.add('contextmenu', function(e)
    {
        if (!isSelected) {
            tempId = this.id;
            isSelected = true;
        }
        else
        {
            isSelected = false;
            routeMap.links.push([tempId, this.id]);
        }
        console.log(routeMap);
    });


}
//StationMark.prototype = new ymaps.Placemark();

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
        map.geoObjects.add(new ymaps.Placemark(pos, curId));
        routeMap.coords.push(pos);
        curId++;
        console.log(routeMap.coords);
    });
}

