var browserAPIKey = "AIzaSyBFOLAH3N-pqX-S63W_97qKbvgt0TBW1ek";

function initialize(){
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions)
    
    if(navigator.geolocation){
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
          initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        map.setCenter(initialLocation);
        }, function(){
            handleNoGeolocation(browserSupportFlag);
        });
    }else{
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }
    
    var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
    function handleNoGeolocation(errorFlag) {
            if (errorFlag == true) {
              alert("Geolocation service failed.");
              initialLocation = newyork;
            } else {
              alert("Your browser doesn't support geolocation. We've placed you in Newyork.");
              initialLocation = newyork;
            }
            map.setCenter(initialLocation);
      }
    
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: map.center,
        radius: 500,
        types: ['store']
    }, callback);
    
    function callback(results, status){
        if(status === google.maps.places.PlacesServiceStatus.OK){
            $('output').text = results;
            console.log(results);
        }
    }
}
google.maps.event.addDomListener(window, 'load', initialize);