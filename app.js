let SaveArea = null;
let PreviewMarker = null;
let lt = null;
let ln = null ;
let saveLocation = JSON.parse(localStorage.getItem("areas")) || [];
let weatherInfomartion = document.getElementById("weatherInformation")
const map = L.map("map",{
    center: [-25.7479, 28.2293], 
    zoom: 10,
    preferCanvas: true,
    zoomSnap: 1,
});

// Add OpenStreetMap tile layer at the bottem right of map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
}).addTo(map);

map.on("click", function (e) {
    lt = e.latlng.lat;
    ln = e.latlng.lng;

    // Remove previous marker if it exists
    if (PreviewMarker != null) {
        map.removeLayer(PreviewMarker)
    }
    // Create new marker
    PreviewMarker = L.marker([lt, ln]).addTo(map);  
});

function selectArea()
{   
    firstTime = false;
    if (lt === null || ln === null)    
        {
            return
        }

    SaveArea = {lt: lt,ln:ln}
    saveLocation.push(SaveArea) 
    localStorage.setItem("areas",JSON.stringify(saveLocation))
    weatherdata(lt,ln);
    window.location.reload();
};

// Fetch weather data for a given location
async function weatherdata(lat,lon) {
    try 
    {
       const responses = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`)    
        
        if (!responses.ok) {
            throw new Error("not found");
            
        }
        const data = await responses.json();
        return data;
      } 
    catch (error) {
        console.error(error);
    }
}

async function ShowAllLocations(){
    if (saveLocation.length === 0)
        {   
            console.log("hello");
            const div = document.createElement("div");
            div.setAttribute('id','welcomeMessage')
            div.innerHTML = '<h1>Welcome!</h1><p>To get started select a area on the map and press the button save Location in order to choose that location.<br>Once you have saved a location, the weather information will be displayed here. You can also delete your saved locations at any time.</p>';
            weatherInfomartion.appendChild(div)
        }
        else{

    weatherInfomartion.innerHTML = "";
    for (let locataion of saveLocation)
        {
            let data = await weatherdata(locataion.lt,locataion.ln)
            const div = document.createElement("div");
            div.setAttribute('class','LocCard')

            div.innerHTML = `
            <h2>Location ${saveLocation.indexOf(locataion) + 1}</h2>
            <p>Temperature: ${data.current.temperature_2m} °C</p>
            <p>Humidity: ${data.current.relative_humidity_2m} %</p>
            <p>Wind: ${data.current.wind_speed_10m} km/h</p>

            <button onclick="deleteLocation(${locataion.lt}, ${locataion.ln})" id="deleteBtn">Delete</button>
            `;
    
        weatherInfomartion.appendChild(div)
    }}
}
window.addEventListener("DOMContentLoaded", async function () {
    await ShowAllLocations();
});


function deleteLocation(lat, lon) {
    // Filter out the location to be deleted
    saveLocation = saveLocation.filter(location => !(location.lt === lat && location.ln === lon));
    localStorage.setItem("areas", JSON.stringify(saveLocation));
    window.location.reload();
}