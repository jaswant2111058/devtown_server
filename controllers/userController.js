const users = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendmail = require('../utils/mailSender');

// Middleware to attach team_id (mongodb) with req
exports.authMiddleware = async (req, res, next) => {
    try {
        // Check if authorization token is present in the header
        const authorizationHeaderToken = req.headers.authorization;
        if (!authorizationHeaderToken) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = authorizationHeaderToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details (excluding password) based on decoded email
        const user = await users.findOne({ email: decoded.email }).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Attach decoded email to req object for further use
        req.email = decoded.email;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Token expired"
            });
        }

        console.log(typeof (error));
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

// Controller for user login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user with the provided email exists
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User email does not exist"
            });
        }

        // Check if the provided password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // Update login_count and send response
        res.status(200).send({
            msg: `User logged in`,
            user: {
                user_id: user._id,
                email: email,
                username: user.username,
                token: token,
                expires_in: new Date(Date.now() + 60 * 60 * 1000),
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

// Controller for user signup
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const preEmail = await users.findOne({ email });
        if (preEmail) {
            return res.send({ message: "Email already exists" });
        } else {
            // Generate a token for email verification
            const token = jwt.sign({ password: password }, process.env.JWT_SECRET, {
                expiresIn: `${1000 * 60 * 5}`
            });

            // Construct the current URL for email verification
            const currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

            // Send email with verification link
            sendmail(username, email, token, currentUrl);

            // Send response
            res.status(200).send({ message: `Mail has been sent to the email Id ${email}` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};
