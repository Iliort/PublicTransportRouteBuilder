tempId = 0

#class StationMark extends ymaps.Placemark
#  constructor: (coords, id) ->
#    super coords
#    this.events.add('contextmenu',
#      (e) ->
#        if !isSelected
#          tempId = this.id
#          isSelected = true
#        else
#          isSelected = false;
#          routeMap.links.push([tempId, this.id]);
#        console.log(routeMap);
#
#    )

class RouteMap
  constructor: (@coords, @links)->

routeMap = new RouteMap([], [])

ymaps.ready(->
  map = new ymaps.Map("map", {
  center: [57.5262, 38.3061],
  zoom: 7
  })
  clickHandling(map, )
  return
)

clickHandling = (map, routeMap) ->
  map.events.add('click', (e) ->
    pos = e.get('coords');
    map.geoObjects.add(new ymaps.Placemark(pos));
    routeMap.coords.push(pos);
    #curId++;
    console.log(routeMap.coords);
  )
