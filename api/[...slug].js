module.exports = (req, res) => {
    res.status(200).json({
        mensaje: 'Vercel está ejecutando correctamente la función'
    });
};