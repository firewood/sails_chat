(function() {

  function appendMessage(message) {
    $('#chat-timeline').append('<li>' + message + '</li>');
  }

  function getMessages(threadId) {
    io.socket.get("/message", {thread_id: threadId}, function(messages) {
      for (var i = 0; i < messages.length; i++) {
        appendMessage(messages[i].text);
      }
    });
  }

  var currentThread;

/*
  io.socket.on('message', function(message) {
    if (message.verb == 'created') {
      appendMessage(message.data.text);
    }
  });
*/

  $('#chat-send-button').on('click', function() {
    if (!currentThread) return;

    var $text = $('#chat-textarea');
    var msg = $text.val();

    io.socket.post('/message', {
      text: msg,
      thread_id: currentThread.id
    }, function(res) {
      appendMessage(res.text);
      $text.val('');
    });
  });

  $('#thread-create-button').on('click', function() {
    var $text = $('#thread-form');

    var title = $text.val();

    // Thread作成or取得
    io.socket.post('/thread', {
      title: title
    }, function(res, a) {
      $('#current-thread').text("in " + res.title);
      // 取得したThreadのメッセージを取ってくる
      getMessages(res.id);
      currentThread = res;
      $text.val('');
    });
  });

  io.socket.on('thread', function(thread) {
    console.log("THREAD");

    if (thread.verb == "updated" && thread.data.model == 'message') {
      appendMessage(thread.data.body.text);
    }
  });

})();
