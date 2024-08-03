const { v4: uuidv4 } = require('uuid');
const products = require('../data/products');
const users = require('../data/users');
const stores = require('../data/stores');

const ProductSerializer = require('../serializers/products.serializer.js');

exports.getProducts = (req, res) => { // Get all products
    const user = users.find(user => user.id === req.user.id);
    const { store , category , sort } = req.query;
    if(user && user.is_store_owner){
        const user_store = stores.find(store => store.store_owner === req.user.id);
        if(!user_store){
            res.status(404).json({ message: 'Store owner have not store' });
        }
        const store_products = products.filter(product => {
            matched_products = product.store === user_store.id // Filter products by store
            if(category){
                matched_products = matched_products && product.category === category
            }
            return matched_products

        });
        const serializedProducts = ProductSerializer.serializeList(store_products);

        res.status(200).json(serializedProducts);
    }else{
        const filtered_products = products.filter(product => { // Filter products
            let matched_products = true;
            if(store){
                matched_products = matched_products && product.store === store
            }
            if(category){
                matched_products = matched_products && product.category === category
            }
            return matched_products

        });
        if (sort) { // Sort products
            filtered_products.sort((a, b) => {
                if (sort === 'asc') {
                    return a.price - b.price;
                } else if (sort === 'desc') {
                    return b.price - a.price;
                }
            });
        }
        const serializedProducts = ProductSerializer.serializeList(filtered_products);

        res.status(200).json(serializedProducts);
    }
}

exports.createProduct = (req, res) => { // Create a new product
    const user = users.find(user => user.id === req.user.id);
    if(user.is_store_owner){ // Check if user is store owner
        const user_store = stores.find(store => store.store_owner === req.user.id);
        const { name, description, price, category } = req.body;
        if (!name || !description || !price) {
            return res.status(400).json({ message: 'Name, Category, Description and Price are required' });
        }
        if(products.find(product => product.name === name)){
            return res.status(400).json({ message: 'Product already exists' });
        }

        const product = {
            id : uuidv4(),
            name : name,
            description : description,
            price : price,
            store : user_store.id,
            category : category,
            created_at : new Date()
        };
        products.push(product);
        res.status(201).json(ProductSerializer.serialize(product));
    }else{
        res.status(401).json({ message: 'Unauthorized : Not store owner can not creat products' });
    }
}

exports.getProduct = (req, res) => {
    const product = products.find(product => product.id === req.params.id);
    if(product){
        res.status(200).json(ProductSerializer.serialize(product));
    }else{
        res.status(404).json({ message: 'Product not found' });
    }
}

exports.updateProduct = (req, res) => {
    const user = users.find(user => user.id === req.user.id);
    if(user.is_store_owner){// Check if user is store owner
        const product = products.find(product => product.id === req.params.id);
        if(!product){
            res.status(404).json({ message: 'Product not found' });
        }
        else{
            const user_store = stores.find(store => store.store_owner === req.user.id);
            if(product.store !== user_store.id){ // Check if user is store owner of the product
                res.status(401).json({ message: 'Unauthorized : Not store owner can not update products' });
            }
            const { name, description, price } = req.body;
            if (!name && !description && !price) {
                return res.status(400).json({ message: 'Name or Description or Price are required' });
            }
            product.name = name ? name : product.name;
            product.description = description ? description : product.description;
            product.price = price ? price : product.price;
            res.status(200).json(ProductSerializer.serialize(product));
        }
    }else{
        res.status(401).json({ message: 'Unauthorized : Not store owner can not update products' });
    }
}

exports.deleteProduct = (req, res) => {
    const user = users.find(user => user.id === req.user.id);
    if(user.is_store_owner){ // Check if user is store owner
        const productIndex = products.findIndex(product => product.id === req.params.id);
        if(productIndex !== -1){
            products.splice(productIndex, 1);
            res.status(204).json(); 
        }else{
            res.status(404).json({ message: 'Product not found' });
        }
    }else{
        res.status(401).json({ message: 'Unauthorized : Not store owner can not delete products' });
    }
}
