const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const currentWeatherItemsEl2 = document.getElementById('current-weather-items2');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const API_KEY ='1639fef2817a3808b52d97302a9417c6';

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData('')
function getWeatherData (ciudad) {
    
    if (ciudad!="") {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            timezone.innerHTML = data.name;
            const latitude = data.coord.lat;
            const longitude = data.coord.lon;
            console.log(latitude);

            // Encadenar la segunda llamada a fetch dentro de la primera cadena de promesas
            return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`);
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showWeatherData(data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });

    }else{
        navigator.geolocation.getCurrentPosition((success) => {
            
            let {latitude, longitude } = success.coords;
    

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
    
            console.log(data)
            timezone.innerHTML = data.name;
            })

            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            //fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
    
            console.log(data)
            showWeatherData(data);
            })
    
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          getWeatherData('Madrid');
        })
    }
}

function showWeatherData (data){
    let { lat,lon,current: { humidity, pressure, sunrise, sunset, wind_speed } } = data;

    //timezone.innerHTML = data.name;
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E';
    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humedad</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Presión</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Velocidad del viento</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div>Amanecer</div>
        <div>${window.moment(sunrise * 1000).format('hh:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Atardecer</div>
        <div>${window.moment(sunset*1000).format('hh:mm a')}</div>
    </div>
    `;
    currentWeatherItemsEl2.innerHTML = 
    `<div class="weather-item">
        <div>Humedad</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Presión</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Velocidad del viento</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div>Amanecer</div>
        <div>${window.moment(sunrise * 1000).format('hh:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Atardecer</div>
        <div>${window.moment(sunset*1000).format('hh:mm a')}</div>
    </div>
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Noche - ${day.temp.night}&#176;C</div>
                <div class="temp">Día - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Noche - ${day.temp.night}&#176;C</div>
                <div class="temp">Día - ${day.temp.day}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;

}

function nuevaCiudad(event) {
    if (event.key === 'Enter') {
      var contenido = document.getElementById('miCajaTexto').value;
      //console.log('Contenido enviado:', contenido);
      getWeatherData(contenido);
    }
  }
  