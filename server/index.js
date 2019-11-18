const express = require('express')
const bodyParser = require('body-parser')
const userDB = require('./user_queries')
const channelDB = require('./channel_queries')
const spotifyAPI = require('./spotify_api');
const songDB = require('./song_queries')

var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '77522dbfae304f42a78be67daf372fb7'; // Your client id
var client_secret = 'e2ecf0a74a3a4b4a9f29a338e4a4a898'; // Your secret

process.env.NODE_ENV = 'development';

const config = require('./config.js')


const app = express()

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
    )
    
    // app.get('/', (request, response) => {
    //     response.json({info: 'Node.js, Express, and Postgres API HAHAHAHAH'})
    // })
    app.get('/user/:id', userDB.getUserById)
    app.get('/user/:channel_id', userDB.getUsersByChannelId)
    app.post('/user', userDB.createUser)
    app.put('/user/:id', userDB.updateUser)
    app.put('/user/remove/:id', userDB.removeUserFromChannel)
    app.delete('/user/:id', userDB.deleteUser)
    
    app.get('/song/:channel_id', songDB.getSongByChannelId)
    
    /**
    * Generates a random string containing numbers and letters
    * @param  {number} length The length of the string
    * @return {string} The generated string
    */
    var generateRandomString = function (length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    
    var stateKey = 'spotify_auth_state';
    
    
    
    app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());
    
    app.get('/login/:redirect_uri', function (req, res) {
        
        const redirect_uri = req.params.redirect_uri
        console.log(redirect_uri);
        var state = generateRandomString(16);
        res.cookie(stateKey, state);
        
        // your application requests authorization
        var scope = 'user-read-private user-read-email user-read-playback-state';
        res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
    });
    
    app.get('/callback', function (req, res) {
        // your application requests refresh and access tokens
        // after checking the state parameter
        const code = req.query.code;
        const redirect_uri = req.query.redirect_uri;
        
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                
                var access_token = body.access_token,
                refresh_token = body.refresh_token;
                
                // Store code at user with username in database
                userDB.storeCodeAtUser(code, redirect_uri, access_token);
                
                // we can also pass the token to the browser to make requests from there
                res.status(201).send(
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
                } else {
                    res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
                }
            });
        });
        
        app.get('/refresh_token', function (req, res) {
            
            // requesting access token from refresh token
            var refresh_token = req.query.refresh_token;
            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
                form: {
                    grant_type: 'refresh_token',
                    refresh_token: refresh_token
                },
                json: true
            };
            
            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var access_token = body.access_token;
                    res.send({
                        'access_token': access_token
                    });
                }
            });
        });
        
        
        app.listen(global.gConfig.node_port, () => {
            console.log(`App running on port ${global.gConfig.node_port}.`)
        });
        