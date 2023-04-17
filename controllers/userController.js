import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mongoose from "mongoose";
//?Signin
const secret = 'secret';
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const oldUser = await User.findOne({ email });

        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "30d" });

        res.status(200).json({ result: oldUser, token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
//?signup
export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

        const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "30d" } );

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });

        console.log(error);
    }
};
//?getAll Users
export const getUsers = async (req, res) => {
    const {page} = req.query;
    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await User.countDocuments({})
        const posts = await User.find().sort({_id: -1}).limit(LIMIT).skip(startIndex);
        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
};

//?deletePost
export const deleteUser = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No user with that id");
    await User.findByIdAndRemove(id);
    res.json({message: `User deleted successfully`});

};