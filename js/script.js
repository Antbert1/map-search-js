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

    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(56.013428, -3.393450),
      new google.maps.LatLng(55.866235, -2.962197));
    
    //searchBox.setBounds(defaultBounds);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(defaultBounds);
      searchBox.setBounds(map.getBounds());
    });


    /*List clicking*/
    $( ".listItem" ).click(function() {
      $('.listItem').removeClass('highlighted');
      $(this).addClass('highlighted');
      $('.itemDetails').addClass('hidden');
      $('.placeholder').removeClass('hidden');
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
        case "Homelessness":
          iconToUse = "./images/house.png";
          break;
        case "Women's Services":
          iconToUse = "./images/women.png";
          break;
        case "Food Banks":
          iconToUse = "./images/food.png";
          break;
        case "Advice and Employment":
          iconToUse = "./images/employment.png";
          break;
        case "Community Services":
          iconToUse = "./images/community.png";
          break;
        case "Health and Counselling":
          iconToUse = "./images/health.png";
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
            $('.itemDetails').removeClass('hidden');
            $('.placeholder').addClass('hidden');
            var request = {
                placeId: place.place_id,
                fields: ['name', 'rating', 'formatted_phone_number', 'website', 'formatted_address']
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
                $('.name').text("Name: ");
                $('.resourceName').text(place.name);
                if (place.formatted_address.length > 0) {
                  $('.address').text("Address: ");
                  $('.resourceAddress').text(place.formatted_address);
                }
                if (place.formatted_phone_number.length > 0) {
                  $('.number').text("Phone Number: ");
                  $('.resourceNumber').text(place.formatted_phone_number);
                }
                if (place.website.length > 0) {
                  $('.website').text("Website: ");
                  $('.resourceWebsite').text(place.website);
                  $('.resourceWebsite').attr("href", place.website);
                }
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