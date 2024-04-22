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

    resultsContainer.addEventListener('keydown', function(event) {
      self._onResultsItemKeydown(event);
    });

    document.addEventListener('keyup', function(event) {
      self._onDocumentKeyup(event);
    });

    return container;
  },

  _populateMarkerLabels: function(map) {
    this.markerLabels = [];
    map.eachLayer(function(layer) {
      if (layer instanceof L.Marker && layer.options.title) {
        this.markerLabels.push(layer.options.title);
      } else if (typeof L.MarkerCluster !== 'undefined' && layer instanceof L.MarkerCluster) {
        // Use getAllChildMarkers to get all markers in the cluster, and add their titles to the list
        layer.getAllChildMarkers().forEach((child) => {
          if (child instanceof L.Marker && child.options.title) {
            this.markerLabels.push(child.options.title);
          }
        });
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

  _onResultsItemKeydown: function(event) {
    var key = event.key;
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();

      var items = this._container.querySelectorAll('.search-results-item');
      var highlightedItem = this._container.querySelector('.search-results-item.highlight');
      var currentIndex = highlightedItem ? Array.from(items).indexOf(highlightedItem) : -1;

      if (key === 'ArrowUp' && currentIndex > 0) {
        currentIndex--;
      } else if (key === 'ArrowDown' && currentIndex < items.length - 1) {
        currentIndex++;
      }

      if (highlightedItem) {
        highlightedItem.classList.remove('highlight');
      }

      var currentItem = items[currentIndex];
      currentItem.classList.add('highlight');
      currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      currentItem.focus(); // Set focus to the highlighted item
    } else if (key === 'Enter') {
      var highlightedItem = this._container.querySelector('.search-results-item.highlight');
      if (highlightedItem) {
        var query = highlightedItem.textContent;
        console.log(query);
        this._onSearchItemClick(query);
      }
    }
  },

  _onDocumentKeyup: function(event) {
    var container = this._container;
    var resultsContainer = container.querySelector('.search-results');
    var input = container.querySelector('.search-input');
    
    if (event.key === 'Escape') {
      if (resultsContainer.style.display === 'block') {
        resultsContainer.style.display = 'none';
      } else {
        input.value = '';
      }
      
      input.focus();
      return;
    }
    
    if (resultsContainer && resultsContainer.style.display === 'block' && container.contains(document.activeElement)) {
      var key = event.key;
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault();
  
        var items = resultsContainer.querySelectorAll('.search-results-item');
        var highlightedItem = resultsContainer.querySelector('.search-results-item.highlight');
        var currentIndex = highlightedItem ? Array.from(items).indexOf(highlightedItem) : -1;
  
        if (key === 'ArrowUp' && currentIndex > 0) {
          currentIndex--;
        } else if (key === 'ArrowDown' && currentIndex < items.length - 1) {
          currentIndex++;
        }
  
        if (highlightedItem) {
          highlightedItem.classList.remove('highlight');
        }
  
        var currentItem = items[currentIndex];
        currentItem.classList.add('highlight');
        currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        currentItem.focus(); // Set focus to the highlighted item
      } else if (key === 'Enter') {
        var highlightedItem = resultsContainer.querySelector('.search-results-item.highlight');
        if (highlightedItem) {
          var query = highlightedItem.textContent;
          console.log(query);
          this._onSearchItemClick(query);
        }
      }
    }
  },
  
  _showSearchResults: function(matches) {
    var self = this;
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
        item.addEventListener('click', function() {
          self._onSearchItemClick(match);
          resultsContainer.style.display = 'none'; // Hide results after clicking on an item
        });
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