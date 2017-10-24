// YOUR CODE HERE:

app = {
  rooms: [],
  lastTimestamp: '2016-10-13T20:48:41.072Z',
  server: 'http://127.0.0.1:3000/classes/messages',
  init: function() {
    console.log('initalize!');
    this.fetch();
    setInterval(this.fetch.bind(this), 3000);
  },

  send: function(message) {
    event.preventDefault();
    let url = window.location.href;
    let username = url.split('?')[1].split('=')[1];
    console.log(`url split ${username}`);
    message = message || {username: username, roomname: 'lobby', text: $('.input-message').val() };
    console.log(`message is: ${JSON.stringify(message)}`);
    $.ajax({
      url: this.server,
      type: 'POST',
      // contentType: 'application/json',
      // "content-type": 'application/json',
      data: JSON.stringify(message)
    }).success( ()=> {
      console.log('SUCCESSFULLY POSTED');
      app.fetch();
    });
  },

  fetch: function() {
    $.ajax({
      url: this.server,
      type: 'GET',
      // data: { order: "-createdAt" },
      success: 
        function(messages) {
          let filter = [];
          for (let message of messages.results) {
            // if (message.createdAt > app.lastTimestamp || app.lastTimestamp === '') {
            filter.push(message);
            // } else {
            //   console.log(`GET - filtered is ${JSON.stringify(filter)}`)
            //   filter.length > 0 ? app.lastTimestamp = filter[0].createdAt : null
            //   break
            // }
          }
          console.log(`GET - filtered initial is ${JSON.stringify(filter)}`);
          // if (filter.length > 0) { 
          //   app.lastTimestamp = filter[0].createdAt

          for (let i = filter.length - 1; i > -1; i--) {
            let message = Object.assign({}, filter[i]);
            console.log('app.renderMessage(message) is ', app);
            app.renderMessage(filter[i]);
          }
          //}
        }
    });
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  renderMessage: function(message) {
    console.log(`IN RENDER MESSAGE IS: ${JSON.stringify(message)}`);
    let replacer = (match) => { return ''; };
    $('#chats').prepend(
      `<div class="chat">
        <div class="username">${message.username.replace(/[<>]/g, replacer)}</div>
        <div class="message">${message.text.replace(/[<>]/g, replacer)}</div>
       </div>`);

    let room = message.roomname.replace(/[<>]/g, replacer);
    this.renderRoom(room);
  },

  renderRoom: function(roomName) {
    if (!this.rooms.includes(roomName)) {
      $('select').append(`<option value="${roomName}">${roomName}</option>`);
      this.rooms.push(roomName);
    }
  },

  handleUsernameClick: function() {

  },

  handleSubmit: function() {}
};

app.init();