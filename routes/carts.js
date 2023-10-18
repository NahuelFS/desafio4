const express = require('express');
const router = express.Router();
const fs = require('fs');

let cartData = require('../data/carrito.json');

router.post('/', (req, res) => {
  const newCart = {
    id: Math.random().toString(36).substr(2, 9),
    products: [],
  };
  cartData.push(newCart);
  fs.writeFileSync('./data/carrito.json', JSON.stringify(cartData, null, 2));
  res.json(newCart);
});

router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const cart = cartData.find(item => item.id === cid);
  if (!cart) {
    res.status(404).json({ message: 'Carrito no encontrado' });
  } else {
    res.json(cart);
  }
});

router.post('/:cid/products/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const quantity = parseInt(req.body.quantity, 10) || 1;

  const cart = cartData.find(item => item.id === cid);
  const product = { id: pid, quantity };

  if (!cart) {
    res.status(404).json({ message: 'Carrito no encontrado' });
  } else {
    const existingProduct = cart.products.find(item => item.id === pid);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push(product);
    }

    fs.writeFileSync('./data/carrito.json', JSON.stringify(cartData, null, 2));
    res.json(cart);
  }
});

module.exports = router;
