const map = L.map("map").setView([-25.7479, 28.2293], 10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
}).addTo(map);


let SaveArea = null;
let PreviewCircle = null;
let lt = null;
let ln = null ;
let saveLocation = JSON.parse(localStorage.getItem("saveLocation")) || [];

map.on("click", function (e) {
    lt = e.latlng.lat;
    ln = e.latlng.lng;

    if (PreviewCircle != null) {
        map.removeLayer(PreviewCircle)
    }
    // Create new circle
    PreviewCircle = L.marker([lt, ln]).addTo(map);  
});

function selectArea()
{

if (lt === null || ln === null) {
    return
}

SaveArea = {lt: lt,ln:ln}
saveLocation.push(SaveArea) 
localStorage.setItem("areas",JSON.stringify(saveLocation))

let infocards = document.createElement('div')
let weatherInfomartion = document.getElementById("weatherInformation")
weatherdata(lt,ln);

ShowAllLocations()
};

async function weatherdata(lat,lon) {
    try 
    {
       const responses = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`)    
        
        if (!responses.ok) {
            throw new Error("not found");
            
        }
        const data = await responses.json();
        console.log(data);
        return data;
      } 
    catch (error) {
        console.error(error);
    }
}

async function ShowAllLocations(){
    let AllLocation = document.getElementById("weatherInformation")
    AllLocation.innerHTML = "";
    for (let locataion of saveLocation)
        {
            let data = await weatherdata(locataion.lt,locataion.ln)
            console.log(data);
            const div = document.createElement("div");
            div.setAttribute('class','LocCard')

            div.innerHTML = `
            <h2>Weather Area</h2>
            <p>Temperature: ${data.current.temperature_2m} °C</p>
            <p>Humidity: ${data.current.relative_humidity_2m} %</p>
            <p>Wind: ${data.current.wind_speed_10m} km/h</p>
            `;
    
        AllLocation.appendChild(div)
    }



}