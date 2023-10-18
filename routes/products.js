const express = require('express');
const router = express.Router();
const fs = require('fs');

let productos = require('../data/productos.json');

router.get('/', (req, res) => {
  const { limit } = req.query;
  let result = [...productos];
  if (limit) {
    result = result.slice(0, parseInt(limit, 10));
  }
  res.json(result);
});

router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const product = productos.find(item => item.id == pid);
  if (!product) {
    res.status(404).json({ message: 'Producto no encontrado' });
  } else {
    res.json(product);
  }
});

router.post('/', (req, res) => {
  const newProduct = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    status: true,
  };
  productos.push(newProduct);
  fs.writeFileSync('./data/productos.json', JSON.stringify(productos, null, 2));
  res.json(newProduct);
});

router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedProduct = { ...req.body, id: pid };
  productos = productos.map(product =>
    product.id == pid ? { ...product, ...updatedProduct } : product
  );
  fs.writeFileSync('./data/productos.json', JSON.stringify(productos, null, 2));
  res.json(updatedProduct);
});

router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  productos = productos.filter(product => product.id != pid);
  fs.writeFileSync('./data/productos.json', JSON.stringify(productos, null, 2));
  res.json({ message: 'Producto eliminado exitosamente' });
});

module.exports = router;

