import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
    console.log('Verify request body:', body);
  } catch (parseError) {
    console.error('Failed to parse request body:', parseError);
    return new Response(JSON.stringify({ error: 'Invalid JSON in request body', details: parseError.message }), { status: 400 });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, user_id, course_id, amount, access_token } = body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !user_id || !course_id || !amount || !access_token) {
    console.error('Missing required fields:', body);
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  // Create Supabase client with user's access token for RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    }
  );

  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  // 1. Verify signature
  const generated_signature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    // Record failed purchase
    const { error: purchaseError } = await supabase.from('course_purchases').insert({
      user_id,
      course_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      status: 'failed',
    });
    if (purchaseError) console.error('Failed to insert failed purchase:', purchaseError);
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
  }

  // 2. Record purchase as paid
  const { error: paidError } = await supabase.from('course_purchases').insert({
    user_id,
    course_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
    status: 'paid',
  });
  if (paidError) {
    console.error('Failed to insert paid purchase:', paidError);
    return new Response(JSON.stringify({ error: 'Failed to record purchase', details: paidError.message }), { status: 500 });
  }

  // 3. Enroll user in course
  // Check if already enrolled
  const { data: existing, error: enrollCheckError } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user_id)
    .eq('course_id', course_id)
    .single();
  if (enrollCheckError) console.error('Error checking enrollment:', enrollCheckError);

  if (!existing) {
    const { error: enrollError } = await supabase.from('enrollments').insert({
      user_id,
      course_id,
      enrolled_at: new Date().toISOString(),
      progress_percentage: 0,
      last_accessed_at: new Date().toISOString(),
    });
    if (enrollError) {
      console.error('Failed to enroll user:', enrollError);
      return new Response(JSON.stringify({ error: 'Failed to enroll user', details: enrollError.message }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}