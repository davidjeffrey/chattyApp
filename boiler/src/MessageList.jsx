import React, {Component} from 'react';

class MessageList extends Component {
    render() {
        let results = this.props.messages;
        return (
            <main className="messages">
                <ul>
                    {results.map(function(result) {
                        if (result.type === "count") {
                            return (
                                <div className="navbar-count" key={result.id}>Users Online: {result.count}</div>
                            )
                        }
                        if (result.type === "incomingMessage") {
                            console.log("a message");
                            console.log(result.userColor)
                            return (
                                <li key={result.id}>
                                    <div className="message-username" style={{
                                        color: result.userColor
                                    }}>{result.username}</div>
                                    <div className="message-content">{result.content}</div>
                                </li>
                            )
                        } else {
                            console.log("a notification");
                            return (
                                <li key={result.id}>
                                    <div className="message system">
                                        {result.oldName}
                                        changed their name to {result.name}.</div>
                                </li>
                            )
                        }
                    })}
                </ul>
            </main>
        )
    }
}

export default MessageList;
