import {UnminedMapProperties} from "./unmined/unmined.map.properties.js";
import {UnminedRegions} from "./unmined/unmined.map.regions.js";
// import {UnminedPlayers} from "./unmined/unmined.map.players.js";
import {UnminedCustomMarkers} from "./unmined/custom.markers.js";
import {Unmined} from "./unmined/unmined.openlayers.js";

// Global vars
var search_bar = document.getElementById('search');
var search_form = document.getElementById('search-form');
var list = document.getElementById('results-list');
var results_div = document.getElementById('results');
var result_item = document.querySelectorAll('.result-item')
var urlParams = new URLSearchParams(window.location.search);
var queryString = decodeURI(urlParams.get('search'));

search_bar.value = (queryString != "null" ? queryString : '');

// Init the map from the json file
fetch('./data/index.json')
    .then((response) => response.json())
    .then((json) => {
        initMap(json);
});

// Listeners
document.addEventListener("DOMContentLoaded", () => {
    search_bar.addEventListener("keyup", (e) => {
        fetch('./data/index.json')
            .then((response) => response.json())
            .then((json) => {
                autocomplete(json);
        });
    });

    list.addEventListener('click', (e) => {
        if (e.target.classList.contains('result-item')) {
            search_bar.value = e.target.textContent;
            search_form.submit();
        }
    });
});

// Functions

// Init the map from the json file
function initMap(json) {
    var UnminedPlayers = json;
    var UnminedPlayersFiltered = [];
    var center = [0, 0];

    if (UnminedCustomMarkers && UnminedCustomMarkers.isEnabled && UnminedCustomMarkers.markers) {
        UnminedMapProperties.markers = UnminedMapProperties.markers.concat(UnminedCustomMarkers.markers);
    }

    if (UnminedPlayers && queryString) {
        UnminedPlayersFiltered = filterMarkers(UnminedPlayers, queryString);
        if (UnminedPlayersFiltered.length > 0) {
            center = [UnminedPlayersFiltered[0].x, -UnminedPlayersFiltered[0].z];
        }
    }

    let unmined = new Unmined();

    if (UnminedPlayersFiltered.length > 0) {
        UnminedMapProperties.markers = UnminedMapProperties.markers.concat(unmined.createPlayerMarkers(UnminedPlayersFiltered));
    }

    unmined.map('map', UnminedMapProperties, UnminedRegions, center);
}

// Filter the json places file
function filterMarkers(unminedPlayers, str) {
    var output = [];
    var keywords = toSimpleString(str);
        unminedPlayers.forEach(player => {
            var name = toSimpleString(player.name);
            if (name.match(keywords)) {
                output.push(player);
            }
        });
    return output;
}

// Convert a string into a more researchable string
function toSimpleString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace('-', ' ').trim();
}

// Autocomplete searching feature
function autocomplete(places) {
    results_div.style.display = "block";
    var items = "";
    var results = filterMarkers(places, search_bar.value);
    var i = 0;
    const LIMIT = 20;

    if (search_bar.value != "") {
        results.forEach(player => {
            if (i == LIMIT) {
                var reste = results.length - LIMIT;
                items += '<li class="other-results">+ ' + (reste) + ' résultat' + (reste > 1 ? 's' : '') + ' ...</li>';
            }
            if (i < LIMIT) {
                items += '<li class="result-item">' + player.name + '</li>';
            }
            i++;
        });
    } else {
        results_div.style.display = "none";
    }
    list.innerHTML = items;
}