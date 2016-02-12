function RouteMap (placemarks, lines) {
    this.placemarks = placemarks;
    this.lines = lines;
}

ymaps.ready(init);

var routeMap = new RouteMap([], []);
var isSelected = false;
var selectedId = -1;
var selectedLineIds = [-1, -1];
var curId = 0;
var map;

function init () {

    map = new ymaps.Map("map", {
        center: [55.751244, 37.618423],
        zoom: 12
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
            iconColor: '#1faee9',
            draggable:true
        });
        placemark.properties.set('ID', curId);
        addPlacemarkEvents(placemark);
        console.log(placemark.properties.get('ID'));

        map.geoObjects.add(placemark);
        routeMap.placemarks.push(placemark);
        curId++;
    });
}

function addPlacemarkEvents(placemark) {
    var id = placemark.properties.get('ID');
    placemark.events.add('click', function(e){
        if(!ADJUST) {
            if (selectedId == -1) {
                selectPlacemark(placemark);
                console.log(selectedId);
            }
            else {
                if (id !== selectedId) {
                    linkPlacemarks(getPlacemark(id), getPlacemark((selectedId)))
                }
                deselectPlacemark(getPlacemark(selectedId));
            }
        }
        else{
            selectPlacemark(placemark);
            $("#toolbox2").hide("drop", { to: { width: 200, height: 60 } }, 500);
            $("#toolbox1").show("drop", { to: { width: 200, height: 60 } }, 500);
            $("#toolbox1 button").focus();
            $("#name_field").val(placemark.properties.get("name"));
            $("#colorpicker1").val(placemark.options.get("iconColor"));
        }

    });

    placemark.events.add('contextmenu', function(e){
        var index = routeMap.placemarks.indexOf(getPlacemark(id));
        if(index > -1) routeMap.placemarks.splice(index, 1);


        map.geoObjects.remove(placemark);
        //map.geoObjects.removeAll();
        console.log(map.geoObjects);

        for(var i = 0;; i++) {
            if (routeMap.lines[i] === undefined) break;
            if (routeMap.lines[i].properties.get('IDs')[0] == id || routeMap.lines[i].properties.get('IDs')[1] == id) {
                map.geoObjects.remove(routeMap.lines[i]);
                routeMap.lines.splice(i, 1);
                i--;
            }
        }

        console.log(routeMap);
    });

    placemark.events.add('drag', function(e)
    {
        for(var i = 0;; i++) {
            if (routeMap.lines[i] === undefined) break;
            if (routeMap.lines[i].properties.get('IDs')[0] == id) {
                routeMap.lines[i].geometry.set(0, getPlacemark(id).geometry.getCoordinates());
            }
            else if (routeMap.lines[i].properties.get('IDs')[1] == id) {
                routeMap.lines[i].geometry.set(1, getPlacemark(id).geometry.getCoordinates());
            }
        }
    });

}


// TODO: Finish addLineEvents
function addLineEvents(line) {
    var IDs = line.properties.get("IDs");
    line.events.add('click', function () {
        if(ADJUST) {
            $("#toolbox1").hide("drop", {to: {width: 200, height: 60}}, 500);
            $("#toolbox2").show("drop", {to: {width: 200, height: 60}}, 500);
            $("#toolbox2 button").focus();
            selectLine(line);
            $("#width_field").val(getLine(IDs).options.get("strokeWidth"));
            $("#time_field").val(getLine(IDs).properties.get("hintContent"));
            $("#colorpicker2").val(line.options.get("strokeColor"));
        }
    });

    line.events.add('contextmenu', function () {
        var index = routeMap.lines.indexOf(getLine(IDs));
        if(index > -1) routeMap.lines.splice(index, 1);
        map.geoObjects.remove(line);
    });
}

function getPlacemark(id){

    for(var i = 0; i < routeMap.placemarks.length; i++)
    {
        if(routeMap.placemarks[i].properties.get('ID') == id) return routeMap.placemarks[i];
    }
}

function getLine(IDs){

    for(var i = 0; i < routeMap.lines.length; i++)
    {
        if(routeMap.lines[i].properties.get('IDs') == IDs) return routeMap.lines[i];
    }
}

function deselectPlacemark(placemark){
    selectedId = -1;
    placemark.options.set('preset', 'islands#circleDotIcon');
}

function selectPlacemark(placemark){
    for (var i = 0; i < routeMap.lines.length; i++) deselectLine(routeMap.lines[i]);
    for (var i = 0; i < routeMap.placemarks.length; i++) deselectPlacemark(routeMap.placemarks[i]);
    selectedId = placemark.properties.get('ID');
    placemark.options.set('preset', 'islands#circleIcon');
}

function deselectLine(line){
    selectedLineIds = [-1,-1];
    line.options.set('strokeOpacity', 0.5);
}

function selectLine(line){
    for (var i = 0; i < routeMap.lines.length; i++) deselectLine(routeMap.lines[i]);
    for (var i = 0; i < routeMap.placemarks.length; i++) deselectPlacemark(routeMap.placemarks[i]);
    selectedLineIds = line.properties.get('IDs');
    line.options.set('strokeOpacity', 1);
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
    addLineEvents(line);
    map.geoObjects.add(line);
    routeMap.lines.push(line);
    console.log(routeMap);
}

/* ------------------------------------------------------------------------------------------------------------------------------------
                                                               JQUERY GOES HERE
-------------------------------------------------------------------------------------------------------------------------------------*/
var ADJUST = false;

$(function() {
    $("#mode_sel").buttonset();
    $(".toolbox").hide();

    $("#mode_sel input").on("change", function () {
        if($("#mode_sel input:checked").prop("id") == "adjust_but") ADJUST = true;
        else{
            ADJUST = false;
            $(".toolbox").hide("drop", { to: { width: 200, height: 60 } }, 500)
        }
        console.log(ADJUST);
        for (var i = 0; i < routeMap.lines.length; i++) deselectLine(routeMap.lines[i]);
        for (var i = 0; i < routeMap.placemarks.length; i++) deselectPlacemark(routeMap.placemarks[i]);
    });

    $("#toolbox1 button").on("click", function () {
        var name = $("#name_field").val();
        if(name != "") {
            getPlacemark(selectedId).properties.set("name", name);
            getPlacemark(selectedId).properties.set("hintContent", name);
            $("#name_field").val("");
        }
        getPlacemark(selectedId).options.set("iconColor", $("#colorpicker1").val());
    });

    $("#toolbox2 button").on("click", function () {
        var timeStr = $("#time_field").val().split(":");
        console.log(timeStr);
        if (timeStr == [""]) alert("Please, enter time as HH:MM");
        var time = Number(timeStr[0])*60+Number(timeStr[1]);
        console.log(time);
        if(time != null) {
            getLine(selectedLineIds).properties.set("time", time);
            getLine(selectedLineIds).properties.set("hintContent", $("#time_field").val());
            console.log(time);
            console.log(typeof time);
            $("#time_field").val(null);
        }
        var width = $("#width_field").val();

        if(width != null) getLine(selectedLineIds).options.set("strokeWidth", width);
        getLine(selectedLineIds).options.set("strokeColor", $("#colorpicker2").val());
    });
});
