<div align ="center">

# Leaflet.PinSearch

[![npm version](https://badge.fury.io/js/leaflet.pinsearch.svg)](https://badge.fury.io/js/leaflet.pinsearch)
![Static Badge](https://img.shields.io/npm/dt/leaflet.pinsearch)

A leaflet plugin for a Search bar component with autocomplete on all existing pins on the map.

### [**Demo**](https://mokahala.github.io/hosting/Leaflet.PinSearch/index.html)

</div>



### Features

- Autocomplete feature on all pin titles.
- Configurable height and width for the search bar.
- Configurable limit for the maximum number of search results displayed.


### How to install the plugin


Install using npm

```
npm i leaflet.pinsearch
```

Include files using npkg CDN

```
<link rel="stylesheet" href="https://unpkg.com/leaflet.pinsearch/src/Leaflet.PinSearch.css" crossorigin=""></script>
```

```
<script src="https://unpkg.com/leaflet.pinsearch/src/Leaflet.PinSearch.js" crossorigin=""></script>
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

### `pinSearch` options


Option                        | Description
------------------------------| ------------
`position`                    | Places the search control according to one of the following options: `topleft`, `topright`, `bottomleft`, `bottomright`
`placeholder`                 | Placeholder text inside the search input.
`buttonText`                  | Set this to `"Search"`
`onSearch`                    | Function to handle the search query, the selected result is stored as `query`
`searchBarWidth`              | Width of the search control (e.g. `200px`)
`searchBarHeight`             | Height of the search control (e.g. `30px`)
`maxSearchResults`            | Maximum amount of results to be shown by the autocomplete.