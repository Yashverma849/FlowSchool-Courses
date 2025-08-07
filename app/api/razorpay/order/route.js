import Razorpay from 'razorpay';

export async function POST(req) {
  // Debug: Log environment variables (not secrets)
  console.log('RAZORPAY_KEY_ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  // Do NOT log RAZORPAY_KEY_SECRET for security

  // Debug: Log request body
  let body;
  try {
    body = await req.json();
    console.log('Request body:', body);
  } catch (parseError) {
    console.error('Failed to parse request body:', parseError);
    return new Response(JSON.stringify({ error: 'Invalid JSON in request body', details: parseError.message }), { status: 400 });
  }

  const { user_id, course_id } = body;
  if (!user_id || !course_id) {
    console.error('Missing user_id or course_id:', { user_id, course_id });
    return new Response(JSON.stringify({ error: 'Missing user_id or course_id' }), { status: 400 });
  }

  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  try {
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay instance created');

    // Shorten receipt to <= 40 chars
    const shortReceipt = `${user_id.slice(0, 8)}_${course_id.slice(0, 8)}_${Date.now()}`;
    const options = {
      amount: 1 * 100, // 1 INR in paise
      currency: 'INR',
      receipt: shortReceipt,
      payment_capture: 1,
    };
    console.log('Order options:', options);

    const order = await razorpay.orders.create(options);
    console.log('Order created:', order);
    return new Response(JSON.stringify({ order }), { status: 200 });
  } catch (error) {
    console.error('Order creation error:', error);
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), { status: 500 });
  }
}