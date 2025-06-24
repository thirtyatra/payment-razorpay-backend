const Razorpay = require('razorpay');

module.exports = async function (req, res) {
  // Parse input (Appwrite passes JSON in req.body)
  let body;
  try {
    body = JSON.parse(req.bodyRaw || '{}');
  } catch (e) {
    return res.json({ error: 'Invalid JSON' }, 400);
  }

  const { amount } = body;

  if (!amount || isNaN(amount)) {
    return res.json({ error: 'Invalid amount' }, 400);
  }

  // Get secrets from environment variables
  const key_id = process.env.KEY_ID;
  const key_secret = process.env.SECRET_KEY;

  if (!key_id || !key_secret) {
    return res.json({ error: 'Missing Razorpay credentials' }, 500);
  }

  const razorpay = new Razorpay({
    key_id,
    key_secret,
  });

  try {
    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Math.random().toString(36).slice(2)}`,
    };
    const order = await razorpay.orders.create(options);
    return res.json({ order });
  } catch (err) {
    return res.json({ error: 'Failed to create order', details: err.message }, 500);
  }
};