var browserAPIKey = "AIzaSyBFOLAH3N-pqX-S63W_97qKbvgt0TBW1ek";
var infoWindow;
var map, service;

function initialize(){
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(mapCanvas, mapOptions);
    infoWindow = new google.maps.InfoWindow();
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
        var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
            if (errorFlag == true) {
              alert("Geolocation service failed.");
              initialLocation = newyork;
            } else {
              alert("Your browser doesn't support geolocation. We've placed you in Newyork.");
              initialLocation = newyork;
            }
            map.setCenter(initialLocation);
      }
    
    service = new google.maps.places.PlacesService(map);    
};

//test function/ may have to change later
function TestSearch(){
    var request = {
        location: map.center, //center point to look around.
        radius: 500, //range to look (apears to be meters)
        query: 'italian restaurant'//text search, can limit with dropdown options.
    }; 
    service.textSearch(request, callback);
};

function search(){
    //use this method to build the needed quary and collect response
    /****** FORMAT ********
    var request = { <<<<<< this is what needs to be built <<<<<<<
        location: location, 
        radius: [RANGE EX: 500], 
        query: [KEYWORDS EX: "Mexican"]
    }; 
    service.textSearch(request, callback);
    **********/
}

//parse the results of any query
function callback(results, status){
    if(status === google.maps.places.PlacesServiceStatus.OK){
        console.log(results);
        if(status === google.maps.places.PlacesServiceStatus.OK){
            for (var i=0; i<results.length; i++){
                CreateMarker(results[i]);
            }
        }
    }
}

function CreateMarker(place){
        var icon = {
            url: place.icon,
            size: new google.maps.Size(25, 25),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };
        
         var marker = new google.maps.Marker({
             map: map,
             icon: icon,
             position: place.geometry.location
         });
        //populate the info window
        google.maps.event.addListener(marker, 'mouseover', function(){
            infoWindow.setContent(place.name);
            infoWindow.open(map, this);
        });
        google.maps.event.addListener(marker, 'mouseout', function(){
            infoWindow.close();
        });
    }

google.maps.event.addDomListener(window, 'load', initialize);