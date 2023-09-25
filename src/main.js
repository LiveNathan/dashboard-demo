const root = document.getElementById('root');

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
        return await ipstackResponse.json();
    } catch (error) {
        console.error('Error fetching IP Stack:', error);
        return "NA";
    }
}

function addIpStackToDashboard(ipstackData) {
    const ipStackDiv = createElementAndAppend({ parentElement: root, elementType: 'div', elementId: 'ipStack', classNames: 'flex flex-col' });
    createElementAndAppend({ parentElement: ipStackDiv, elementType: 'div', elementId: 'ipAddress', classNames: 'text-2xl font-bold text-gray-500', textVal: "Country" });

    const countryDiv = createElementAndAppend({ parentElement: ipStackDiv, elementType: 'div', elementId: 'country', classNames: 'flex text-xl justify-between flex-wrap gap-2' });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'countryName', classNames: 'text-xl', textVal: ipstackData.country_name });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'countryCode', classNames: 'text-xl', textVal: ipstackData.country_code });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'flagEmoji', classNames: 'text-xl', textVal: ipstackData.location.country_flag_emoji });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'population', classNames: 'text-xl', textVal: "pop:" + ipstackData.population.toLocaleString() });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'languages', classNames: 'text-xl', textVal: ipstackData.location.languages[0].name });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'region', classNames: 'text-xl', textVal: ipstackData.region_name });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'city', classNames: 'text-xl', textVal: ipstackData.city });
    createElementAndAppend({ parentElement: countryDiv, elementType: 'div', elementId: 'latAndLon', classNames: 'text-xl', textVal: ipstackData.latitude.toFixed(2) + "º, " + ipstackData.longitude.toFixed(2) + "º" });
}

async function getWorldTime() {
    try {
        const worldTimeResponse = await fetch("http://worldtimeapi.org/api/ip");
        const worldTimeData = await worldTimeResponse.json();
        const timeZone = worldTimeData.abbreviation;
        const dateObject = new Date(worldTimeData.datetime);
        const formattedDate = dateObject.toLocaleDateString();
        const formattedTime = dateObject.toLocaleTimeString();
        const dayOfYear = worldTimeData.day_of_year;
        const weekNumber = worldTimeData.week_number;
        return {
            "timeZone": timeZone,
            "date": formattedDate,
            "time": formattedTime,
            "dayOfYear": dayOfYear,
            "weekNumber": weekNumber
        };
    } catch (error) {
        console.error('Error fetching world time:', error);
        return "NA";
    }
}

function addTimeToDashboard(time, sun) {
    const dayTimeDiv = createElementAndAppend({ parentElement: root, elementType: 'div', elementId: 'ipStack', classNames: 'flex flex-col' });

    const timeDiv = createElementAndAppend({ parentElement: dayTimeDiv, elementType: 'div', elementId: 'timeDiv', classNames: 'flex gap-2 flex-wrap' });
    createElementAndAppend({ parentElement: timeDiv, elementType: 'div', elementId: 'date', classNames: 'text-2xl font-bold', textVal: time.date });
    createElementAndAppend({ parentElement: timeDiv, elementType: 'div', elementId: 'time', classNames: 'text-2xl font-bold', textVal: time.time });
    createElementAndAppend({ parentElement: timeDiv, elementType: 'div', elementId: 'timeZone', classNames: 'text-2xl font-bold', textVal: time.timeZone });

    const dayDiv = createElementAndAppend({ parentElement: dayTimeDiv, elementType: 'div', elementId: 'timeDiv', classNames: 'flex gap-2 flex-wrap' });
    createElementAndAppend({ parentElement: dayDiv, elementType: 'div', elementId: 'weekNumber', classNames: 'text-xl', textVal: "week:" + time.weekNumber });
    createElementAndAppend({ parentElement: dayDiv, elementType: 'div', elementId: 'dayOfYear', classNames: 'text-xl', textVal: "day:" + time.dayOfYear });

    const sunDiv = createElementAndAppend({ parentElement: dayTimeDiv, elementType: 'div', elementId: 'sunDiv', classNames: 'flex gap-2 flex-wrap' });
    createElementAndAppend({ parentElement: sunDiv, elementType: 'div', elementId: 'sunrise', classNames: 'text-xl', textVal: "🌅" + sun.sunrise });
    createElementAndAppend({ parentElement: sunDiv, elementType: 'div', elementId: 'noon', classNames: 'text-xl', textVal: "🕛" + sun.solarNoon });
    createElementAndAppend({ parentElement: sunDiv, elementType: 'div', elementId: 'sunset', classNames: 'text-xl', textVal: "🌆" + sun.sunset });
    createElementAndAppend({ parentElement: sunDiv, elementType: 'div', elementId: 'dayLength', classNames: 'text-xl', textVal: "🍻" + (sun.dayLength/3600).toFixed(2) + "h" });
}

async function getCountryData(countryCode) {
    try {
        let countriesResponse = await fetch("https://restcountries.com/v3.1/alpha/" + countryCode + "?fields=population");
        let countriesData = await countriesResponse.json();
        return countriesData.population;
    } catch (error) {
        console.error('Error fetching country data:', error);
        return "NA";
    }
}

async function getWeatherData(latitude, longitude) {
    try {
        const OPENWEATHERMAP_KEY = "5123e4f646b5f440cbfed22476f68163";
        let weatherResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${OPENWEATHERMAP_KEY}`);
        let weatherData = await weatherResponse.json();
        return weatherData.current;
    } catch (error) {
        console.error('Error fetching sun data:', error);
        return "NA";
    }
}

function addWeatherDataToDashboard(weatherData) {
    const weatherDiv = createElementAndAppend({ parentElement: root, elementType: 'div', elementId: 'weather', classNames: 'flex flex-col' });
    createElementAndAppend({ parentElement: weatherDiv, elementType: 'div', elementId: 'sunrise', classNames: 'text-2xl font-bold text-gray-500', textVal: "Weather" });

    const weatherDataDiv = createElementAndAppend({ parentElement: weatherDiv, elementType: 'div', elementId: 'weatherData', classNames: 'flex text-xl justify-between flex-wrap gap-2' });
    const tempC = weatherData.temp;
    const tempF = c2f(tempC);
    createElementAndAppend({ parentElement: weatherDataDiv, elementType: 'div', elementId: 'temperature', classNames: 'text-xl', textVal: tempC + '°C / ' + tempF.toFixed(2) + "ºF" });
    const tempCfeelsLike = weatherData.feels_like;
    const tempFfeesLike = c2f(tempCfeelsLike);
    createElementAndAppend({ parentElement: weatherDataDiv, elementType: 'div', elementId: 'temperatureCfeelsLike', classNames: 'text-xl', textVal: "Feels like:" + tempCfeelsLike + '°C / ' + tempFfeesLike.toFixed(2) + "ºF" });
    createElementAndAppend({ parentElement: weatherDataDiv, elementType: 'div', elementId: 'weatherConditions', classNames: 'text-xl', textVal: weatherData.weather[0].description});
    createElementAndAppend({ parentElement: weatherDataDiv, elementType: 'div', elementId: 'pressure', classNames: 'text-xl', textVal: weatherData.pressure.toLocaleString() + "hPa"});
    createElementAndAppend({ parentElement: weatherDataDiv, elementType: 'div', elementId: 'humidity', classNames: 'text-xl', textVal: weatherData.humidity.toString() + "%"});
    createElementAndAppend({ parentElement: weatherDataDiv, elementType: 'div', elementId: 'windSpeed', classNames: 'text-xl', textVal: weatherData.wind_speed.toString() + "m/s"});
}

function c2f (C) {
    return C * 9/5 + 32;
}


async function getSun() {
    try {
        const {latitude, longitude} = await getIpStack();
        const sunResponse = await fetch(`https://api.sunrise-sunset.org/json?formatted=0&lat=${latitude}&lng=${longitude}`);
        const sunData = await sunResponse.json();
        const sunResults = sunData.results;
        const sunriseTime = new Date(sunResults.sunrise);
        const sunsetTime = new Date(sunResults.sunset);
        const sunriseString = sunriseTime.toLocaleTimeString();
        const sunsetString = sunsetTime.toLocaleTimeString();
        const dayLength = sunResults.day_length;
        const solarNoonTime = new Date(sunResults.solar_noon);
        const solarNoonString = solarNoonTime.toLocaleTimeString()
        return {
            "sunrise": sunriseString,
            "sunset": sunsetString,
            "dayLength": dayLength,
            "solarNoon": solarNoonString
        }
    } catch (error) {
        console.error('Error fetching sun data:', error);
    }
}

async function getIssLocationData() {
    try {
        let openNotifyResponse = await fetch("http://api.open-notify.org/iss-now.json");
        let openNotifyData = await openNotifyResponse.json();

        return openNotifyData.iss_position;
    } catch (error) {
        console.error('Error fetching ISS people data:', error);
    }
}

async function getIssPeopleData() {
    try {
        let openNotifyResponse = await fetch("http://api.open-notify.org/astros.json");
        let openNotifyData = await openNotifyResponse.json();
        return openNotifyData.number;
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

    return R * c;  // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function addIssDataToDashboard(iss_position, populationSpace, ipstackData) {
    const issDiv = createElementAndAppend({ parentElement: root, elementType: 'div', elementId: 'issDiv', classNames: 'flex flex-col' });
    createElementAndAppend({ parentElement: issDiv, elementType: 'div', elementId: 'iss', classNames: 'text-2xl font-bold text-gray-500', textVal: "International Space Station" });

    const issDataDiv = createElementAndAppend({ parentElement: issDiv, elementType: 'div', elementId: 'issData', classNames: 'flex text-xl justify-between flex-wrap gap-2' });
    const latitude = parseFloat(parseFloat(iss_position.latitude).toFixed(2));
    const longitude = parseFloat(parseFloat(iss_position.longitude).toFixed(2));
    createElementAndAppend({ parentElement: issDataDiv, elementType: 'div', elementId: 'issPosition', classNames: 'text-xl', textVal: latitude + 'º, ' + longitude + "º" });

    const issDistanceFromUserLocation = getDistanceFromLatLonInKm(ipstackData.latitude, ipstackData.longitude, latitude, longitude)
    createElementAndAppend({ parentElement: issDataDiv, elementType: 'div', elementId: 'issDistance', classNames: 'text-xl', textVal: issDistanceFromUserLocation.toLocaleString() + "km from you" });

    createElementAndAppend({ parentElement: issDataDiv, elementType: 'div', elementId: 'issPopulation', classNames: 'text-xl', textVal: "pop:" + populationSpace });
}

class ColorStep {
    constructor(time, color) {
        this.time = time;  // Number of minutes since 0:00
        this.color = color;  // {r: red, g: green, b: blue}
    }
}

function linearInterpolation(start, end, weight) {
    return start + (end - start) * weight;
}

function getColorBetween(step1, step2, now) {
    const weight = (now - step1.time) / (step2.time - step1.time);  // Weight between 0 and 1
    return {
        r: Math.round(linearInterpolation(step1.color.r, step2.color.r, weight)),
        g: Math.round(linearInterpolation(step1.color.g, step2.color.g, weight)),
        b: Math.round(linearInterpolation(step1.color.b, step2.color.b, weight))
    };
}

function getCurrentColor(colorSteps) {
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

    colorSteps.sort((a, b) => a.time - b.time);

    for(let i = 0; i < colorSteps.length; i++) {
        if(colorSteps[i].time > minutesSinceMidnight) {
            if(i === 0) return colorSteps[i].color;
            return getColorBetween(colorSteps[i - 1], colorSteps[i], minutesSinceMidnight);
        }
    }

    return colorSteps[colorSteps.length - 1].color;  // Else, the color of the last step
}


function updateSiteColor(steps) {
    const currentColor = getCurrentColor(steps);
    document.body.style.backgroundColor = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
    document.body.style.transition = 'background-color 5s ease';
    document.body.classList.add('loaded');
}

async function main() {
    const time = await getWorldTime();
    const sun = await getSun();

    // Convert the time from 'HH:MM:SS' format to the number of minutes since 0:00
    const sunriseTime = sun.sunrise.split(':').reduce((acc,time) => (60 * acc) + +time);  // Split into an array. Iterate over the elements with an accumulator. `+time` converts the string to a number.
    const sunsetTime = sun.sunset.split(':').reduce((acc,time) => (60 * acc) + +time);
    const solarNoonTime = sun.solarNoon.split(':').reduce((acc,time) => (60 * acc) + +time);

    const dawnTime = sunriseTime - 60;  // Assume that dawn is 1 hour before sunrise
    const duskTime = sunsetTime + 60;

    const colorSteps = [
        new ColorStep(0, {r: 0, g: 0, b: 255}),                   // Midnight, Dark Blue
        new ColorStep(dawnTime, {r: 255, g: 165, b: 0}),               // Dawn, Orange
        new ColorStep(sunriseTime, {r: 254, g: 95, b: 0}),             // Sunrise, Red-Orange
        new ColorStep(solarNoonTime, {r: 252, g: 255, b: 181}),        // Solar Noon, Pastel Yellow
        new ColorStep(sunsetTime, {r: 255, g: 223, b: 0}),             // Sunset, Yellow-Red
        new ColorStep(duskTime, {r: 230, g: 230, b: 250}),             // Dusk, Lavender
    ];

    updateSiteColor(colorSteps);
    setInterval(() => updateSiteColor(colorSteps), 60000);

    addTimeToDashboard(time, sun);
    const ipstackData = await getIpStack();
    ipstackData.population = await getCountryData(ipstackData.country_code);
    addIpStackToDashboard(ipstackData);
    const weatherData = await getWeatherData(ipstackData.latitude, ipstackData.longitude);
    addWeatherDataToDashboard(weatherData);
    const iss_position = await getIssLocationData();
    const populationSpace = await getIssPeopleData();
    addIssDataToDashboard(iss_position, populationSpace, ipstackData);
}

document.addEventListener('DOMContentLoaded', () => {
    main();
});