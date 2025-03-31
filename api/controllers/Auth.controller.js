import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const checkuser = await User.findOne({ email });
        if (checkuser) {
            // user already exists
            next(handleError(409, "User already exists"));
        }

        if (
            !name ||
            !email ||
            !password ||
            name === "" ||
            email === "" ||
            password === ""
          ) {
            return next(errorHandler(400, "Compilare tutti i campi richiesti!"));
          }

        const hashedPassword = bcryptjs.hashSync(password, 10); 
        // create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: "User created successfully",
        })

    } catch (error) {
        next(handleError(500, error.message));
    }
}

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password || email === "" || password === "") {
            return next(errorHandler(400, "Compilare tutti i campi richiesti!"));
          }

        const user = await User.findOne({ email });
        if (!user) {
            next(handleError(404, "User not found"));
        }

        const hashedPassword = user.password;
        
        const comparePassword = bcryptjs.compareSync(password, hashedPassword);
        if (!comparePassword) {
            next(handleError(401, "Invalid password"));
        }

        const token = jwt.sign({
             _id: user._id,
             name: user.name,
             email: user.email,
             avatar: user.avatar
        }, process.env.JWT_SECRET);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/'
        })

        const newUser = user.toObject({getters: true});
        delete newUser.password;

        res.status(200).json({
            success: true,
            user: newUser,
            message: "Login success",
        })
    } catch (error) {
        next(handleError(500, error.message));
    }
}

export const GoogleLogin = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body;
        let user
        user = await User.findOne({ email });
        if (!user) {
            // Create new user
            const password = Math.random().toString()
            const hashedPassword = bcryptjs.hashSync(password)
            const newUser = new User({
                name, email, password:hashedPassword, avatar
            })

            user = await newUser.save();
            
        }
        
        const token = jwt.sign({
             _id: user._id,
             name: user.name,
             email: user.email,
             avatar: user.avatar
        }, process.env.JWT_SECRET);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/'
        })

        const newUser = user.toObject({getters: true});
        delete newUser.password;
        res.status(200).json({
            success: true,
            user: newUser,
            message: "Login successfully",
        })

    } catch (error) {
        next(handleError(500, error.message));
    }
}
export const Logout = async (req, res, next) => {
    try {
        res.clearCookie('access_token',  {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            path: '/'
        })

        res.status(200).json({
            success: true,
            message: "Logout successfully",
        })

    } catch (error) {
        next(handleError(500, error.message));
    }
}