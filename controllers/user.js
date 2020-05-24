const User = require("../models/User");
const Deck = require("../models/Deck");

// const Joi = require("@hapi/joi");
// const idSchema = Joi.object().keys({
// 	userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
// })
// const index = (req, res, next) => {
//   //Callback way
//   User.find({}, (err, users) => {
//     if (err) next(err)
//     return res.status(200).json({users})
//   });
// };

// const index = (req, res, next) => {
// 	// Promises way
// 	User.find({}).then(users => {
// 	return res.status(200).json({ users })
// 	}).catch(err => next(err));
// }


const getUser = async (req, res, next) => {
	// const validatorResult = idSchema.validate(req.params)
	// console.log("ValidationError ",validatorResult)
	const { userID } = req.value.params
	const user = await User.findById(userID);
	return res.status(200).json({ user });
}

const index = async (req, res, next) => {
	// async await
	const users = await User.find({});
	// throw new Error("User not found");
	return res.status(200).json({ users });
};
const replaceUser = async (req, res, next) => {
	// enforce new user to old user
	const {userID} = req.value.params;
	const newUser = req.value.body;
	const result = await User.findByIdAndUpdate (userID, newUser)
	//Check if put user, remove deck in user's model
	return res.status(200).json({ users: result, success: true });
}

const updateUser = async (req, res, next) => {
	// number of fields
	const {userID} = req.value.params;
	const newUser = req.value.body;
	const result = await User.findOneAndUpdate (userID, newUser)
	return res.status(200).json({ success: true });
}

const deleteUser  = async (req, res, next) => {
	const { userID } = req.value.params
	//Get a deck deck
	const user = await User.findById(userID)
	const deckID= user.decks
console.log(deckID)
//Remove the deck
for(let i = 0; i < deckID.length;i++)
{
	const deck = await  Deck.findById(deckID)
	deck.remove();
}
	await user.remove()
	return res.status(200).json({success: true})
}

const getUserDecks = async (req, res, next) => {
	const { userID} = req.value.params

	//Get user product
	const user = await User.findById(userID).populate('decks')

	return res.status(200).json({decks: user.decks})
}

const newUserDecks = async (req, res, next) => {
	const {userID} = req.value.params

	//Create a new deck
	const newDeck = new Deck(req.value.body)

	//Get user
	const user = await User.findById(userID)

	// Assign user as a deck's owner
	newDeck.owner = user

	// Save the deck 
	await newDeck.save()

	//Add deck to user's decks array 'decks'
	user.decks.push(newDeck._id)

	// Save the user
	await user.save()

	return res.status(201).json({deck: newDeck})


}
// const newUser = (req, res, next) => {
// 	console.log("req.body content", req.body);
// 	//Create object model
// 	//Callback way
// 	const newUser = new User(req.body);
// 	console.log("newUser", newUser);
// 	newUser.save((err, user) => {
// 		console.error("Error", err);
// 		console.log("User saved", user);
// 		return res.status(201).json({ user });
// 	});
// };

// const newUser = (req, res, next) => {
// 	// Promises way
// 	console.log("req.body content", req.body);
// 	//Create object model
// 	const newUser = new User(req.body);
// 	console.log("newUser", newUser);
// 	newUser.save().then(user => {
// 		return res.status(201).json({ user });
// 	}).catch(err => newUser(err));
// }

const newUser = async (req, res, next) => {
	// async await
	const newUser = new User(req.value.body);
	await newUser.save();
	return res.status(201).json({ users: newUser });
};

module.exports = {
	deleteUser,
	newUserDecks,
	getUserDecks,
	updateUser,
	replaceUser,
	index,
	getUser,
	newUser,
};
