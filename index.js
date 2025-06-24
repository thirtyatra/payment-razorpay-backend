const Razorpay = require('razorpay');

module.exports = async (req, context) => {
  try {
    let body = {};
    if (req.bodyRaw) {
      body = JSON.parse(req.bodyRaw);
    }
    const { amount } = body;

    if (!amount || isNaN(amount)) {
      return context.res.send({ error: 'Invalid amount' }, 400);
    }

    const key_id = process.env.KEY_ID;
    const key_secret = process.env.SECRET_KEY;

    if (!key_id || !key_secret) {
      return context.res.send({ error: 'Missing Razorpay credentials' }, 500);
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Math.random().toString(36).slice(2)}`,
    };
    const order = await razorpay.orders.create(options);
    return context.res.send({ order });
  } catch (err) {
    return context.res.send({ error: 'Failed to create order', details: err.message }, 500);
  }
};
