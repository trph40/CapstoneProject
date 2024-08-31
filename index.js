// importing required libraries and modules
import axios from "axios";
import express from "express";
import bodyParser from 'body-parser'
import 'dotenv/config';

const now = new Date();


//setting up project
const app = express();
const port = 3000;
const weather_url = "https://api.openweathermap.org/data/3.0/onecall"; //endpoint for weather api
const location_url = "http://api.openweathermap.org/geo/1.0/direct"
const location_reverse_url = "http://api.openweathermap.org/geo/1.0/reverse"; //endpoint for location api
const key = process.env.API_KEY;
const weather_dict = {
    8000: 'clear-sky-sun.png',
    8001: 'clear-sky-moon.png',
    8010: 'few-clouds-sun.png',
    8020: 'few-clouds-sun.png',
    8011: 'few-clouds-moon.png',
    8021: 'few-clouds-moon.png',
    8030: 'overcast-clouds-sun.png',
    8040: 'overcast-clouds-sun.png',
    8031: 'overcast-clouds-moon.png',
    8041: 'overcast-clouds-moon.png',
    200: 'thunderstorm-with-rain.png',
    201: 'thunderstorm-with-rain.png',
    202: 'thunderstorm-with-rain.png',
    500: 'rainy.png',
    501: 'rainy.png',
    502: 'rainy.png',
    600: 'snow.png',
    601: 'snow.png',
    602: 'snow.png',
}
 const weather_list = [500, 501, 502, 600, 601, 602]


//setting up express
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', async (req, res) => {
    res.render('index.ejs', {content: "Waiting for data..."})
});

app.post('/get-data', async (req, res) => {
    try {
        const search_query = req.body.search_query;
        const result1 = await axios.get(location_url, {params: {q: search_query, appid: key, limit: 1}});
        const lat = result1.data[0].lat;
        const lon = result1.data[0].lon;
        const result2 = await axios.get(weather_url, {
            params: {
                lat: lat,
                lon: lon,
                appid: key,
                units: "metric",
                exclude: 'minutely,hourly,daily'
            }
        });
        var image_url, background
        const weather_code = result2.data.current.weather[0].id;
        if (6<=((result2.data.current.dt/3600)%24)<20) {
            // image_url = weather_dict[weather_code*10+1];
            background = "background: radial-gradient(circle at top left, #787471, #141515 50%), #141515";
        } else {
            // image_url = weather_dict[weather_code *10];
            background = "background: radial-gradient(circle at top left, #76a1d5, #3069a7 50%), #3069a7";
        }

        const icon_url = `http://openweathermap.org/img/wn/${result2.data.current.weather[0].icon}@4x.png`;
        const content = {
            background: background,
            data1: result1.data[0],
            data2: result2.data,
            image_url: icon_url
        };
        console.log("result", (result2.data.current.dt/3600)%24);
        console.log("code", result2.data.current.weather[0].id);
        console.log("time", result2.data.current.dt);
        res.render('index.ejs', { content });
    } catch (error) {
        console.error(error);
        res.render('index.ejs', { content: "Waiting for data..." });
    }
})


app.listen(port, () => {
    console.log("Application started");
});

