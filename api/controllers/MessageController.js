/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  find: function(req, res) {
    console.log("GET /message");
    var threadId = req.param('thread_id');

    Message.find({ thread: threadId }).exec(function(err, messages) {

/*
      if (req.isSocket) {
        Message.subscribe(req, messages);
        if (req.options.autoWatch) {
          Message.watch(req);
        }
      }
*/

      res.json(messages);
    });
  },

  create: function(req, res) {
    console.log("POST /message");
    var text = req.param('text');
    var threadId = req.param('thread_id');

    Message.create({ thread: threadId, text: text }).exec(function(err, message) {
/*
      if (req.isSocket) {
        Message.publishCreate(message, !req.options.mirror && req);
      }
*/

      if (req.isSocket) {
        Thread.publishUpdate(message.thread, {
          model: 'message',
          body: message
        }, !req.options.mirror && req);
      }

      res.json(message);
    });
  }

};

