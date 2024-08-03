const { v4: uuidv4 } = require('uuid');
const users = require('../data/users');
const { hashPassword , verifyPassword} = require('../helpers/password_helpers');
const validateEmail = require('../helpers/validation');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


exports.getUsers = (req, res) => { // get all users
    res.status(200).json(users);
}

exports.createUser = async (req, res) => { // create a new user (Register)
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Email is not valid' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password should be at least 6 characters' });
    }
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hash_password = await hashPassword(password);
    const user = {
        id : uuidv4(),
        email : email,
        password :hash_password,
        is_store_owner : false,
        created_at : new Date()
    };
    users.push(user);
    res.status(201).json(user.email);

}

exports.login = async (req, res) => { // login a user
    const { email, password } = req.body;

    if (!(users.find(user => user.email === email))) {
        return res.status(400).json({ message: 'User does not exist' });
    }else{
        const user = users.find(user => user.email === email);
        if(await verifyPassword(password,user.password)){
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
                expiresIn: '24h',
              });
            res.status(200).json(token);
        }else{
            return res.status(400).json({ message: 'Password is incorrect' });
        }
    }

}


