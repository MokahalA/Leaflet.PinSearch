# Leaflet.PinSearch
<div align ="center">

A leaflet plugin for a Search bar with autocomplete on existing pins on the map.

## [**Demo**](https://mokahala.github.io/hosting/Leaflet.PinSearch/index.html)

</div>



### Features

- Autocomplete feature on all pin titles.
- Configurable height and width for the search bar.
- Configurable limit for the maximum number of search results displayed.




### How to install plugin


Option 1: Using npm

```
npm i leaflet.pinsearch
```

Option 2: Using npkg CDN



```
    <link rel="stylesheet" href="https://unpkg.com/leaflet.pinsearch@1.0.0/src/Leaflet.PinSearch.css" crossorigin=""></script>
```

```
    <script src="https://unpkg.com/leaflet.pinsearch@1.0.0/src/Leaflet.PinSearch.js" crossorigin=""></script>

```


### Example usage

See the `example.html` file for sample code.

```
        var map = L.map('map').setView([51.505, -0.09], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 18,
        }).addTo(map);

        // Dummy markers
        L.marker([51.505, -0.09], { title: 'Marker 1' }).addTo(map);
        L.marker([51.51, -0.1], { title: 'Marker 2' }).addTo(map);
        L.marker([51.515, -0.09], { title: 'Marker 3' }).addTo(map);


        // PinSearch component
        var searchBar = L.control.pinSearch({
            position: 'topright',
            placeholder: 'Search...',
            buttonText: 'Search',
            onSearch: function(query) {
                console.log('Search query:', query);
                // Handle the search query here
            },
            searchBarWidth: '200px',
            searchBarHeight: '30px',
            maxSearchResults: 3
        }).addTo(map);
```