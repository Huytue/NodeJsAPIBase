const bodyParser = require('body-parser');
const express  = require('express');
const logger = require('morgan'); // Tạo logger để kiểm tra yêu cầu
const mongoClient = require('mongoose');

// Setup connect mongodb by mongoose
mongoClient.connect('mongodb://localhost/nodejsapistarter', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(()=> console.log('Connected database from mongodb.'))
.catch(()=> console.error(`Connect database is failed with error which is ${error}`))

const app = express();


const userRoute = require('./routes/user');
const deckRoute = require('./routes/deck');

//Middleware
app.use(logger('dev'));
app.use(bodyParser.json());

//Routes
app.use('/decks', deckRoute);
app.use('/users', userRoute);

//Routes
app.get('/', (req, res, next) =>{
	return res.status(200).json({
		message: 'Sever is OK!'
	})
})
//Catch 404 errors and forward them to errors handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
})

//Error handler function
app.use((err, req, res, next) => {
	const error = app.get('env') === 'development' ? err : {};
	const status = err.status || 500;

	//response to client
	return res.status(status).json({
		error: {
			message: error.message
		}
	});
});

//Start the server
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));