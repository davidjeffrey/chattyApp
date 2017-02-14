require('../styles/application.scss');

import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
// import Message from './Message.jsx';

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let colour = getRandomColor()

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
          currentUser: {name: "Anonymous"},
          presviousUser: {name: "Anonymous"},
          messages: [],
          notifications: [],
          textColor: {color: colour}
        };
    }

    handleUserEnter  = (e) => {
      if (e.key === "Enter") {
        console.log(e.target.value)
        let newName = e.target.value
        if (this.state.presviousUser.name === undefined) {
          this.setState({presviousUser: {name: "Anonymous"}})
        } else {
          this.setState({presviousUser: {name: this.state.currentUser.name}})
        }
        this.setState({currentUser: {name: newName}})
        let notification = {
          oldName: this.state.presviousUser.name,
          name: newName,
          type: 'incomingNotification',
          id: ""
        }
        this.socket.send(JSON.stringify(notification))
      } else {
        console.log('key stroke')
      }
    }

    handlePressEnter = (e) => {
      if (e.key === "Enter") {
        const newMessage = {
          id: this.state.messages.length + 1,
          username: this.state.currentUser.name,
          userColor: this.state.textColor.color,
          content: e.target.value,
          type: 'incomingMessage'
        };

        this.socket.send(JSON.stringify(newMessage));
        e.target.value = "";
        console.log("enter")
      } else {
        console.log('key stroke');
      }
    }

    handleWSMessage = (event) => {
      console.log(event.data)
      let messages = JSON.parse(event.data)
      this.setState({messages})
      }


    componentDidMount() {
        console.log('componentDidMount <App />');
        this.socket = new WebSocket("ws://localhost:4000");
        this.socket.onmessage = this.handleWSMessage;
    }

    render() {
        return (
            <div>
                <MessageList messages={this.state.messages}/>
                <ChatBar handleUserEnter={this.handleUserEnter} handlePressEnter={this.handlePressEnter}/>
            </div>
        );
    }
}
export default App;
