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

document.addEventListener('DOMContentLoaded', () => {

  // when clicking the plus, user gets a new iframe window...
  document.getElementById("addNewChatUser").addEventListener('click', (e) => {
    count++;
    addMessage(`User ${count} has joined the conversation`);

    // create and add new iframe to main parent window
    let id = `iframe${count}`;
    let iframeContents = `<head><link href="css/iframeStyle.css" rel="stylesheet" type="text/css" /></head><body><div class="userNameDiv">User ${count}</div><div id="chats"></div><form id="addNewMessage"><input value="User ${count}" id="userNameInput" /><input placeholder="be kind :)" id="userInput" /><button>send</button></form></body>`;
    let newiframe = document.createElement("iframe");
    newiframe.id = id;
    newiframe.name = id;
    let iframeDiv = document.createElement("div");
    iframeDiv.id = `iframeDiv${count}`;
    iframeDiv.className = "iframeDiv";
    iframeDiv.appendChild(newiframe);
    document.getElementById('chatBoxes').appendChild(iframeDiv);
    newiframe.contentWindow.document.write(iframeContents);

    // add dragging feature for this iframe
    $(`#iframeDiv${count}`).draggable({
      iframeFix: true,
      zIndex: 100,
      stack: `#iframeDiv${count}`
    })

    // add listener to this iframe for new message form submission
    newiframe.contentWindow.document.getElementById("addNewMessage").addEventListener('submit', (e) => {
      e.preventDefault();
      // Change User Name
      if(!e.target[0].value.includes('User')){
        newiframe.contentWindow.document.getElementById("userNameInput").value = e.target[0].value;
        newiframe.contentWindow.document.getElementsByClassName("userNameDiv")[0].innerHTML = e.target[0].value;
      }
      // Send message up to parent window
      addMessage(e.target[0].value + ': ' + e.target[1].value);
      // Reset input field
      newiframe.contentWindow.document.getElementById("userInput").value = "";
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
