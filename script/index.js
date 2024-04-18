var map = L.map('map').setView([50.0755, 14.4200], 13); // Praha coordinates
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

/* puvodni tema*/

/*
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
}).addTo(map);
*/

map.zoomControl.setPosition('bottomright');

// Function to add pins from JSON file with custom pin color
function addPinsFromJSON(jsonUrl) {
    $.getJSON(jsonUrl, function (data) {
        $.each(data, function (key, val) {
          var pin = $('<div class="custom-pin"></div>');
          var pinColor = getPinColor(val.color);
          pin.addClass(pinColor + '-pin');
          var marker = L.marker([val.lat, val.lon], {icon: L.divIcon({className: 'leaflet-div-icon', html: pin[0]})}).addTo(map);

          pin.on('click', function(e){
              //$('#pinTitle').text(val.nazev);
              $('#pinAuthor').text("Author: " + val.autor);
              $('#pinFoudry').text("Foundry: " + val.foundry);
              $('#pinRelease').text("Release: " + val.release);
              $('#pinLocation').text("Place: " + val.misto);
              $('#pinCategory').text("Category: " + val.category);
              $('#pinImage').attr('src', val.image);
              $('#fontImage').attr('src', val.fontimage);
              $('.modal').css('display', 'block');
          });

        });
    });
}

// Funkce pro získání barvy pinu na základě názvu barvy
function getPinColor(colorName) {
    switch (colorName) {
        case 'green':
            return 'green';
        case 'blue':
            return 'blue';
        case 'red':
            return 'red';
        default:
            return 'black'; // Výchozí černá barva, pokud není nalezena žádná shoda
    }
}

// Call the function with the path to JSON file
addPinsFromJSON('/locations/pins.json'); // Change the file name and path as needed

// Close the modal when the close button is clicked
$('.close').click(function() {
    $('.modal').css('display', 'none');
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    $('.modal').css('display', 'none');
  }
});


// Close the modal when the user clicks outside of it
$(window).click(function(event) {
    if (event.target == $('.modal')[0]) {
        $('.modal').css('display', 'none');
    }
});

// Filter pins by color
$('.filter-btn').click(function() {
    var color = $(this).data('color');
    if (color === 'all') {
        $('.custom-pin').show();
    } else {
        $('.custom-pin').hide();
        $('.' + color + '-pin').show(); // Filtrování podle třídy odpovídající barvě pinu
    }
});
