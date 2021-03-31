const mongoose = require("mongoose"),
    subscriberSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        zipCode: {
            type: Number,
            min: [100000, "Zip code too short"],
            max: 999999
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course"
            }
        ]
    });

subscriberSchema.methods.getInfo = function () {
    return `Name: ${this.name} Email: ${this.email} Zip Code:
        ${this.zipCode}`;
};

subscriberSchema.methods.findLocalSubscribers = function () {
    return this.model("Subscriber")
        .find({ zipCode: this.zipCode })
        .exec();
};

module.exports = mongoose.model("Subscriber", subscriberSchema);

