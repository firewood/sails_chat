/**
 * ThreadController
 *
 * @description :: Server-side logic for managing threads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function(req, res) {
    console.log("POST /thread");
    var title = req.param('title');

    Thread.findOne({ title: title }).exec(function(err, thread) {
      // すでに同名のスレッドがあれば返す
      if (thread) {
        console.log("thread already exists");
        Thread.subscribe(req.socket, thread);
        return res.json(thread);
      }

      Thread.create({ title: title }).exec(function(err, thread) {
        Thread.subscribe(req.socket, thread);
        res.json(thread);
      });
    });
  }

};

