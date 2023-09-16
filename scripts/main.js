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
var settings = document.getElementById('settings');
var settings_btn = document.getElementById('settings_btn');
var settings_open = false;
var all = document.getElementById('all');
var urlParams = new URLSearchParams(window.location.search);
var search_get = decodeURI(urlParams.get('search'));
var all_get = decodeURI(urlParams.get('all'));

search_bar.value = (search_get != "null" ? search_get : '');
document.title = (search_get != "null" && search_get != '' ? '"' + search_get + '"' : 'Alphadia') + ' - ' + document.title;
all.checked = (all_get == "on" ? true : false);

// Init the map from the json file
fetch('./data/index.json')
    .then((response) => response.json())
    .then((json) => {
        initMap(json);
});

// Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Autocomplete search when typing keyboard
    search_bar.addEventListener("keyup", () => {
        fetch('./data/index.json')
            .then((response) => response.json())
            .then((json) => {
                autocomplete(json);
        });
    });

    // Click on a autocomplete card
    list.addEventListener('click', (e) => {
        if (e.target.classList.contains('result-item')) {
            search_bar.value = e.target.textContent;
            search_form.submit();
        }
    });

    settings_btn.addEventListener('click', () => {
        toogleSettingsMenu();
    });

    // Click on 
});

/****************************
*        FUNCTIONS
****************************/

// Init the map from the json file
function initMap(json) {
    var UnminedPlayers = json;
    var UnminedPlayersFiltered = [];
    var center = [0, 0];

    if (UnminedCustomMarkers && UnminedCustomMarkers.isEnabled && UnminedCustomMarkers.markers) {
        UnminedMapProperties.markers = UnminedMapProperties.markers.concat(UnminedCustomMarkers.markers);
    }

    if (UnminedPlayers) {
        UnminedPlayersFiltered = filterMarkers(UnminedPlayers, search_get);
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
        if ((all_get == 'on' && str == '') || (name.match(escapeRegExp(keywords)) && str != '')) {
            output.push(player);
        }
    });
    return output;
}

// Convert a string into a more researchable string
function toSimpleString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace('-', ' ').trim();
}

// Convert a string suitable with regex syntax
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
  
// Autocomplete searching feature
function autocomplete(places) {
    results_div.style.display = "block";
    toogleSettingsMenu(false);

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

function toogleSettingsMenu(force = "none") {
    if (force == "none") {
        if (settings_open) {
            settings.style.display = "none";
            settings_btn.textContent = "\uD83D\uDCCC Avancé";
        } else {
            results_div.style.display = "none";
            settings.style.display = "block";
            settings_btn.textContent = "\u274C Fermer";
        }
        settings_open = !settings_open;
    } else {
        if (force) {
            results_div.style.display = "none";
            settings.style.display = "block";
            settings_btn.textContent = "\u274C Fermer";
        } else {
            settings.style.display = "none";
            settings_btn.textContent = "\uD83D\uDCCC Avancé";
        }
        settings_open = force;
    }
}