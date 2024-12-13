"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
// Register
const register_handler = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { fullname, email, password } = req.body;
        try {
            if (!email) {
                throw new Error("Email is required!");
            }
            if (!password) {
                throw new Error("Password is required");
            }
            if (!fullname) {
                throw new Error("Fullname is required");
            }
            const userDoc = yield user_1.default.findOne({ email: email });
            if (userDoc != null) {
                throw new Error("Email already exist");
            }
            const new_user = yield user_1.default.create(req.body);
            res.status(201).send({ success: true, data: new_user._id.toString() });
        }
        catch (error) {
            next(error);
        }
    });
};
// Login
const login_handler = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            if (!email) {
                throw new Error("Email is required!");
            }
            if (!password) {
                throw new Error("Password is required");
            }
            const userDoc = yield user_1.default.findOne({ email: email });
            if (userDoc == null) {
                throw new Error("Credentials are invalid!");
            }
            // Verify the password
            const salt = yield (0, bcrypt_1.genSalt)(10);
            const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
            const passwordMatch = yield (0, bcrypt_1.compare)(userDoc.password, hashedPassword);
            if (!passwordMatch) {
                throw new Error("Credentials are invalid!");
            }
            if (!process.env.SECRET_KEY) {
                throw new Error("No secret is provided!");
            }
            const token = (0, jsonwebtoken_1.sign)({
                user_id: userDoc._id,
                fullname: userDoc.fullname,
                email: userDoc.email,
            }, process.env.SECRET_KEY);
            res.status(201).send({ success: true, data: token });
        }
        catch (error) {
            next(error);
        }
    });
};
