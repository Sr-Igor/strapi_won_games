'use strict';

const stripe = require('stripe')(process.env.STRIPE_SK);

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    let games = []

    await Promise.all(
      cart?.map(async (game)=> {
        const validateGame = await strapi.services.game.findOne({ id: game.id })

        if(validateGame){
          games.push(validateGame)
        }
      })
    )

    if(!games.length){
      return ctx.notFound(null, 'No games found')
    }

    const total = games.reduce((acc, game) => {
      return acc + game.price
    }, 0)

    if(total===0){
      return {
        freeGames: true,
      }
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total*100,
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' },
      });

      return paymentIntent
    }catch(err){
      return ctx.badRequest(null, err.message)
    }

    return {
      total: total*100,
      games
    }
  }
};
