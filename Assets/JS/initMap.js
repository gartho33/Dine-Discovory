function initialize(){
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(44.5403, -78.5463),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);
   // var marker = new google.maps.Marker({ position: map.center, });

    if(navigator.geolocation){
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
          initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            map.setCenter(initialLocation);

            var marker = new google.maps.Marker({
                position: map.center,
                animation: google.maps.Animation.BOUNCE,
            });
            marker.setMap(map);
            setTimeout(function(){ marker.setAnimation(null); }, 1400);
        }, function(){
            handleNoGeolocation(browserSupportFlag);
        });
    }else{
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }
    function handleNoGeolocation(errorFlag) {
        if (errorFlag == true) {
          alert("Geolocation service failed.");
          initialLocation = newyork;
        } else {
          alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
          initialLocation = siberia;
        }
        map.setCenter(initialLocation);
  }
}
google.maps.event.addDomListener(window, 'load', initialize);