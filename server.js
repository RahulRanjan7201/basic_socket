const express = require('express');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')
const dburl ="url";
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname))
const Message = mongoose.model('message', {
    name:String, 
    message: String
})
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
 
})
app.post('/messages', (req, res) => {
    const mess = new Message(req.body)
    mess.save(err => {
        if(err) res.sendStatus(500)
        io.emit('message', req.body)
        res.sendStatus(200)
    });
})
io.on('connection', socket => {
    console.log('user connected')
})
mongoose.connect(dburl , (err) => {
    console.log("mongo db connect error", err)
})
let server = http.listen(3000, () => {
    console.log("server is listening on port", server.address().port)
})
