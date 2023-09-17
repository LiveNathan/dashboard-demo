const root = document.getElementById('root');

// function objectToString(obj) {
//     if (typeof obj !== 'object' || Array.isArray(obj)) {
//         throw new Error('Provided argument is not an object');
//     }
//
//     for (let key in obj) {
//         if (typeof obj[key] === 'object' && obj[key] !== null) {
//             throw new Error('Nested objects are not allowed');
//         }
//     }
//
//     return new URLSearchParams(obj).toString();
// }
//
// function stringToObject(query) {
//     const params = new URLSearchParams(query);
//     const obj = {};
//     for (let [key, value] of params.entries()) {
//         obj[key] = value;
//     }
//     return obj;
// }

function createElementAndAppend({parentElement, elementType, elementId = '', classNames = '', textVal = ''}) {
    const newElement = document.createElement(elementType);
    newElement.id = elementId;
    newElement.className = classNames;
    newElement.innerText = textVal;
    parentElement.appendChild(newElement);
    return newElement;
}

async function getIpStack() {
    try {
        const IPSTACK_ACCESS_KEY = "315c943e1895202bbf4fc8129849e4b4";
        let ipstackResponse = await fetch("http://api.ipstack.com/check?output=json&access_key=" + IPSTACK_ACCESS_KEY);
        let ipstackData = await ipstackResponse.json();
        console.log(ipstackData);

        // let ip = ipstackData.ip;
        // let country = ipstackData.country_name;
        // let countryCode = ipstackData.country_code;
        // let countryFlagEmoji = ipstackData.location.country_flag_emoji;
        // let language = ipstackData.location.languages[0].name;
        // let region = ipstackData.region_name;
        // let city = ipstackData.city;
        // let latitude = ipstackData.latitude;
        // let longitude = ipstackData.longitude;

        return ipstackData;
    } catch (error) {
        console.error('Error fetching IP Stack:', error);
    }
}

function addIpStackToDashboard(ipstackData) {
    const ipStackDiv = createElementAndAppend({ parentElement: root, elementType: 'div', elementId: 'ipStack', classNames: 'flex flex-col' });
    createElementAndAppend({ parentElement: ipStackDiv, elementType: 'div', elementId: 'ipAddress', classNames: 'text-2xl font-bold', textVal: ipstackData.ip });

    const countryDiv = createElementAndAppend({ parentElement: ipStackDiv, elementType: 'div', elementId: 'country', classNames: 'flex text-xl justify-between flex-wrap' });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'countryName', classNames: 'text-xl', textVal: ipstackData.country_name });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'countryCode', classNames: 'text-xl', textVal: ipstackData.country_code });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'flagEmoji', classNames: 'text-xl', textVal: ipstackData.location.country_flag_emoji });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'languages', classNames: 'text-xl', textVal: ipstackData.location.languages[0].name });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'region', classNames: 'text-xl', textVal: ipstackData.region_name });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'city', classNames: 'text-xl', textVal: ipstackData.city });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'latitude', classNames: 'text-xl', textVal: ipstackData.latitude.toString() });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'longitude', classNames: 'text-xl', textVal: ipstackData.longitude.toString() });
}

async function getWorldTime() {
    try {
        let worldTimeResponse = await fetch("http://worldtimeapi.org/api/ip");
        let worldTimeData = await worldTimeResponse.json();
        let timeZone = worldTimeData.timezone;
        let dateObject = new Date(worldTimeData.datetime);
        let formattedDate = dateObject.toLocaleDateString();
        let formattedTime = dateObject.toLocaleTimeString();

        document.getElementById("timeZone").textContent += ": " + timeZone;
        document.getElementById("date").textContent += ": " + formattedDate;
        document.getElementById("time").textContent += ": " + formattedTime;

        return dateObject;
    } catch (error) {
        console.error('Error fetching world time:', error);
    }
}

async function getCountryData(countryCode) {
    try {
        // const {countryCode} = await getIpStack();
        let countriesResponse = await fetch("https://restcountries.com/v3.1/alpha/" + countryCode + "?fields=population");
        // let countryPopulation = countriesData.population;

        return await countriesResponse.json();
    } catch (error) {
        console.error('Error fetching country data:', error);
    }
}

async function getWeatherData(latitude, longitude) {
    try {
        // const {latitude, longitude} = await getIpStack();
        const OPENWEATHERMAP_KEY = "5123e4f646b5f440cbfed22476f68163";
        let weatherResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${OPENWEATHERMAP_KEY}`);
        let weatherData = await weatherResponse.json();


        document.getElementById("timeSunrise").textContent += ": " + sunriseString;
        document.getElementById("timeSunset").textContent += ": " + sunsetString;
        document.getElementById("dayLength").textContent += ": " + dayLength;
        document.getElementById("timeSolarNoon").textContent += ": " + solarNoonString;

        return {sunriseTime, sunsetTime, solarNoonTime}
    } catch (error) {
        console.error('Error fetching sun data:', error);
    }
}

async function getSun() {
    try {
        const {latitude, longitude} = await getIpStack();
        let sunResponse = await fetch(`https://api.sunrise-sunset.org/json?formatted=0&lat=${latitude}&lng=${longitude}`);
        let sunData = await sunResponse.json();
        let sunResults = sunData.results;
        let sunriseTime = new Date(sunResults.sunrise);
        let sunsetTime = new Date(sunResults.sunset);
        let sunriseString = sunriseTime.toLocaleTimeString();
        let sunsetString = sunsetTime.toLocaleTimeString();
        let dayLength = sunResults.day_length;
        let solarNoonTime = new Date(sunResults.solar_noon);
        let solarNoonString = solarNoonTime.toLocaleTimeString()

        return {sunriseTime, sunsetTime, solarNoonTime}
    } catch (error) {
        console.error('Error fetching sun data:', error);
    }
}

async function getIssLocationData() {
    try {
        let openNotifyResponse = await fetch("http://api.open-notify.org/iss-now.json");
        let openNotifyData = await openNotifyResponse.json();
        let latitude = openNotifyData.iss_position.latitude;
        let longitude = openNotifyData.iss_position.longitude;

        return openNotifyData;
    } catch (error) {
        console.error('Error fetching ISS people data:', error);
    }
}

async function getIssPeopleData() {
    try {
        let openNotifyResponse = await fetch("http://api.open-notify.org/astros.json");
        let openNotifyData = await openNotifyResponse.json();
        let population = openNotifyData.number;

        return openNotifyData;
    } catch (error) {
        console.error('Error fetching ISS people data:', error);
    }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function compareGini(x) {
    if (x > 50) {
        return 'very high';
    } else if (x > 40) {
        return 'high';
    } else if (x > 30) {
        return 'medium';
    } else return 'low';
}

const createHTMLElement = (element, id, classes = []) => {
    const htmlElement = document.createElement(element);
    if (id) htmlElement.id = id.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

    if (classes && classes.length > 0) {
        let splitClasses = classes.flatMap(cls => cls.split(' '));
        splitClasses.forEach(cls => htmlElement.classList.add(cls));
    }

    return htmlElement;
}


async function main() {
    const ipstackData = await getIpStack();
    addIpStackToDashboard(ipstackData);
    // const countryData = getCountryData(ipstackData.country_code);
    // const weatherData = getWeatherData(ipstackData.latitude, ipstackData.longitude);
    // const issLocationData = getIssLocationData();
    // const issPeopleData = getIssPeopleData();
}

document.addEventListener('DOMContentLoaded', (event) => {
    main();
});