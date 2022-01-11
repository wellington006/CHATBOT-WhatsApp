const { clearOrder, clearStep } = require('./commonFunctions.js')
const { updateUser, getMenu } = require('./apiServices.js')

const steps = {
    step0: {
        defaultMessage: () => 'Olá! Eu sou uma assitente virtual, siga as instruções para realizar seu pedido!',
        processResponse: () => {
            return { message: steps.step0.defaultMessage(), nextStep: true }
        }
    },

    step1: {
        defaultMessage: async () => {
            let resp = `Informe o número correspondente a opção desejada:\n`
            const menu = await getMenu()
            menu.forEach((item, index) => {
                resp += `\n${index + 1} - ${item.name} --- R$ ${item.price.toFixed(2)}`
            })

            resp += `\n\nDigite *#* para CONCLUIR o pedido\nDigite * para CANCELAR`

            return resp
        },
        processResponse: async (resp, user) => {
            const menu = await getMenu()

            let validItem = false
            menu.forEach(item => {
                const validOptions = [item.id.toString(), '#', '*']
                if (validOptions.includes(resp)) validItem = true
            })

            if (!validItem) {
                return { message: `Opção inválida!`, nextStep: false, validOrder: false }
            }

            if (!isNaN(resp)) {
                return { message: `Item adicionado ao pedido!`, idItem: resp, nextStep: false, validOrder: true }
            }

            switch (resp) {
                case '#': {
                    let totalAmountOfOrder = user.order.reduce((total, order) => {
                        let itemPrice
                        menu.forEach(item => {
                            if (item.id == order.id) {
                                itemPrice = item.price * order.amount
                            }
                        })

                        return total += itemPrice
                    }, 0)

                    return { endOrderMessage: totalAmountOfOrder ? `Valor total do pedido: R$ ${totalAmountOfOrder.toFixed(2)}` : `O seu pedido está vazio, adicione itens para concluir o pedido!\n${await steps.step1.defaultMessage()}`, nextStep: totalAmountOfOrder ? true : false }
                }
                    break;
                case '*': {
                    let usersWithoutOrder = clearOrder(user)
                    return { message: await steps.step1.defaultMessage(), nextStep: false, newUserState: usersWithoutOrder }
                }
                    break
                default: return { message: await steps.step1.defaultMessage(), nextStep: false }
            }
        }
    },
    step2: {
        defaultMessage: () => 'Por favor, insira o endereço da entrega:',
        processResponse: (resp, user) => {
            const userWithAddress = { ...user, address: resp }
            updateUser({ address: resp, id: user.id })
            return { message: 'Obrigado! Agora é só aguardar que o seu pedido será entrege em breve!', nextStep: true, newUserState: userWithAddress }
        }
    },
    step3: {
        defaultMessage: () => 'Se houver dúvidas, lique 3442-2246',
        processResponse: (resp, user) => {
            let userRedefined = clearOrder(user)
            userRedefined = clearStep(userRedefined)
            return { nextStep: false, newUserState: userRedefined }
        }
    },
}

module.exports = steps