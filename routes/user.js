const express  = require('express');

// const router = express.Router();
const router = require('express-promise-router')();

const UserController = require('../controllers/user');

const { validateParam,validateBody, schemas} = require('../helpers/routerHelpers')

router.route('/')
	.get(UserController.index)
	.post(validateBody(schemas.userSchema), UserController.newUser)
	
router.route('/:userID')
	.get(validateParam(schemas.idSchema, 'userID') ,UserController.getUser)
	.put(validateParam(schemas.idSchema, 'userID', validateBody(schemas.userSchema)),UserController.replaceUser) // Cập nhật toàn bộ thông tin của User
	.patch(validateParam(schemas.idSchema, 'userID', validateBody(schemas.userOptionalSchema)),UserController.updateUser) //Cập nhật từng thông tin của User 
	.delete(validateParam(schemas.idSchema, 'userID'), UserController.deleteUser) 

router.route('/:userID/decks')
	.get(validateParam(schemas.idSchema, 'userID') ,UserController.getUserDecks)
	.post(validateParam(schemas.idSchema, 'userID') ,validateBody(schemas.deckSchema),UserController.newUserDecks)


	module.exports = router
	