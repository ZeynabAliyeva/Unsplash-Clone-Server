const express = require('express');
const { default: mongoose } = require('mongoose');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose
	.connect('mongodb+srv://Zeynab:241761331z@cluster0.xtyohvz.mongodb.net/unsplash')
	.then((res) => {
		console.log('Connected!');
	})
	.catch((err) => {
		console.log('Connection error!');
	});

let privateKey = 'ironmaidenironmaidenironmaidenironmaiden';

app.use((req, res, next) => {
	if (req.url == '/api/users/login' || req.url == '/api/users/confirmcode') {
		return next();
	}

	let auth = req.headers.authorization?.split(' ');
	let token = '';

	if (auth) {
		if (auth.length == 2) {
			token = auth[1];
		} else {
			res.status(401).json({ message: 'Access Error!' });
		}
	} else {
		res.status(401).json({ message: 'Access Error!' });
	}

	jwt.verify(token, privateKey, function (err, decode) {
		if (err) {
			return res.status(401).json(err);
		} else {
			const newToken = jwt.sign({ email: decode.email, userId: decode._id }, privateKey, {
				expiresIn: '5h',
			});
			res.locals.token = newToken;

			next();
		}
	});
});

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });
app.use('/api/uploads', express.static('uploads'));

app.post('/api/upload', upload.single('image'), (req, res) => {
	res.json({
		url: `/api/uploads/${req.file.originalname}`,
	});
});

app.use('/api/posts', postRouter);

app.use('/api/users', userRouter);

server.listen(8080, () => {
	console.log('listening on *:8080');
});
