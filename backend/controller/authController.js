const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, validateUser } = require('../models/User');

const registerUser = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message); // Doğrulama hatası

    let user = await User.findOne({ email: req.body.email }); // Kullanıcıyı e-posta ile bul
    if (user) return res.status(400).send('Bu e-posta zaten kayıtlı.'); // Kullanıcı zaten var

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); // Şifreyi hashle

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        age: req.body.age
    });
    try {
        newUser = await newUser.save(); // Yeni kullanıcıyı kaydet
        const token = jwt.sign({ _id: newUser._id, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: '30d' }); 
        
        res.status(201).json({
            message: 'Kayıt başarılı!',
            token: token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                age: newUser.age
            }
        });
    } catch (err) {
        res.status(500).send('Kullanıcı oluşturulamadı.'); // Sunucu hatası
    }
};

const loginUser = async (req, res) => {
    // Giriş işlemi burada olacak
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message); // Doğrulama hatası

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Geçersiz e-posta veya şifre.'); // Kullanıcı bulunamadı

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Geçersiz e-posta veya şifre.'); // Şifre yanlış

    const token = jwt.sign({ _id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '30d' }); 
    res.status(200).json({
        message: 'Giriş başarılı!',
        token: token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            age: user.age
        }
    });
};


module.exports = { registerUser, loginUser };