const stores = require('../data/stores');
const categories = require('../data/categories');
class ProductSerializer {
    static serialize(product) {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        store_name: stores.find(store => store.id === product.store).name ? stores.find(store => store.id === product.store) : null,
        category_name : categories.find(category => category.id === product.category).name ? categories.find(category => category.id === product.category).name : null,
      };
    }
  
    static serializeList(products) {
      return products.map(product => ProductSerializer.serialize(product));
    }
  }

module.exports = ProductSerializer;