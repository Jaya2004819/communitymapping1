let map;
let markers = [];
let geocoder;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20.5937, lng: 78.9629 }, // Centered on India
        zoom: 5,
    });
    
    geocoder = new google.maps.Geocoder();

    google.maps.event.addListener(map, "click", function (event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        getLocationData(lat, lng);
    });
}

document.getElementById('get-location').addEventListener('click', function() {
    const location = document.getElementById('location').value;
    geocodeLocation(location);
});

function geocodeLocation(location) {
    geocoder.geocode({ address: location }, function(results, status) {
        if (status === "OK") {
            const latLng = results[0].geometry.location;
            map.setCenter(latLng);
            addMarker(latLng);
            getLocationData(latLng.lat(), latLng.lng());
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    markers.push(marker);
}

function getLocationData(lat, lng) {
    // Here you would ideally fetch real data based on lat/lng.
    // For demonstration, we'll use static data.
    const data = {
        population: Math.floor(Math.random() * 1000000),
        temperature: Math.floor(Math.random() * 30) + 10,
        climate: "Tropical",
    };

    document.getElementById("info").innerHTML = `
        <h3>Location Data</h3>
        <p>Population: ${data.population}</p>
        <p>Temperature: ${data.temperature} °C</p>
        <p>Climate: ${data.climate}</p>
    `;
}

document.getElementById('calculate-distance').addEventListener('click', function() {
    const start = document.getElementById('start-location').value;
    const end = document.getElementById('end-location').value;
    calculateDistance(start, end);
});

function calculateDistance(start, end) {
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [start],
            destinations: [end],
            travelMode: google.maps.TravelMode.DRIVING,
        },
        function(response, status) {
            if (status === "OK") {
                const distance = response.rows[0].elements[0].distance.text;
                document.getElementById('distance-result').innerHTML = `Distance: ${distance}`;
            } else {
                alert("Error: " + status);
            }
        }
    );
}

document.getElementById('translate-button').addEventListener('click', function() {
    const language = document.getElementById('language-select').value;
    translateLocation(language);
});

function translateLocation(language) {
    const locationName = document.getElementById('location').value;
    const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(locationName)}`;

    fetch(translateUrl)
        .then(response => response.json())
        .then(data => {
            const translatedText = data[0][0][0];
            alert(`Translated Location: ${translatedText}`);
        })
        .catch(error => console.error('Error:', error));
}
