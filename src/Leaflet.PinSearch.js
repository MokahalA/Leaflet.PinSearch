L.Control.PinSearch = L.Control.extend({
  options: {
    position: 'topright',
    placeholder: 'Search...',
    buttonText: 'Search',
    onSearch: function(query) {
      console.log('Search query:', query);
    },
    focusOnMarker: true,
    searchBarWidth: '200px',
    searchBarHeight: '30px',
    maxSearchResults: null
  },

  initialize: function(options) {
    L.Util.setOptions(this, options);
    this.markerLabels = [];
  },

  onAdd: function(map) {
    var container = L.DomUtil.create('div', 'leaflet-control-pinsearch');
    var inputContainer = L.DomUtil.create('div', 'search-input-container', container);
    var input = L.DomUtil.create('input', 'search-input', inputContainer);
    input.type = 'text';
    input.placeholder = this.options.placeholder;
    input.style.width = this.options.searchBarWidth;
    input.style.height = this.options.searchBarHeight;

    var searchIcon = L.DomUtil.create('span', 'search-icon', inputContainer);
    searchIcon.innerHTML = '&#128269;';
    searchIcon.style.fontSize = '1.5em'; 

    var resultsContainer = L.DomUtil.create('div', 'search-results', container);
    resultsContainer.style.display = 'none';

    L.DomEvent.on(input, 'input', this._onInputChange, this);
    L.DomEvent.on(input, 'blur', this._onInputBlur, this);
    L.DomEvent.on(input, 'click', this._onInputClick, this);
    L.DomEvent.disableClickPropagation(container);

    this._populateMarkerLabels(map);

    var self = this; 

    input.addEventListener('input', function() {
      var term = input.value.toLowerCase();
      var matches = self.markerLabels.filter(function(label) {
        return label.toLowerCase().includes(term);
      });
      self._showSearchResults(matches);
    });

    input.addEventListener('focus', function() {
      var term = input.value.toLowerCase();
      var matches = self.markerLabels.filter(function(label) {
        return label.toLowerCase().includes(term);
      });
      self._showSearchResults(matches);
    });

    resultsContainer.addEventListener('click', function(event) {
      var item = event.target;
      var query = item.textContent;
      self._onSearchItemClick(query);
    });

    document.addEventListener('click', this._onDocumentClick.bind(this));

    return container;
  },

  _populateMarkerLabels: function(map) {
    this.markerLabels = [];
    map.eachLayer(function(layer) {
      if (layer instanceof L.Marker && layer.options.title) {
        this.markerLabels.push(layer.options.title);
      }
    }, this);
  },

  _onInputChange: function(event) {
    var input = event.target;
    var term = input.value.toLowerCase();
    var matches = this.markerLabels.filter(function(label) {
      return label.toLowerCase().includes(term);
    });
    this._showSearchResults(matches);
  },

  _onInputBlur: function(event) {
    var input = event.target;
    var container = input.parentNode;
    var resultsContainer = container.querySelector('.search-results');
    
    // Delay hiding the results to allow clicking on them
    setTimeout(function() {
      if (resultsContainer && resultsContainer.parentNode === container && !container.contains(document.activeElement)) {
        resultsContainer.style.display = 'none';
      }
    }, 200);
  },

  _onInputClick: function(event) {
    var input = event.target;
    var term = input.value.toLowerCase();
    var matches = this.markerLabels.filter(function(label) {
      return label.toLowerCase().includes(term);
    });
    this._showSearchResults(matches);
  },

  _onDocumentClick: function(event) {
    var container = this._container;
    var resultsContainer = container.querySelector('.search-results');
    if (resultsContainer && resultsContainer.style.display === 'block' && !container.contains(event.target)) {
      resultsContainer.style.display = 'none';
    }
  },

  _showSearchResults: function(matches) {
    var resultsContainer = this._container.querySelector('.search-results');
    resultsContainer.innerHTML = '';

    if (matches.length > 0) {
      var maxResults = this.options.maxSearchResults;
      if (maxResults && matches.length > maxResults) {
        matches = matches.slice(0, maxResults);
      }

      matches.forEach(function(match) {
        var item = document.createElement('div');
        item.className = 'search-results-item';
        item.textContent = match;
        resultsContainer.appendChild(item);
      });
      resultsContainer.style.display = 'block';
    } else {
      resultsContainer.style.display = 'none';
    }
  },

  _onSearchItemClick: function(query) {
    var input = this._container.querySelector('.search-input');
    input.value = query;
    this.options.onSearch(query);

    if (this.options.focusOnMarker) {
      var marker = this._findMarkerByTitle(query);
      if (marker) {
        this._map.panTo(marker.getLatLng());
      }
    }
  },

  _findMarkerByTitle: function(title) {
    var marker = null;
    this._map.eachLayer(function(layer) {
      if (layer instanceof L.Marker && layer.options.title === title) {
        marker = layer;
      }
    });
    return marker;
  }
});

L.control.pinSearch = function(options) {
  return new L.Control.PinSearch(options);
};