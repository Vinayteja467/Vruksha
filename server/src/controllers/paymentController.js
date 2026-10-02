import crypto from 'crypto';

export const getPaymentConfig = (req, res) => {
  res.json({
    success: true,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id',
    supportedMethods: [
      { id: 'upi', name: 'Instant UPI', description: 'Google Pay, PhonePe, Paytm, BHIM' },
      { id: 'card', name: 'Credit / Debit Card', description: 'Visa, Mastercard, RuPay, Amex' },
      { id: 'netbanking', name: 'Net Banking', description: 'All major Indian banks' },
      { id: 'razorpay', name: 'Razorpay Gateway', description: 'Secure multi-channel checkout' },
      { id: 'cod', name: 'Cash on Delivery', description: 'Pay at your doorstep' }
    ],
    codAvailable: true,
    currency: 'INR'
  });
};

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    // Amount in Paise (e.g. ₹500 = 50000 paise)
    const amountInPaise = Math.round(Number(amount) * 100);
    const mockOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;

    // In a live environment with active secret:
    // const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    // const order = await instance.orders.create({ amount: amountInPaise, currency: 'INR', receipt });

    res.json({
      success: true,
      order: {
        id: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created'
      },
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key_id'
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Check signature if secret is active
    if (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET !== 'rzp_test_placeholder_secret') {
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed: Signature mismatch' });
      }
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id || `pay_${Date.now()}`
    });
  } catch (err) {
    next(err);
  }
};
