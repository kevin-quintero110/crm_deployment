const express =  require('express');
const router =  express.Router();

const clienteController = require('../controllers/clienteController')
const productosController =  require('../controllers/productosController')
const pedidosController  =  require('../controllers/pedidosController')
const usuariosController = require('../controllers/usuariosController')

//middle para proteger las rutas
const auth = require('../middleware/auth')

module.exports = function() {
  
    // agrega nuevos clientes via post
    router.post('/clientes', auth, clienteController.nuevoCliente)

    // Obtener todos los clientes
    router.get('/clientes', auth, clienteController.mostrarClientes)

    // Muestra un cliente en especifico
    router.get('/clientes/:idCliente', auth, clienteController.mostrarCliente)

    // Actualizar Cliente
    router.put('/clientes/:idCliente', auth, clienteController.actualizarCliente)

    // borrar Cliente
    router.delete('/clientes/:idCliente', auth, clienteController.eliminarCliente)




    /** PRODUCTOS **/
    
    // NUEVOS PRODUCTOS
    router.post('/productos',
        auth,
        productosController.subirArchivo,
        productosController.nuevoProducto
    
    ); 

    //muestra todos los productos
    router.get('/productos',auth, productosController.mostrarProdutos)


    // muestra un producto en especifico
    router.get('/productos/:idProducto',auth, productosController.mostrarProduto)

    // actualizar productos
    router.put('/productos/:idProducto', 
        auth,
        productosController.subirArchivo,
        productosController.actualizarProducto
    )

    // eliminar producto
    router.delete('/productos/:idProducto',auth, productosController.eliminarProducto)

    //Busqueda de productos
    router.post('/productos/busqueda/:query',auth, productosController.buscarProducto)

    //* PEDIDOS *//

    // agregar nuevos pedidos
    router.post('/pedidos/nuevo/:idUsuario', auth,pedidosController.nuevoPedido)


    // mpstrar todos los pedidos
    router.get('/pedidos',auth, pedidosController.mostrarPedidos)

    //mostrar un pedido por id
    router.get('/pedidos/:idPedido',auth, pedidosController.mostrarPedido)

    
    //actualizar un pedido por id
    router.put('/pedidos/:idPedido',auth, pedidosController.actualizarPedido)
    

    //eliminar un pedido por id
    router.delete('/pedidos/:idPedido',auth, pedidosController.eliminarPedido)
    


    //usuarios
    router.post('/crear-cuenta', usuariosController.registrarUsuario)

    router.post('/iniciar-sesion', usuariosController.autenticarUsuario)
    return router
}
