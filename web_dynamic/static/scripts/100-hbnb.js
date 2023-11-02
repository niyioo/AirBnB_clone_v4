$(document).ready(function () {
    // Check the status of the API and update the API status indicator
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  
    // Initialize variables to store checked States and Cities
    const statesChecked = {};
    const citiesChecked = {};
  
    // Listen to changes on each input checkbox tag
    $('input[type="checkbox"]').change(function () {
      const id = $(this).data('id');
      const name = $(this).data('name');
  
      if ($(this).is(':checked')) {
        // Checkbox is checked
        if (name in statesChecked) {
          statesChecked[name].push(id);
        } else {
          statesChecked[name] = [id];
        }
      } else {
        // Checkbox is unchecked
        if (name in statesChecked) {
          const index = statesChecked[name].indexOf(id);
          if (index > -1) {
            statesChecked[name].splice(index, 1);
            if (statesChecked[name].length === 0) {
              delete statesChecked[name];
            }
          }
        }
  
        // Update the h4 tag inside the div Locations with the list of States or Cities checked
        let locationString = '';
        for (const stateName in statesChecked) {
          locationString += `${stateName}: ${statesChecked[stateName].join(', ')}, `;
        }
        for (const cityName in citiesChecked) {
          locationString += `${cityName}: ${citiesChecked[cityName].join(', ')}, `;
        }
        locationString = locationString.slice(0, -2);
        $('div.locations h4').text(locationString);
      }
    });
  
    // Handle the Search button click event
    $('button').click(function () {
      searchPlaces(statesChecked, citiesChecked);
    });
  
    // Fetch places and display them initially
    fetchPlaces();
  });
  
  function fetchPlaces () {
    // Fetch places and display them
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: function (data) {
        displayPlaces(data);
      },
      error: function (error) {
        console.log('Error fetching places:', error);
        $('.places').append('<p>Error fetching places. Please try again later.</p>');
      }
    });
  }
  
  function searchPlaces (states, cities) {
    // Get the list of checked amenities
    const amenitiesChecked = [];
    $('input[type="checkbox"]:checked').each(function () {
      amenitiesChecked.push($(this).data('id'));
    });
  
    // Send a POST request to places_search with the list of checked amenities, States, and Cities
    const searchData = {
      amenities: amenitiesChecked,
      states: states,
      cities: cities
    };
  
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(searchData),
      success: function (data) {
        displayPlaces(data);
      },
      error: function (error) {
        console.log('Error searching places:', error);
        $('.places').append('<p>Error searching places. Please try again later.</p>');
      }
    });
  }
  
  function displayPlaces (places) {
    // Clear the existing places
    $('.places').empty();
  
    if (places.length > 0) {
      $.each(places, function (index, place) {
        const article = '<article>';
        article += '<div class="title_box">';
        article += '<h2>' + place.name + '</h2>';
        article += '<div class="price_by_night">$' + place.price_by_night + '</div>';
        article += '</div>';
        article += '<div class="information">';
        article += '<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>';
        article += '<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>';
        article += '<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>';
        article += '</div>';
        article += '<div class="description">' + place.description + '</div>';
        article += '</article>';
  
        $('.places').append(article);
      });
    } else {
      $('.places').append('<p>No places available.</p>');
    }
  }
  