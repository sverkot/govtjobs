var markers = [];
var address;

var locations = [];


function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {
            lat: 37.09024,
            lng: -100.712891
        }
    });

    var geocoder = new google.maps.Geocoder();

    document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });
}

function setupLocations(resultsMap, infowindow) {

    for (var locind in locations) {
        var loc = locations[locind];
        marker = new google.maps.Marker({
            map: resultsMap,
            position: loc.position,
            title: loc.address,
            html: '<div>' +
                '<h1>' + loc.orgName + '</h1>' +
                '<h3>' + loc.address + '</h3>' +
                '<p>' + loc.jobTitle + '</p>' +
                '</div>'
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.html);
            infowindow.open(resultsMap, this);
        });
    }

}

function geocodeAddress(geocoder, resultsMap) {
    var infowindow = new google.maps.InfoWindow();

    var url = 'https://api.usa.gov/jobs/search.json?size=11&query=nursing+jobs';

    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(parsed_json) {

            var orgName = [];
            var location = [];

            var processed = 0;
            $.each(parsed_json, function(i, results) {
                address = results['locations'][0];
                console.log(address);
                orgName = results['organization_name'];
                jobTitle = results['position_title'];

                locations[i] = {
                    'address': address,
                    'orgName': orgName,
                    'jobTitle': jobTitle
                }

                geocoder.geocode({
                    'address': address,
                }, function(result, status) {

                    if (status === 'OK') {
                        locations[i].position = result[0].geometry.location;
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                    if (++processed >= locations.length) {
                        setupLocations(resultsMap, infowindow);
                    }
                });
            });
        }
    });
}
