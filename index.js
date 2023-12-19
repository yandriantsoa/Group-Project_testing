const express = require('express')
var bodyParser = require('body-parser')
const supabaseClient = require('@supabase/supabase-js')
const app = express()
const port = 4000;
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

const supabaseUrl = 'https://jukopmdvhbkohshvcycg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a29wbWR2aGJrb2hzaHZjeWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMwMTE4NTgsImV4cCI6MjAxODU4Nzg1OH0.078t_EGUqCPaflSneUQt81BFMW2xnM0KzGt07OC4-bM'
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
    res.sendFile('public/weather.html', { root: __dirname})
})

app.get('/weather', async (req, res) => {
    console.log(`Getting Weather`)
    

    const {data, error} = await supabase
        .from('WeatherData')
        .select();

    if(error) {
        console.log(error)
    } else if(data) {
        res.send(data)
    }
})


app.listen(port, () => {
    console.log('APP IS ALIVEEEEEE')
})