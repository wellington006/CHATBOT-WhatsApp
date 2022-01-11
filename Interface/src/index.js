
const bot = require('venom-bot')
const steps = require('./steps.js')

const {getUserBasicData, incrementOrder, getUserOrder} = require('./commonFunctions.js')
const { getUserData, addNewUser, userIsRegistred, updateUser } = require('./apiServices.js')

bot.create().then((client) => start(client));

function start(client) {
	console.log('Cliente conectado')

	const sendMessage = async (number, message) => {
		if (message == '') return
		await client.sendText(number, message)
			.catch(err => console.log(err))
		return
	}

	client.onMessage(async (message) => {
		let user = getUserBasicData(message.chat.id, message.chat.name)

		if (await userIsRegistred(user.id)) {
			user = await getUserData(user.id)
		} else {
			user = await addNewUser(user)
		}

		const resp = await steps[`step${user.step}`].processResponse(message.body, user)

		await sendMessage(user.id, resp.message)

		console.log(resp.newUserState)
		resp.newUserState ? user = resp.newUserState : '' // Se for passado *, remove os pedidos | Se terminar o atendimento redefine os steps

		if (resp.nextStep) {
			user.step++
			resp.endOrderMessage && await sendMessage(user.id, resp.endOrderMessage)
			await sendMessage(user.id, await steps[`step${user.step}`].defaultMessage())
		} else {

			if (resp.validOrder) {
				user.order = await incrementOrder(user, resp.idItem) //Incrementa o pedido
			}else{
				resp.validOrder === false && await sendMessage(user.id, await steps.step1.defaultMessage())
			}

			await sendMessage(user.id, steps[`step${user.step}`].defaultMessage)

			if (user.order.length) {
				await sendMessage(user.id, await getUserOrder(user))
			}
		}

		updateUser(user)
	})
}