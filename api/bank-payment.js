module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { email, userName, amount, reference } = req.body;

    if (!reference) {
      return res.status(400).json({ success: false, message: 'Bank reference required' });
    }

    const paymentId = 'BANK-' + Date.now();

    // Notify admin via EmailJS
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_p61trhq',
        template_id: 'template_14jwbju',
        user_id: 'wbl3XpIjAm_87c4Nl',
        accessToken: 'ZQ5HwvJhuZ8C1veOR8B_I',
        template_params: {
          to_email: 'youradmin@gmail.com',
          subject: `🏦 BANK TRANSFER — $${amount}`,
          from_name: userName,
          user_email: email,
          message: `Bank Transfer!\nAmount: $${amount}\nReference: ${reference}\nID: ${paymentId}`
        }
      })
    });

    return res.status(200).json({
      success: true,
      message: 'Bank transfer submitted. Will be credited in 1-2 hours.',
      paymentId
    });

  } catch (error) {
    console.error('Bank payment error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit' });
  }
};
