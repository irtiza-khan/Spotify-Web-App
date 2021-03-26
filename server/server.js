const express = require('express');
const app = express();
const spotifyWebApi = require('spotify-web-api-node');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser")
const lyricsFinder = require("lyrics-finder")

app.use(morgan('dev'));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());



const PORT = process.env.PORT || 3001



app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '791b9ea33e1b4f0d872127a6f971ef09',
        clientSecret: '2474729fd15842a9a3d459452eb9d960',
        refreshToken
    });

    spotifyApi.refreshAccessToken().then(data => {
            res.json({
                accessToken: data.body.access_token,
                expires_in: data.body.expires_in
            })
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
})

app.post("/login", (req, res) => {
    const code = req.body.code
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '791b9ea33e1b4f0d872127a6f971ef09',
        clientSecret: '2474729fd15842a9a3d459452eb9d960',
    })

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch(err => {
            res.sendStatus(400)
        })
})


app.get("/lyrics", async(req, res) => {
    const lyrics =
        (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
})


app.listen(PORT, () => {
    console.log(`Listening to Port  http://localhost:${PORT}`);
});;