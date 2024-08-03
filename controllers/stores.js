const users = require('../data/users');
const stores = require('../data/stores');

const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../helpers/password_helpers');
const validateEmail = require('../helpers/validation');

Atomics
exports.createStore = async (req, res) => { // Create a new store
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Store Name, Email and Password are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password should be at least 6 characters' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Email is not valid' });
    }
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hash_password = await hashPassword(password);
    const user = { // Create the store owner
        id : uuidv4(),
        email : email,
        password :hash_password,
        is_store_owner : true,
        created_at : new Date()
    };

    const store = {
        id : uuidv4(),
        name : name,
        store_owner : user.id,
        active : true,
        created_at : new Date()
    };

    users.push(user);
    stores.push(store);

    res.status(201).json(store.name);

}
