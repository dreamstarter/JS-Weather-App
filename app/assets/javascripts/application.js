// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require turbolinks
//= require_tree .

window.addEventListener('load', ()=> {
  let long
  let lat
  let alert = document.querySelector('.alert');
  let temperatureDescription = document.querySelector('.temperature-description');
  let temperatureDegree = document.querySelector('.temperature-degree');
  let locationTimezone = document.querySelector('.location-timezone');
  let temperatureSection = document.querySelector('.temperature');
  const temperatureSpan = document.querySelector('.temperature span')

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition
    (position =>{
      // console.log(position);
      long = position.coords.longitude;
      lat = position.coords.latitude;
      temperatureSpan.textContent = "℉";

      const proxy = 'http://cors-anywhere.herokuapp.com/';
      const api = `${proxy}https://api.darksky.net/forecast/a488b826af858506e258957f3ebe1b47/${lat},${long}`;

      fetch(api)
        .then(apiResponse =>{
          return apiResponse.json();
        })
        .then(data => {
          //console.log(data);

          const { temperature, summary, icon } = data.currently;
          
          //Set DOM Elements from the API
          temperatureDegree.textContent = Math.floor(temperature);
          temperatureDescription.textContent = summary;
          locationTimezone.textContent = data.timezone.split('/').slice(-1)[0];

          //Calculate for celsius temperature
          let celsius = (temperature - 32) * (5 / 9);
          
          //Set Icon
          setIcons(icon, document.querySelector('.icon'));

          //Switch temperature measurement (Celsius/Fahrenheit)
          temperatureSection.addEventListener('click', () => {
            if(temperatureSpan.textContent === "℉"){
              temperatureSpan.textContent = "℃";
              temperatureDegree.textContent = Math.floor(celsius)
            }else{
              temperatureSpan.textContent = "℉";
              temperatureDegree.textContent = Math.floor(temperature);
            }
          });
        }) 
    });
  }else{
    alert.textContent = "Please allow your location to be used, in order to load your local weather.";
  };

  function setIcons(icon, iconID){
    const skycons = new Skycons({color: "white"});
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  };

  function htmlEncode( html ) {
    return document.createElement( 'a' ).appendChild( 
      document.createTextNode( html ) ).parentNode.innerHTML;
  };
});