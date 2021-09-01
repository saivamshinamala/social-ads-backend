const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const http = require('http');
const url = require('url');

const Video = require('./models/video');

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

mongoose.connect("mongodb+srv://onlineads:aaa143a1@cluster0.7eakc.mongodb.net/online-ads?retryWrites=true&w=majority")
.then(() => {
    console.log("connected");
})
.catch(() => {
    console.log("not connected");
});

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

app.use(function(req, res, next) {
    console.log("called");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/upload", async(request, response) => {
    console.log("uploading data");
    console.log(request.body.creatorId);
    const video = new Video({
      creatorId: request.body.creatorId,
      video: request.body.video,
      title: request.body.title,
      link: request.body.link,
      language: request.body.language,
      views: request.body.views,
      budget: request.body.budget,
      pastelink: request.body.pastelink,
      promote: request.body.promote,
      displayDelete: request.body.displayDelete,
      displayPromote: request.body.displayPromote
    });
    console.log(video.creatorId, " ", video.title);
    video.save()
    .then(() => {
        response.status(201).json({message: "Successful"});
    })
    .catch(() => {
        response.status(201).json({message: "Unsuccessful"});
    });    
  });

  app.get("/getAds", async(request, response) => {
      await Video.find()
      .then(ads => {
        response.status(200).json(ads);
      });
      
  });

  app.get("/user-ads", async(request, response) => {
    const queryObject = url.parse(request.url, true).query;
    Video.find({
      creatorId: queryObject.creatorId
    }).then(ads => {
      response.status(200).json(ads);
    });
  });

  app.get("/redirect", async(request, response) => {
    
    const queryObject = url.parse(request.url, true).query;

    await Video.findOne({ _id: queryObject.videoid })
    .then(ad => {
      response.redirect(ad.link);
    });
  });