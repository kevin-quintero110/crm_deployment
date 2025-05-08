const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Conexión exitosa a MongoDB");
    } catch (err) {
        console.error("❌ Error de conexión a la DB:", err);
        process.exit(1);
    }
};

module.exports = connectDB;