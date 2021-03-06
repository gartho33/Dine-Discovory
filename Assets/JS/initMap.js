
var browserAPIKey = "AIzaSyBFOLAH3N-pqX-S63W_97qKbvgt0TBW1ek";
var infoWindow, map, service, markers = [], destination,
    directionsService = new google.maps.DirectionsService,
    directionsDisplay = new google.maps.DirectionsRenderer;

function initialize(){
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        zoom: 15,
        panControl:true,
        zoomControl:true,
        mapTypeControl:true,
        scaleControl:true,
        streetViewControl:true,
        overviewMapControl:true,
        rotateControl:true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(mapCanvas, mapOptions);
    infoWindow = new google.maps.InfoWindow();
    directionsDisplay.setMap(map);    
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
    ClearMarkers();
    var request = {
        location: map.center, //center point to look around.
        radius: 500, //range to look (apears to be meters)
        query: 'italian restaurant'//text search, can limit with dropdown options.
    }; 
    service.textSearch(request, callback);
};

function search(){
    //use this method to build the needed query and collect response
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
        if(status === google.maps.places.PlacesServiceStatus.OK){
            //parseAllResults(results);
            RandomPick(results);
        }
    }
};

function parseAllResults(results){
    for (var i=0; i<results.length; i++){
        CreateMarker(results[i]);
    }
};

function RandomPick(results){
    var index = Math.floor(Math.random()*results.length);
    console.log(results[index]);
    destination = results[index].formatted_address;
    CreateMarker(results[index]);
    $('#response').show();

    $('#accept').on('click', function(){
        onChangeHandler();
        $('#response').hide();
    });
    $('#decline').on('click', function(){
        $('#visited').show();
        $('#accept').prop('disabled', true);
        $('#decline').prop('disabled', true);

        $('#yes').on('click', function(){
            $('#ignore').show();
            //Add place to favorites
        });
        $('#no').on('click', function(){
            $('#response').hide();
            $('#revisit').show();
            setTimeout(function(){
                $('#revisit').hide();
                resetResponse();
                TestSearch();
            }, 3000);
        });
    });

};

function resetResponse(){
    $('#visited').hide();
    $('#accept').prop('disabled', false);
    $('#decline').prop('disabled', false);
};

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
        markers.push(marker);
        //populate the info window
        google.maps.event.addListener(marker, 'click', function(){
            var info = BuildInfowindow(place);
            infoWindow.setContent(info);
            infoWindow.open(map, this);
        });

        //show the infoWindow by default, rather than mouseover
        var info = BuildInfowindow(place);
        infoWindow.setContent(info);
        infoWindow.open(map, marker);

        //google.maps.event.addListener(marker, 'mouseout', function(){
        //    infoWindow.close();
        //});
    };

function BuildInfowindow(place){
    var info = "";
    info += "<h1>"+place.name+"</h1>";
    info += "<p>"+place.formatted_address+"</p>";
    info += place.opening_hours.open_now ? "Open" : "Closed";

    return info;
};

function ClearMarkers(){
    markers.forEach(function(marker){
         marker.setMap(null);
    });
    markers = [];
};

function onChangeHandler(){
    calculateAndDisplayRoute(directionsService, directionsDisplay);
};

function calculateAndDisplayRoute(directionsService, directionsDisplay){
    directionsService.route({
        origin: initialLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status){
        if (status === google.maps.DirectionsStatus.OK){
            directionsDisplay.setDirections(response);
        }else{
            window.alert("Directions could not be displayed.")
        }
    });
};

$("#ClearBtn").on('click', function(){
        ClearMarkers();
    });

google.maps.event.addDomListener(window, 'load', initialize);