$(document).ready(function() {
    var amenitiesChecked = {};
  
    $('input[type="checkbox"]').change(function() {
      var amenityId = $(this).data('id');
      var amenityName = $(this).data('name');
  
      if (this.checked) {
        amenitiesChecked[amenityId] = amenityName;
      } else {
        delete amenitiesChecked[amenityId];
      }
  
      var amenitiesList = Object.values(amenitiesChecked).join(', ');
      $('.amenities h4').text(amenitiesList);
    });
  });  