import mongoose from "mongoose";

export const noteschema = new mongoose.Schema({
    title: {type: String, required: true},
    subject: {type: String, required: true},
    body: {type: String, required: true}
});
