/*jshint esversion: 6 */
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/myNewdb2";
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(express.static(__dirname + '/public'));

// app.use(express.static(path.join(__dirname, '/public')));

// var dcity;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.get('/', function (req, res) {  
  res.render('watch', {
    data: null,
    imdData: null,
    imd: null,
    error: null,
    min: null,
    max: null
  });
});

app.post('/home', function (req, res) {
  
  if(req.body.selection == 'Watch IMD') 
  {
    
    res.render('watch', {
      data: null,
      imdData: null,
      imd: null,
      error: null,
      min: null,
      max: null
    });

  } 
  

});
app.post('/watch', function (req, res) {
  if (req.body.selectionImd == 'Health') {
    

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("myNewdb2");
      var data;
       

      var e = dbo.collection("shortAndSelected4")
        .find()
        .project({
          _id: 0,
          lat: 1,
          long: 1,
          HealthScore: 1
        }).toArray(function (err, result) {
          var bundle = [];
          var min = 0;
          var max = 0;
          result.forEach(function (value, index, ar) {
            
            if (value.HealthScore < min) {
              min = value.HealthScore;
              console.log("h",min);
            }
            if (value.HealthScore > max) {
              max = value.HealthScore;
            }
           
            bundle.push({
              lat: parseFloat(value.lat),
              long: parseFloat(value.long),
              weight: (  parseFloat(value.HealthScore)),
            });


          });
          
          dbo.collection("imd2").find().toArray(function(err2,resultImd){
            
            res.render('watch', {
              data: bundle,
              imdData:resultImd,
              imd: 'Health',
              error: "Nothing out of mongo",
              min: min,
              max: max
            });            
          });
          
        });
    });
  } else if (req.body.selectionImd == 'Crime') {


    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("myNewdb2");
      var data;

      var e = dbo.collection("shortAndSelected4")
        .find()
        .project({
          _id: 0,
          lat: 1,
          long: 1,
          CrimeScore: 1
        }).toArray(function (err, result) {
          var bundle = [];
          var min = 0;
          var max = 0;
          result.forEach(function (value, index, ar) {
            if (value.CrimeScore < min) {
              min = value.CrimeScore;
            }
            if (value.CrimeScore > max) {
              max = value.CrimeScore;
            }
            bundle.push({
              lat: parseFloat(value.lat),
              long: parseFloat(value.long),
              weight:   parseFloat(value.CrimeScore),
            });
          });

          dbo.collection("imd2").find().toArray(function(err2,resultImd){
            res.render('watch', {
              data: bundle,
              imdData:resultImd,
              imd: 'Crime',
              error: "Nothing out of mongo",
              min: min,
              max: max
            });            
          });

        });
    });
  } else if (req.body.selectionImd == 'Employment') {
    

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("myNewdb2");
      var data;

      var e = dbo.collection("shortAndSelected4")
        .find()
        .project({
          _id: 0,
          lat: 1,
          long: 1,
          EmploymentScore: 1
        }).toArray(function (err, result) {
          var bundle = [];
          var min=0;
          var max=0;
          result.forEach(function (value, index, ar) {
            if (value.EmploymentScore < min) {
              min = value.EmploymentScore;
            }
            if (value.EmploymentScore > max) {
              max = value.EmploymentScore;
            }
            bundle.push({
              lat: parseFloat(value.lat),
              long: parseFloat(value.long),
              weight:   parseFloat(value.EmploymentScore),
            });
          });

          dbo.collection("imd2").find().toArray(function(err2,resultImd){
            res.render('watch', {
              data: bundle,
              imdData:resultImd,
              imd: 'Employment',
              error: "Nothing out of mongo",
              min: min,
              max: max
            });            
          });


        });
    });
  } else if (req.body.selectionImd == 'Education') {
    

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("myNewdb2");
      var data;

      var e = dbo.collection("shortAndSelected4")
        .find()
        .project({
          _id: 0,
          lat: 1,
          long: 1,
          EducationScore: 1
        }).toArray(function (err, result) {
          var bundle = [];
          var min = 0;
          var max = 0;
          result.forEach(function (value, index, ar) {
            if (value.EducationScore < min) {
              min = value.EducationScore;
            }
            if (value.EducationScore > max) {
              max = value.EducationScore;
            }
            bundle.push({
              lat: parseFloat(value.lat),
              long: parseFloat(value.long),
              weight:   parseFloat(value.EducationScore),
            });
          });

          
          dbo.collection("imd2").find().toArray(function(err2,resultImd){
            res.render('watch', {
              data: bundle,
              imdData:resultImd,
              imd: 'Education',
              error: "Nothing out of mongo",
              min: min,
              max: max
            });            
          });
        });
    });
  }

});
// app.post('/map', function (req, res) {
//   let city = req.body.city;
//   googleMapsClient.geocode({
//     address: city
//   }, function (err, response) {
//     if (!err) {
//       dcity = response.json.results[0];
//       var lat = dcity.geometry.location.lat;
//       var lng = dcity.geometry.location.lng;
//       let url = `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}`;

//       request(url, function (err, response, body) {
//         if (err || !body) {
//           res.render('index2', {
//             dataPolice: null,
//             error: 'Error, please try again'
//           });
//         } else {
//           let data = JSON.parse(body);
//           if (data == undefined) {
//             res.render('index2', {
//               dataPolice: null,
//               error: 'Error, please try again'
//             });
//           } else {
//             let dataT = data;
//             res.render('index2', {
//               dataPolice: body,
//               error: null
//             });
//           }
//         }
//       });
//     }
//   });

// });
app.listen(8080, function () {
  console.log('Example app listening on port 3000!');
}); 