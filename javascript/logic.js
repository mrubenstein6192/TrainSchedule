// Initialize Firebase
var config = {
  apiKey: "AIzaSyBCjmE80G2BdjzV1M2yV_6tkddTKEt9pZM",
  authDomain: "train-schedule-58ec1.firebaseapp.com",
  databaseURL: "https://train-schedule-58ec1.firebaseio.com",
  projectId: "train-schedule-58ec1",
  storageBucket: "train-schedule-58ec1.appspot.com",
  messagingSenderId: "213170129628"
};
firebase.initializeApp(config);

var database = firebase.database();
$("#train-form").on("submit", function(event) {
  event.preventDefault();

  //get form data from user input
  var trainDataInput = {
    train: $("#train-input").val().trim(),
    destination: $("#destination-input").val().trim(),
    firstTrainTime: $("#start-input").val().trim(),
    frequency: $("#frequency-input").val().trim()
  }

  database.ref().push(trainDataInput);
  console.log(trainDataInput);
});

//child added
database.ref().on("child_added", function(childSnapshot) {
  console.log("this is child_added");
  console.log(childSnapshot.val());

  var trainData = childSnapshot.val();

  var tFrequency = trainData.frequency;
  console.log("Frequency is " + tFrequency);

  var firstTime = trainData.firstTrainTime;
  console.log("First time is" + firstTime);
 
  var firstTimeConverted = moment(firstTime, "H:mm").subtract(1, "years");
    console.log(firstTimeConverted);

  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("H:mm"));
  
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("H:mm"));


  //create table row
  var $tr = $("<tr>");

  //create <td> tage for the columns
  var $tdTrain = $("<td>").text(trainData.train);
  var $tdDestination = $("<td>").text(trainData.destination);
  var $tdFrequency = $("<td>").text(trainData.frequency);

  //finish later
  var $tdArrival = $("<td>").text((nextTrain).format("H:mm"));

  //finish minutes away later
  var $tdMinutesAway = $("<td>").text(tMinutesTillTrain);

  //add content to what is displayed
  $tr.append($tdTrain, $tdDestination, $tdFrequency, $tdArrival, $tdMinutesAway);

  $("tbody").append($tr);

});