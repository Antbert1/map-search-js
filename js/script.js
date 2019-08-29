// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 55.954093, lng: -3.188200},
      zoom: 13,
      mapTypeId: 'roadmap'
    });
  
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });


    /*List clicking*/
    $( ".listItem" ).click(function() {
      
      searchTerm = this.innerText;
      $(input).val(searchTerm);
      google.maps.event.trigger(input, 'focus', {});
      google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
      google.maps.event.trigger(this, 'focus', {});
      //searchMap(searchTerm);
      
    }); 

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);


  
    // service.getDetails(request, function(place, status) {
    //   if (status === google.maps.places.PlacesServiceStatus.OK) {
    //     var marker = new google.maps.Marker({
    //       map: map,
    //       position: place.geometry.location
    //     });
    //     google.maps.event.addListener(marker, 'click', function() {
    //       infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
    //         'Place ID: ' + place.place_id + '<br>' +
    //         place.formatted_address + '</div>');
    //       infowindow.open(map, this);
    //     });
    //   }
    // });



  
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.



    searchBox.addListener('places_changed', searchMap.bind(this, "textBox"));

    function searchMap(test) {
      debugger;
      var places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);


      });
      markers = [];
  

      var iconToUse;
      switch(searchTerm) {
        case "Homeless":
          iconToUse = "./images/house.png";
          break;
        case "Women's Shelter":
          iconToUse = "./images/women.png";
          break;
        default:
          iconToUse = "./images/testIcon.png";
      }
      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: iconToUse,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
        
        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          })

          google.maps.event.addListener(marker, 'click', function(event) {
            var request = {
                placeId: place.place_id,
                fields: ['name', 'rating', 'formatted_phone_number', 'website']
              };

              service = new google.maps.places.PlacesService(map);
              service.getDetails(request, callback);

              
              function callback(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                    'Name: ' + place.name + '<br>' +
                    'Website: ' + place.website + '<br>' +
                    place.formatted_phone_number + '</div>');
                    infowindow.setPosition(event.latLng);
                    infowindow.open(map);                 
                }
                $('.resourceName').text(place.name);
              }

              function showInfo(place) {

              }

              
            
          });
        // Create a marker for each place.
        markers.push(marker);



        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });


      map.fitBounds(bounds);
    }
  }