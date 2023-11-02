$(document).ready(function() {
    // Check the status of the API and update the API status indicator
    $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  
    // Fetch places and display them initially
    fetchPlaces();
  
    // Handle the Search button click event
    $('button').click(function() {
      searchPlaces();
    });
  });
  
  function fetchPlaces() {
    // Fetch places and display them
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: function(data) {
        displayPlaces(data);
      },
      error: function(error) {
        console.log('Error fetching places:', error);
        $('.places').append('<p>Error fetching places. Please try again later.</p>');
      }
    });
  }
  
  function searchPlaces() {
    // Get the list of checked amenities
    var amenitiesChecked = [];
    $('input[type="checkbox"]:checked').each(function() {
      amenitiesChecked.push($(this).data('id'));
    });
  
    // Send a POST request to places_search with the list of checked amenities
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: amenitiesChecked }),
      success: function(data) {
        displayPlaces(data);
      },
      error: function(error) {
        console.log('Error searching places:', error);
        $('.places').append('<p>Error searching places. Please try again later.</p>');
      }
    });
  }
  
  function displayPlaces(places) {
    // Clear the existing places
    $('.places').empty();
  
    if (places.length > 0) {
      $.each(places, function(index, place) {
        var article = '<article>';
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
  