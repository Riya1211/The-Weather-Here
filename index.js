const { request, response } = require('express');
const Datastore = require('nedb');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

console.log(process.env);

const express = require('express');
const app = express();
// this is 3000 is aport number
app.listen(3000, () => console.log('listening at 3000'));

// this is use to connect html file which is in folder called public because it is accesseble to everyone
app.use(express.static('public'));

// this will help to connect it with server json file ; And limit will protect to get large amt. of data
app.use(express.json({ limit: '1mb'}));

// Creating a database
const database = new Datastore('database.db');

// this will load the database
database.loadDatabase();

// To get data from serverv by using GET() function

app.get('/api', (request, response) =>{
    database.find({}, (err, data) => {
        if(err){
            response.end();
            return;
        }
        response.json(data);

    });
    
});

// it will help to get info to server computer by call back function using request and response4
// request is where server side ask the client side
// response is when server response to a reuqest of a client side.
app.post('/api',(request, response) =>{
    console.log('I got a request!');
    const data = request.body;

    // Adding Time
    const timestamp = Date.now();
    data.timestamp = timestamp;

    // this will add data into datbase
    database.insert(data); 

    response.json(data);
});

app.get('/weather/:latlon', async (request, response) =>{
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);
    const api_key = process.env.API_KEY ;
    const weather_url =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    // const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b3226f7dabc54f37ba99b22e46b0a444`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url =`https://api.openaq.org/v2/locations?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();
    
    const data = {
            weather: weather_data,
            air_quality: aq_data
        };
        
    response.json(data);
    });
