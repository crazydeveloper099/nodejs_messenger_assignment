import 'dotenv/config';
import  request from 'request';

// Handles messages events

let jsonData=[]

let mid="m_sLqlbWISPl-j7md2PP1W9N0r5Wypoh59hOQHxlpBElujGrilbY9ISeUpbGHk2UpOFwRqvQiFZn4-Kxri--K4cA"
function handleMessage(sender_psid, received_message, count) {
    
    let response;
    // Check if the message contains text
    if (received_message.text) {    
        
    response={
            "attachment":{
            "type":"template",
            "payload":{
            "template_type":"button",
            "text":"What do you want to do next?",
            "buttons":[
                {
                    "type": "postback",
                    "title": "Enter your name",
                    "payload": "str1"
                },
            
            ]
            }
        }
        }
    }
    
    else if (received_message.attachments) {
        let attachment_url = received_message.attachments[0].payload.url;

        

        response = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "Is this the right picture?",
                  "subtitle": "Tap a button to answer.",
                  "image_url": attachment_url,
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "Yes!",
                      "payload": "yes",
                    },
                    {
                      "type": "postback",
                      "title": "No!",
                      "payload": "no",
                    }
                  ],
                }]
              }
            }
          }
      

        console.log(attachment_url);
    } 
    
    // Sends the response message
    callSendAPI(sender_psid, response);    
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;
  
    // Get the payload for the postback
    let payload = received_postback.payload;
  
    // Set the response based on the postback payload
    if (payload === 'yes') {
      response = { "text": "Thanks!" }
    } else if (payload === 'no') {
      response = { "text": "Oops, try sending another image." }
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

export const postWebhook =(req,res)=>{ 
    // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    let count=0;
    body.entry.forEach(function(entry) {
            // Gets the body of the webhook event

        let webhook_event = entry.messaging[0];
        // console.log(webhook_event);


        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
            console.log("-------");
            console.log(body);
            console.log("-------");
            handleMessage(sender_psid, webhook_event.message,count);  

        } else if (webhook_event.postback) {
            handlePostback(sender_psid, webhook_event.postback);
        }
        
            
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}

export const getWebhook =(req,res)=>{

        // Your verify token. Should be a random string.
        let VERIFY_TOKEN = process.env.FB_MESSENGER_TOKEN;

          
        // Parse the query params
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];
          
        // Checks if a token and mode is in the query string of the request
        if (mode && token) {
        
          // Checks the mode and token sent is correct
          if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
          
          } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);      
          }
        }

}



// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
        "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v13.0/me/messages",
    "qs": { "access_token": process.env.FB_APP_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log(`message sent!,`)
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

