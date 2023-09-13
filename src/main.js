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


async function getSunMultiplier() {
    const {sunriseTime, sunsetTime, solarNoonTime} = await getSun();
    const currentTime = await getWorldTime();

    const sunrise = sunriseTime.getTime();
    const sunset = sunsetTime.getTime();
    const noon = solarNoonTime.getTime();
    const now = currentTime.getTime();

    // Calculate midnight (opposite of solar noon)
    const prevMidnight = noon - 12 * 60 * 60 * 1000;    // midnight of the current day
    const nextMidnight = noon + 12 * 60 * 60 * 1000;    // midnight of the next day

    let multiplier;
    if (now >= sunrise && now <= noon) {
        multiplier = 0.5 + 0.5 * (now - sunrise) / (noon - sunrise);
    } else if (now > noon && now <= sunset) {
        multiplier = 1 - 0.5 * (now - noon) / (sunset - noon);
    } else if (now > sunset && now <= nextMidnight) {
        multiplier = 0.5 - 0.5 * (now - sunset) / (nextMidnight - sunset);
    } else {
        let midnight = now < sunrise ? prevMidnight : nextMidnight;
        multiplier = 0.5 * (now - midnight) / (sunrise - midnight);
    }

    return multiplier;
}

document.addEventListener('DOMContentLoaded', () => {
    const sunImg = document.getElementById('sun');
    const moonImg = document.getElementById('moon');

    setInterval(async function () {
        const multiplier = await getSunMultiplier();
        const yPos = `${multiplier * 100}vh`;

        sunImg.style.bottom = yPos;
        moonImg.style.bottom = yPos;

        sunImg.style.display = (multiplier > 0.5) ? 'block' : 'none';
        moonImg.style.display = (multiplier > 0.5) ? 'none' : 'block';

        const colorValue = multiplier * 255;
        const red = Math.round(colorValue);
        const green = Math.round(colorValue);
        const blue = Math.round(colorValue);

        document.body.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

        // Calculate inverse colors
        const fontRed = 255 - red;
        const fontGreen = 255 - green;
        const fontBlue = 255 - blue;

        document.body.style.color = `rgb(${fontRed}, ${fontGreen}, ${fontBlue})`;
    }, 1000);
});

function main() {
    const ipstackData = getIpStack();
    const countryData = getCountryData(ipstackData.country_code);
    const weatherData = getWeatherData(ipstackData.latitude, ipstackData.longitude);
    const issLocationData = getIssLocationData();
    const issPeopleData = getIssPeopleData();
}