const Message = require("../models/message");

module.exports = io => {
    io.on("connection", client => {
        console.log("new connection");

        Message.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .then(messages => {
                client.emit('load all messages', messages.reverse());
            });

        client.on("disconnect", () => {
            client.broadcast.emit("user disconnected");
            console.log("user disconnected");
        });

        client.on("message", (data) => {
            let msgAttributes = {
                content: data.content,
                userName: data.userName,
                user: data.userId
            },
                m = new Message(msgAttributes);
            m.save()
                .then((m) => {
                    let data = {
                        content: m.content,
                        userName: m.userName,
                        user: m.user,
                        timestamps: m.createdAt
                    }
                    io.emit("message", data);
                    client.broadcast.emit("flickMessage");
                })
                .catch(error => console.log(`error: ${error.message}`));
        });
    });
};