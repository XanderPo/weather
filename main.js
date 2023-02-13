const link =
  "http://api.weatherapi.com/v1/current.json?key=b0fb63ebe2ef43a0a13133123230902&q=";
const root = document.querySelector(".app");
const input = document.querySelector(".input-field");
const btn = document.querySelector("button");
const inputPanel = document.querySelector(".input-panel");

let store = {
  city: "London",
  county: "United Kingdom",
  region: "",
  feelslike: 0,
  temperature: 0,
  localtime: 0,
  isDay: 0,
  description: "",
  properties: {
    cloudcover: {},
    presure: {},
    humidity: {},
    uvIndex: {},
    visibility: {},
    windSpeed: {},
  },
};

const fetchData = async () => {
  try {
    const findCity = localStorage.getItem("city") || store.city;
    const result = await fetch(`${link}${findCity}`);
    const data = await result.json();

    const {
      current: {
        feelslike_c: feelslike,
        cloud: cloudcover,
        temp_c: temperature,
        humidity,
        pressure_mb: presure,
        uv: uvIndex,
        vis_km: visibility,
        is_day: isDay,
        condition: { text: description },
        wind_kph: windSpeed,
      },
      location: { name, localtime, country, region },
    } = data;

    store = {
      ...store,
      city: name,
      country,
      region,
      feelslike,
      temperature,
      localtime,
      isDay,
      description,
      properties: {
        cloudcover: {
          title: "cloudcover",
          value: `${cloudcover}%`,
          icon: "cloud.png",
        },
        presure: {
          title: "presure",
          value: `${presure}mb`,
          icon: "gauge.png",
        },
        humidity: {
          title: "humidity",
          value: `${humidity}%`,
          icon: "humidity.png",
        },
        uvIndex: {
          title: "uvIndex",
          value: `${uvIndex}`,
          icon: "uv-index.png",
        },
        visibility: {
          title: "visibility",
          value: `${visibility}km`,
          icon: "visibility.png",
        },
        windSpeed: {
          title: "windSpeed",
          value: `${windSpeed}km/h`,
          icon: "wind.png",
        },
      },
    };
    renderComponent();
  } catch (err) {
    console.log(err);
  }
};

const getImage = (description) => {
  switch (description) {
    case "Partly cloudy":
      return "partly.png";
    case "Sunny":
      return "sunny.png";
    case "Overcast":
      return "cloud.png";
    case "Clear":
      return "clear.png";
    case "Mist":
      return "fog.png";
    default:
      return "cloud.png";
  }
};

const renderProperties = (properties) => {
  return Object.values(properties)
    .map(({ title, icon, value }) => {
      return `
            <div class="tale">
                <img src="./img/icons/${icon}" alt="">
                <div class="tale-info">
                    <p class="black">${value}</p>                        
                    <p class="black">${title}</p> 
                </div> 
            </div>    
        `;
    })
    .join("");
};

let markup = () => {
  const {
    city,
    country,
    region,
    description,
    localtime,
    temperature,
    isDay,
    properties,
  } = store;
  
  const appClass = isDay === 1 ? "app-day" : "app-night";

  return `
        <div>                   
            <div class='app ${appClass}'>                        
            <div class="weather-sheet">
            <div class='input_block'>
                <span class="title"><b>Weather today in</b></span>
            </div>              
            <div class="city margin"><b>${city}</b></div>
            <div class="county margin"><b>${country}, ${region}</b></div>
            <div class="weather-main-info">
                <div class="logo-container">
                    <img src="./img/${getImage(description)}" alt="">
                    <h2 class="discription">${description}</h2>
                </div>
                <div class="temperature-container">
                    <p class="time">${localtime}</p>
                    <p class="temperature">${temperature}°</p>
                </div>
            </div> 
            <div class="additional-info">${renderProperties(properties)}</div> 
            </div>     
        </div>                                      
    `;
};

const toggleInputPanel = () => {
  switch (inputPanel.style.display) {
    case "block":
      inputPanel.style.display = "none";
      localStorage.setItem("city", store.city);
      fetchData();
      break;
    case "none":
      inputPanel.style.display = "block";
      break;
    default:
      inputPanel.style.display = "block";
      break;
  }
};

const renderComponent = () => {
  root.innerHTML = markup();

  btn.addEventListener("click", toggleInputPanel);
  city = document.querySelector(".city");
  city.addEventListener("click", toggleInputPanel);
};

const handleinput = () => {
  store = {
    ...store,
    city: input.value,
  };
};

input.addEventListener("input", handleinput);

fetchData();