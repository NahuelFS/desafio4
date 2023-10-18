const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const productsRouter = require('./routes/products');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);

app.get('/', (req, res) => {
  res.render('home', { products: getProductData() });
});

app.get('/realTimeProducts', (req, res) => {
  res.render('realTimeProducts', { products: getProductData() });
});

io.on('connection', (socket) => {
  console.log('A user connected');

  //Enviar actualizaciones de productos al cliente
  setInterval(() => {
    io.emit('productUpdate', getProductData());
  }, 5000);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

function getProductData() {
  return [
    { id: 1, title: 'Pantalón', price: 100 },
    { id: 2, title: 'Remera', price: 50 }
  ];
}

module.exports = app;

