// create div element with class
function createDivElement(classname) {
    let ele = document.createElement("div");
    ele.className = classname;
    return ele;
}

async function getIPAddress() {
    try {
        const response = await fetch('https://api.techniknews.net/ipgeo/');
        const data = await response.json();
        return data;
    } 
    catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
}

async function getWeatherData(lon, lat) {
    try { 
        const response = await fetch(`https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`);
        const data = await response.json();
        return data;
    } 
    catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
}

// format date from  yyyyMMdd to dd/MM/yyyy
function formatDate(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${day}/${month}/${year}`;
}



function createFooter() {
    const footer = document.createElement("footer");
    footer.textContent = "Image Credits to www.freepik.com";
    document.body.appendChild(footer);
}


const weatherConditions = {
    clear: ["sunny", "Clear"],
    lightrain: ["lightRain", "Light Rain"],
    pcloudy: ["partlycloudy", "Partly Cloudy"],
    mcloudy: ["veryCloudy", "Very Cloudy"],
    cloudy: ["Cloudy", "Cloudy"],
    humid: ["humid","Foggy"],
    oshower: ["oc", "Occasional Showers"],
    ishower: ["oc", "Isolated Showers"],
    lightsnow: ["lightSnow", "Light or Occasional snow"],
    rain: ["lightRain", "Rain"],
    snow: ["snow", "Snow"],
    rainsnow: ["rainSnowMix", "Mixed Snow and Rain"],
    ts: ["tsp","Thunderstorm possible"],
    tsrain: ["ts", "Thunderstorm"]
};

// Default
let lon = 113.17;
let lat = 23.09;
let country = "";
let city = "";



// Show the weather info
function displayWeatherInfo() {
    const cardsContainer = document.getElementById("weatherBox");
    // Display weather data for given geo location
    const weather7Days = getWeatherData(lon, lat);
    weather7Days.then(keys=>{
        keys.dataseries.forEach(element => {
            // Destructure the results
            let weatherdesc=weatherConditions[element.weather][1];
            let weatherimg=weatherConditions[element.weather][0];
            let tempMax=element.temp2m.max;
            let tempMin=element.temp2m.min;
            let date = formatDate(element.date.toString());
            
            // Creat card elment, body, para and img
            let cardDiv = createDivElement('card col-md-4 mb-3 mr-3');
            
            let cardImg = document.createElement("img");
            cardImg.setAttribute("src", `img/${weatherimg}.png`);

            let cardBodyDiv = createDivElement('card-body');
            let title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = date;
    
            let weatherDescPara = document.createElement('p');
            weatherDescPara.className = 'card-text';
            weatherDescPara.textContent = weatherdesc;
    
            let tempRangePara = document.createElement('p');
            tempRangePara.className = 'card-text';
            tempRangePara.textContent = `Temperature: ${tempMin}°C - ${tempMax}°C`;
    
            cardBodyDiv.append(title, weatherDescPara, tempRangePara);
            cardDiv.append(cardImg, cardBodyDiv);
            cardsContainer.appendChild(cardDiv);
        });
    })
}

// wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const container = createDivElement("container mt-2");
    const row = createDivElement("row");
    row.id = "weatherBox";
    row.style = "justify-content: center";

    // Get geo location based on IP
    getIPAddress().then(ipInfo => {
        lat = ipInfo.lat;
        lon = ipInfo.lon;
        country = ipInfo.country;
        city = ipInfo.city;
        title = createDivElement("title col-md-12 mb-2");
        title.innerHTML = `<h4>Weather Information: ${country}, ${city}</h4>`;
        title.id = "title";
        row.appendChild(title);
        displayWeatherInfo();
    });
    
    container.appendChild(row);
    document.body.appendChild(container);

    // displayWeatherInfo();

    createFooter();
});
