let mongoose = require('mongoose'),
    Shotgun = mongoose.model('Shotguns'),
    mail = require('../../utils/mailController'),
    async = require('async');

// handler after a complete shotgun
exports.afterCompleteShotgun = (shotgun) => {   

  // retrieve the complete shotgun and populate the users' fields
  let retrieveShotgun = function(shotgun, callback){
    Shotgun.findById(shotgun._id, {__v: 0}).
    populate('room', {__v: 0}).
    populate('user', {password: 0, __v: 0}).
    populate('roommates', {password: 0, __v: 0}).
    exec(function (err, populatedShotgun) {
      if (err) {
        console.error("-> Couldn't populate shotgun " + shotgun._id + ".");
        let error = new Error("Couldn't populate shotgun " + shotgun._id + ".");
        error.name = "Error 500 : Internal Server error";
        error.httpStatusCode = "500";
        return callback(error);
      }
      callback(null, populatedShotgun);
    });
  }


  // create and send a recap mail to all users
  let sendMails = function(populatedShotgun, callback){

    let userOwner = populatedShotgun.user;
    let roommates = populatedShotgun.roommates;
    let users = roommates;
    users.push(userOwner);
    let room = populatedShotgun.room;
    
    let usersList = [];
    users.forEach(
      function(item){
        usersList.push('<li>' + item.username + '</li>');
      }
    )

    let title = `Shotgun terminé !`;
    let content = `<p>Félicitations, tu as trouvé un endroit où dormir dans la belle villa des Gênets! </p>
      <br/>
      <p>
        Récapitulatif du shotgun: 
          <ul>
                  <li>` + userOwner.username + ` a shotgun la chambre ` +  room.text + `.</li>
                  <li>Compagnons de chambre : <ul>  ` +  usersList + ` </ul></li>
          </ul>
      </p>
      <br/><br/>
      <br>A très bientôt à la villa!</br>
      <br/><br/>
      <i>Ceci est un mail automatique. Pour toute assistance, contactez-nous via <a href="mailto:houlegatefest.gmail.com">
      houlgatefest.gmail.com</a>.`;

    
    // send mail to all users
    var stackSendMail = [];
    users.forEach(
      function(item){
        let mailContent = {
          to: item.email,
          subject: title,
          text: content
        };
        var sendMail = function(mailContent, callback) {
          mail.mailSender(mailContent, (err, sentMail) => {
            if (err) {
              console.error("-> Recap sending failed for user " + item.username + ".");
              let error = new Error("Couldn't send email to users after shotgun " + populatedShotgun._id + " completed.");
              error.name = "Error 500 : Internal Server error";
              error.httpStatusCode = "500";
              return callback(error);
            }
            console.log("Recap mail sent to " + item.username);
            return callback();
          }
        )
      }
        stackSendMail.push(sendMail.bind(null, mailContent));
      }
    )
    console.log("Sending recap emails to all users...");
    async.parallel(stackSendMail, callback);
  }

  async.waterfall([
    retrieveShotgun.bind(null, shotgun),
    sendMails
  ], (err, result) => {
    if (err) return console.error("-> After complete shotgun failed for shotgun with id:" + shotgun._id + ".");
    return console.log("...Recap sent to all users.");
  }
)}

 
      