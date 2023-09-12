async function getIpStack() {
    const IPSTACK_ACCESS_KEY = "315c943e1895202bbf4fc8129849e4b4";
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

        document.getElementById("ipAddress").textContent += ": " + ip;
        document.getElementById("country").textContent += ": " + country;
        document.getElementById("countryCode").textContent += ": " + countryCode;
        document.getElementById("countryFlag").textContent += ": " + countryFlagEmoji;
        document.getElementById("countryLanguage").textContent += ": " + language;
        document.getElementById("region").textContent += ": " + region;
        document.getElementById("city").textContent += ": " + city;
        document.getElementById("latitude").textContent += ": " + latitude;
        document.getElementById("longitude").textContent += ": " + longitude;

        return {countryCode: data.country_code, latitude: data.latitude, longitude: data.longitude};
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

async function getCountries() {
    try {
        const {countryCode} = await getIpStack();
        let countriesResponse = await fetch("https://restcountries.com/v3.1/alpha/" + countryCode + "?fields=population");
        let countriesData = await countriesResponse.json();
        let countryPopulation = countriesData.population;

        document.getElementById("countryPopulation").textContent += ": " + countryPopulation;
    } catch (error) {
        console.error('Error fetching country data:', error);
    }
}

getCountries();

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

async function getIssLocation() {
    try {
        let openNotifyResponse = await fetch("http://api.open-notify.org/iss-now.json");
        let openNotifyData = await openNotifyResponse.json();
        let latitude = openNotifyData.iss_position.latitude;
        let longitude = openNotifyData.iss_position.longitude;

        document.getElementById("issLatitude").textContent += ": " + latitude;
        document.getElementById("issLongitude").textContent += ": " + longitude;
    } catch (error) {
        console.error('Error fetching ISS people data:', error);
    }
}
getIssLocation();

async function getIssPeople() {
    try {
        let openNotifyResponse = await fetch("http://api.open-notify.org/astros.json");
        let openNotifyData = await openNotifyResponse.json();
        let population = openNotifyData.number;

        document.getElementById("spacePopulation").textContent += ": " + population;
    } catch (error) {
        console.error('Error fetching ISS people data:', error);
    }
}
getIssPeople();

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

    setInterval(async function() {
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
