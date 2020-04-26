'use strict'

require('dotenv').config();

const express = require('express');

const pg = require('pg');

const superagent = require('superagent');

const methodOverride = require('method-override');

const app = express();

const PORT = process.env.PORT;

app.use(express.static('./public'));

app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'))

app.set('view engine', 'ejs');

const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', (err, req, res) => {
    throw new Error
});


app.get('/', homepage)

function homepage(req, res){
    const url = 'https://digimon-api.herokuapp.com/api/digimon'
    superagent.get(url).then(apiData => {
    res.render('./pages/index', {digimons: apiData.body})
    })
}

app.get('/favorites/', favoritesPage)

function favoritesPage(req, res){
    const SQL = 'SELECT * FROM digimons'
    client.query(SQL).then(result => {
        res.render('./pages/favorites', {digimons: result.rows});
    })
}

app.post('/addtofavorite/', addToFavoritesPage)

function addToFavoritesPage(req, res){
    const {digimon_name, digimon_img, digimon_level} = req.body;
    const SQL = 'INSERT INTO digimons (digimon_name, digimon_img, digimon_level) VALUES ($1, $2, $3) RETURNING *'
    const values = [digimon_name, digimon_img, digimon_level];
    client.query(SQL, values).then(result =>{
        // res.status(200).send(result.rows);
        res.redirect('/favorites/')
    })
}

app.post('/digimondetails:digimon_name/', detailsPage);

function detailsPage(req, res){
    const digimon_name = req.params.digimon_name;
    console.log(digimon_name)
    console.log('digimon_name')
    const SQL = 'SELECT * FROM digimons WHERE digimon_name=$1'
    const values = [digimon_name];
    client.query(SQL, values).then(result =>{
        res.render('./pages/details', {digimons: result.rows})
})
    // const url = `https://digimon-api.herokuapp.com/api/digimon/name/${digimon_name}`
    // superagent.get(url).then(apiData => {
    //     // res.status(200).json(apiData.body);
    //     res.render('./pages/details', {digimons: apiData.body})
    // })
}

app.delete('/digimondelete:digimon_name/', delteDigimon);

function delteDigimon(req, res){
    const digimon_name = req.params.digimon_name;
    const SQL = 'DELETE FROM digimons WHERE digimon_name = $1'
    const values =[digimon_name];
    client.query(SQL, values).then(result => {
        res.redirect('/favorites/')
    })
    // res.status(200).send(digimon_name);
}

// app.put('/digimonupdate/', updateDigimonDetails)

// function updateDigimonDetails(req, res){

// }

client.connect().then(() => {
    app.listen(PORT, () =>{
        console.log(`connected to ${PORT}`)
    })
})