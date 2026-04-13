import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    // user schema
    {
        username:{type: String, required: true, unique: true},
        email:{type: String, required: true, unique: true},
        password:{type: String, required: true},
        // role can only be "user" or "admin"
        role: { type: String, default: "user", enum: ["user", "admin"] },
    },
    // when did the user schema was created
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;