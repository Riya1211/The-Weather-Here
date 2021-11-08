
 function setup() {

    let lat, lon, weather1, weather2, air;
    
      

    //Geo Locate
    if ('geolocation' in navigator) {
      console.log('geolocation available');
      navigator.geolocation.getCurrentPosition(async position => {
        try{
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        document.getElementById('latitude').textContent = lat.toFixed(2);
        document.getElementById('longitude').textContent = lon.toFixed(2);
        const api_url =`weather/${lat},${lon}`;
        // const api_url =`/weather`;
        const response = await fetch(api_url);
        const json = await response.json();
        console.log(json);

        weather1 = json.weather.weather[0];
        weather2 = json.weather.main;
        air = json.air_quality.results[0].parameters[0];

        document.getElementById('summary').textContent = weather1.description;
        document.getElementById('temperature').textContent = weather2.temp;
        
        document.getElementById('aq_parameter').textContent = air.parameter;
        document.getElementById('aq_value').textContent = air.lastValue;
        document.getElementById('aq_units').textContent = air.unit;
        document.getElementById('aq_date').textContent = air.lastUpdated;
    }
   catch(error){

          console.error(error);
          air = { lastValue: -1};
          document.getElementById('aq_value').textContent = 'NO READING';
          // console.log('something went wrong!');
        }

        const data = { lat, lon, weather1, weather2, air};
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      };
  
      const db_response = await fetch('/api', options);
      const db_json = await db_response.json();
      console.log(db_json);

      });  
    } else {
      console.log('geolocation not available');
    }

    
  }
