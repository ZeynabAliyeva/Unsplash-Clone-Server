const { userModel } = require('../models/user');
const nodemailer = require('nodemailer');
let privateKey = 'ironmaidenironmaidenironmaidenironmaiden';
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
	direct: true,
	host: 'smtp.mail.ru',
	port: 465,
	auth: {
		user: 'aarizona3@mail.ru',
		pass: '0bPD1xnaDfd52awVehKU',
	},
	secure: true,
});

const userController = {
  getAll: (req, res) => {
    userModel
      .find({ isDeleted: false })
      .select("id email")
      .exec((err, docs) => {
        if (!err) res.json(docs);
        else res.status(500).json(err);
      });
  },
  login: (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    userModel
      .findOne({ email: email, password: password })
      .exec()
      .then((doc) => {
        if (doc) {
          console.log("doc", doc);

          let confirmCode = Math.floor(Math.random() * 999999);

          doc.confirmCode = confirmCode;

          doc
            .save()
            .then((saveDoc) => {
              res.json(saveDoc);
            })
            .catch((saveErr) => {
              res.status(500).json(saveErr);
            });

          let mailOptions = {
            from: "aarizona3@mail.ru",
            to: doc.email,
            subject: "Login Confirm Code",
            text: "Confirm Code: " + confirmCode,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return console.log(error);
            }
          });
        } else {
          213123;
          res.status(404).json({ msg: "not found" });
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
  confirmCode: (req, res) => {
    let confirmCode = req.body.confirmCode;
    let userId = req.body.userId;
    userModel
      .findOne({ confirmCode: confirmCode, _id: userId, isDeleted: false })
      .exec()
      .then((doc) => {
        if (doc) {
          console.log(confirmCode);

          const token = jwt.sign({ email: doc.email }, privateKey, {
            algorithm: "HS256",
            expiresIn: "5h",
          });

           res.json({ token: token });
        } else {
          res.status(404).json({ message: "not found" });
        }
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  },
};

module.exports = {
	userController,
};
