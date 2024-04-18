var map = L.map('map').setView([50.0755, 14.4200], 13); // Praha coordinates

// Použití API zdroje od MapTiler pro dlaždice
L.tileLayer('https://api.maptiler.com/maps/toner-v2-lite/{z}/{x}/{y}.png?key=f4eoSrX6ObTqEuqprnoI', {
    maxZoom: 19,
    attribution: '© MapTiler'
}).addTo(map);

map.zoomControl.setPosition('bottomright');

// Funkce pro přidání pinů z JSON souboru s vlastním stylem
function addPinsFromJSON(jsonUrl) {
    $.getJSON(jsonUrl, function (data) {
        $.each(data, function (key, val) {
            var pin = $('<div class="custom-pin"></div>');
            var pinColor = getPinColor(val.color);
            pin.addClass(pinColor + '-pin');
            var marker = L.marker([val.lat, val.lon], {icon: L.divIcon({className: 'leaflet-div-icon', html: pin[0]})}).addTo(map);

            pin.on('click', function(e){
                // Zobrazení informací o pinu ve vaší modální
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

// Zavolejte funkci s cestou k JSON souboru
addPinsFromJSON('locations/pins.json'); // Upravte název souboru a cestu podle potřeby

// Uzavření modálního okna při kliknutí na tlačítko zavřít
$('.close').click(function() {
    $('.modal').css('display', 'none');
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        $('.modal').css('display', 'none');
    }
});

// Uzavření modálního okna při kliknutí mimo něj
$(window).click(function(event) {
    if (event.target == $('.modal')[0]) {
        $('.modal').css('display', 'none');
    }
});

// Filtrace pinů podle barvy
$('.filter-btn').click(function() {
    var color = $(this).data('color');
    if (color === 'all') {
        $('.custom-pin').show();
    } else {
        $('.custom-pin').hide();
        $('.' + color + '-pin').show(); // Filtrace podle třídy odpovídající barvě pinu
    }
});
