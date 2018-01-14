
document.addEventListener('DOMContentLoaded', () => {
  // keep track of iframe's and user #'s with a count
  let count = 0;
  let allChildiframes = window.frames;

  // to send a message to parent window document
  let addMessage = (message) => {
    parent.postMessage(message, "*");
  }

  // parent window document listens for messages and adds them to child iframes
  window.addEventListener('message', (message) => {
    for (let i = 0; i < allChildiframes.length; i++) {
      allChildiframes[i].postMessage(message.data, '*');
    }
  })

  // when clicking the plus, user gets a new iframe window...
  document.getElementById("addNewChatUser").addEventListener('click', (e) => {
    count++;
    addMessage(`User ${count} has joined the conversation`);

    // create and add new iframe to main parent window
    let id = `iframe${count}`;
    let iframeContents = `<body><div>User ${count}</div><div id="chats"></div><form id="addNewMessage"><input value="User ${count}:" placeholder="be kind :)" /><button>send</button></form></body>`;
    let newiframe = document.createElement("iframe", { id });
    document.body.appendChild(newiframe);
    newiframe.contentWindow.document.write(iframeContents);

    // add listener to this iframe for new message form submission
    newiframe.contentWindow.document.getElementById("addNewMessage").addEventListener('submit', (e) => {
      e.preventDefault();
      addMessage(e.target[0].value);
    })

    // add listener to this iframe for new chat messages to add coming from parent window
    newiframe.contentWindow.addEventListener('message', (message) => {
      // create a paragraph (p) with contents of broadcasted message to add to the chats div in this iframe / each iframe
      let p = document.createElement("p");
      let text = document.createTextNode(message.data);
      p.appendChild(text);
      newiframe.contentWindow.document.getElementById("chats").appendChild(p);
    })
  }) // end of addNewChatUser click listener

}) // end of DOMContentLoaded listener




