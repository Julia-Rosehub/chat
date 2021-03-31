const mongoose = require("mongoose"),
    Subscriber = require("./models/subscriber");

mongoose.connect(
    process.env.DB_URL || "mongodb://localhost/chat_db",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection;

let contacts = [
    {
        name: "Shirley Manson",
        email: "shirley@example.com",
        zipCode: 200700
    },
    {
        name: "Blondie",
        email: "blondie@example.com",
        zipCode: 210700
    },
    {
        name: "John Snow",
        email: "john@example.com",
        zipCode: 210700
    }
];

Subscriber.deleteMany()
    .exec()
    .then(() => {
        console.log("Subscriber data is empty!");
    });

let commands = [];

contacts.forEach(contact => {
    commands.push(Subscriber.create({
        name: contact.name,
        email: contact.email,
        zipCode: contact.zipCode
    }));
});

Promise.all(commands)
    .then(res => {
        console.log(JSON.stringify(res));
        mongoose.connection.close();
    })
    .catch(error => {
        console.log(`ERROR: ${error}`);
    });