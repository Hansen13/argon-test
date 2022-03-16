
const express = require('express'); //Import the express dependency
const bcrypt = require('bcryptjs')
const argon2 = require('argon2');
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;

//Save the port number where your server will be listening

app.use(express.json())
//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {        //get requests to the root ("/") will route here
    res.sendFile('index.html', {root: __dirname});      //server responds by sending the index.html file to the client's browser
                                                        //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.post('/bhash', (req, res) => {
    res.status(201).json({hash: bcrypt.hashSync(req.body.password)});
})

app.post('/bverify', (req, res) => {
    res.status(201).json({verify: bcrypt.compareSync( req.body.verifyPassword, req.body.hash)})
})

app.post('/ahash', async (req, res) => {
    res.status(201).json({hash: await argon2.hash(req.body.password,{type: argon2.argon2id,memoryCost: 2** 16})})
})

app.post('/averify', (req, res) => {
    res.status(201).json({ verify: argon2.verify(req.body.hash, req.body.verifyPassword)})
})

app.listen(port, () => { 
    console.log(`Now listening on port ${port}`); 
});