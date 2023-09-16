const IPSTACK_ACCESS_KEY = "315c943e1895202bbf4fc8129849e4b4";
const OPENWEATHERMAP_KEY = "5123e4f646b5f440cbfed22476f68163";

function objectToString(obj) {
    if (typeof obj !== 'object' || Array.isArray(obj)) {
        throw new Error('Provided argument is not an object');
    }

    for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            throw new Error('Nested objects are not allowed');
        }
    }

    return new URLSearchParams(obj).toString();
}

function stringToObject(query) {
    const params = new URLSearchParams(query);
    const obj = {};
    for (let [key, value] of params.entries()) {
        obj[key] = value;
    }
    return obj;
}

async function getIpStack() {
    try {
        let ipstackResponse = await fetch("http://api.ipstack.com/check?output=json&access_key=" + IPSTACK_ACCESS_KEY);
        let ipstackData = await ipstackResponse.json();
        let ip = ipstackData.ip;
        let country = ipstackData.country_name;
        let countryCode = ipstackData.country_code;
        let countryFlagEmoji = ipstackData.location.country_flag_emoji;
        let language = ipstackData.location.languages[0].name;
        let region = ipstackData.region_name;
        let city = ipstackData.city;
        let latitude = ipstackData.latitude;
        let longitude = ipstackData.longitude;

        return ipstackData;
    } catch (error) {
        console.error('Error fetching IP Stack:', error);
    }
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

getCountryData();

async function getWeatherData(latitude, longitude) {
    try {
        // const {latitude, longitude} = await getIpStack();
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


        document.getElementById("timeSunrise").textContent += ": " + sunriseString;
        document.getElementById("timeSunset").textContent += ": " + sunsetString;
        document.getElementById("dayLength").textContent += ": " + dayLength;
        document.getElementById("timeSolarNoon").textContent += ": " + solarNoonString;

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

function main() {
    const ipstackData = getIpStack();
    const countryData = getCountryData(ipstackData.country_code);
    const weatherData = getWeatherData(ipstackData.latitude, ipstackData.longitude);
    const issLocationData = getIssLocationData();
    const issPeopleData = getIssPeopleData();
}
main();