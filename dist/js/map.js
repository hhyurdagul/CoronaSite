var myMap = L.map('mapid').setView([51.505, -0.09], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYnl0ZXdhaXNlciIsImEiOiJjazh5ajBqcXUwYmkyM2VvZ3dpaW94MzJlIn0.H8chRrMn1K9BjS_aJqsw1g'
}).addTo(myMap);

const mainUrl = "https://corona.lmao.ninja/v2/countries";

let toRemove = [];

function clearMap(){
    myMap.eachLayer(layer => {
        if(toRemove.includes(layer._leaflet_id)){
            layer.remove();
        }
    });
    toRemove = [];
}

async function getData(url){
    let a = await fetch(url);
    let json = await a.json();
    return json;
};

async function drawRecovered(){
    clearMap();
    let json = await getData(mainUrl);
    json.forEach(async (i) => {
        let data = await getData(`${mainUrl}/${i.country}`);
        let circle = L.circle([data.countryInfo.lat, data.countryInfo.long], {
            color: "green",
            opacity: 0.8,
            fillColor: "green",
            fillOpacity: 0.8,
            radius: data.recovered
        }).addTo(myMap);
        circle.bindPopup(`${data.country} <img src="${data.countryInfo.flag}" width=20px><br>Recovered: ${data.recovered}`);
        toRemove.push(circle._leaflet_id);
    });
}

async function drawActive(){
    clearMap();
    let json = await getData(mainUrl);
    json.forEach(async (i) => {
        let data = await getData(`${mainUrl}/${i.country}`);
        let circle = L.circle([data.countryInfo.lat, data.countryInfo.long], {
            color: "blue",
            opacity: 0.8,
            fillColor: "blue",
            fillOpacity: 0.8,
            radius: data.active
        }).addTo(myMap);
        circle.bindPopup(`${data.country} <img src="${data.countryInfo.flag}" width=20px><br>Active: ${data.active}`);
        toRemove.push(circle._leaflet_id);
    })
}

async function drawDeaths(){
    clearMap();
    let json = await getData(mainUrl);
    json.forEach(async (i) => {
        let data = await getData(`${mainUrl}/${i.country}`);
        let circle = L.circle([data.countryInfo.lat, data.countryInfo.long], {
            color: "red",
            opacity: 0.8,
            fillColor: "red",
            fillOpacity: 0.8,
            radius: data.deaths
        }).addTo(myMap);
        circle.bindPopup(`${data.country} <img src="${data.countryInfo.flag}" width=20px><br>Deaths: ${data.deaths}`);
        toRemove.push(circle._leaflet_id);
    });
}
