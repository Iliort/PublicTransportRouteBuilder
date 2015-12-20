/**
 * Created by IGOLOD on 20.12.2015.
 */
(function() {
    //var init;
    //
    //ymaps.ready(init);
    //
    //init = function() {
    //    var map;
    //    map = new ymaps.Map("map", {
    //        center: [57.5262, 38.3061],
    //        zoom: 7
    //    });
    //};

    ymaps.ready(init);
    var myMap;

    var init = function (){
        myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 7
        });
    }

}).call(this);
