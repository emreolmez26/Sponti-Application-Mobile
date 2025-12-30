const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided."); // Token yoksa erişim reddedilir.

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token doğrulanır.
        req.user = decoded;
        next(); // Doğrulama başarılıysa sonraki middleware'e geçilir.
        } catch (ex) {
        res.status(400).send("Invalid token."); // Token geçersizse hata mesajı döner.
    }
}
module.exports = auth; // auth middleware'i dışa aktarılır.
 