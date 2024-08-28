const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        console.log('Starting user registration process...');

        // Hashing the password
        console.log('Hashing the password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully.');

        // Creating a new user instance
        console.log('Creating a new user instance...');
        const user = new User({
            name,
            username,
            email,
            password: hashedPassword,
        });
        console.log('User instance created:', user);

        // Saving the user to the database
        console.log('Saving user to the database...');
        await user.save();
        console.log('User saved successfully.');

        // Sending response to the client
        res.status(201).json({ message: 'User registered successfully' });
        console.log('Response sent: User registered successfully');
    } catch (error) {
        // Handling errors
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found.`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log(`Password does not match for user ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        console.error('Error during login', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};
