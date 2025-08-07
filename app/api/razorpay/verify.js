import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, user_id, course_id, amount } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !user_id || !course_id || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 1. Verify signature
  const generated_signature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature !== razorpay_signature) {
    // Record failed purchase
    await supabase.from('course_purchases').insert({
      user_id,
      course_id,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      status: 'failed',
    });
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // 2. Record purchase as paid
  await supabase.from('course_purchases').insert({
    user_id,
    course_id,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
    status: 'paid',
  });

  // 3. Enroll user in course
  // Check if already enrolled
  const { data: existing, error: enrollCheckError } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user_id)
    .eq('course_id', course_id)
    .single();

  if (!existing) {
    await supabase.from('enrollments').insert({
      user_id,
      course_id,
      enrolled_at: new Date().toISOString(),
      progress_percentage: 0,
      last_accessed_at: new Date().toISOString(),
    });
  }

  return res.status(200).json({ success: true });
}