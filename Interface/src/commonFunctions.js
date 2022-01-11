const {getMenu} = require('./apiServices.js')

const getUserBasicData = (id, name) => {
    return {
        id: id,
        name: name,
        step: 0,
        order: []
    }
}

const incrementOrder = async (user, idItem) => {
    let itemAlreadyExists = false

    user.order.forEach(order => {
        if (order.id == idItem) itemAlreadyExists = true
    });

    if (itemAlreadyExists) {
        user.order = user.order.map(order => {
            order.id == idItem ? order.amount++ : ''
            return order
        })
    } else {
        user.order = [...user.order, { id: idItem, amount: 1 }]
    }
    return user.order
}

const getUserOrder = async (user) => {
    let orderMessage = `Seu pedido já contém os seguintes items: \n`
    const menu = await getMenu()

    orderMessage += user.order.reduce((total, item) => {
        const itemData = getItemById(menu, item.id)
        return total += `\n${item.amount} ${itemData.name} --- R$ ${itemData.price.toFixed(2)}`
    }, '')

    return orderMessage
}

const getItemById = (menu, idItem) => {
    return menu.filter(menuItem => menuItem.id == idItem)[0]
}

const clearOrder = (user) => {
    return { ...user, order: [] }
}

const clearStep = (user) => {
    return { ...user, step: 0 }
}

module.exports = { getUserBasicData, incrementOrder, getUserOrder, clearOrder, clearStep }