import React, { useEffect, useState, useContext } from 'react';
import { CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageContext } from '../../App';

const PaymentSuccess: React.FC = () => {
  const { getToken } = useAuth();
  const { lang } = useContext(LanguageContext);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // 从 URL 获取 checkout_id（hash 路由后的 query 参数）
      const hashParts = window.location.hash.split('?');
      if (hashParts.length < 2) {
        setStatus('error');
        setMessage('Missing payment parameters');
        return;
      }

      const params = new URLSearchParams(hashParts[1]);
      const checkout_id = params.get('checkout_id');
      const signature = params.get('302_signature');

      if (!checkout_id) {
        setStatus('error');
        setMessage('Missing checkout_id');
        return;
      }

      const token = getToken();
      if (!token) {
        setStatus('error');
        setMessage('Please login first');
        return;
      }

      // 调用验证 API
      const response = await fetch(`/api/payment/verify-checkout?checkout_id=${checkout_id}${signature ? `&302_signature=${signature}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(lang === 'cn' ? '支付成功！正在为您升级套餐...' : 'Payment successful! Upgrading your plan...');

        // 3秒后跳转到订阅页面
        setTimeout(() => {
          window.location.hash = '#console/subscription';
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Payment verification failed');
      }

    } catch (error) {
      console.error('Verify payment error:', error);
      setStatus('error');
      setMessage('Failed to verify payment');
    }
  };

  const handleBackToSubscription = () => {
    window.location.hash = '#console/subscription';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-surface border border-border p-8 text-center">
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-orange"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-orange"></div>

          {status === 'verifying' && (
            <>
              <Loader className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-white mb-2 font-mono">
                {lang === 'cn' ? '验证支付中...' : 'Verifying Payment...'}
              </h2>
              <p className="text-zinc-400 text-sm">
                {lang === 'cn' ? '请稍候，正在确认您的支付状态' : 'Please wait while we confirm your payment'}
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2 font-mono">
                {lang === 'cn' ? '支付成功！' : 'Payment Successful!'}
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                {message}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 font-mono">
                <Loader className="w-4 h-4 animate-spin" />
                {lang === 'cn' ? '即将跳转到订阅页面...' : 'Redirecting to subscription page...'}
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2 font-mono">
                {lang === 'cn' ? '验证失败' : 'Verification Failed'}
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                {message}
              </p>
              <button
                onClick={handleBackToSubscription}
                className="px-6 py-3 bg-primary text-black font-mono uppercase tracking-wider hover:bg-primary/90 transition-all"
              >
                {lang === 'cn' ? '返回订阅页面' : 'Back to Subscription'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
