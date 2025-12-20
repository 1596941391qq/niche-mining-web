import React, { useContext, useEffect } from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { LanguageContext } from '../../App';

const PaymentResult: React.FC = () => {
  const { lang } = useContext(LanguageContext);

  useEffect(() => {
    // 解析 URL 参数（hash 路由后的 query 参数）
    const hashParts = window.location.hash.split('?');
    if (hashParts.length >= 2) {
      const params = new URLSearchParams(hashParts[1]);
      const checkout_id = params.get('checkout_id');
      const status = params.get('status');

      console.log('Payment Result:', { checkout_id, status });
    }
  }, []);

  const handleBackToSubscription = () => {
    window.location.hash = '#console/subscription';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-surface border border-border p-8 text-center relative">
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-orange"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-orange"></div>

          {/* Icon */}
          <XCircle className="w-16 h-16 text-zinc-500 mx-auto mb-4" />

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2 font-mono">
            {lang === 'cn' ? '支付已取消' : 'Payment Cancelled'}
          </h2>

          {/* Description */}
          <p className="text-zinc-400 text-sm mb-6">
            {lang === 'cn'
              ? '您已取消支付或支付失败。您可以随时返回订阅页面重新选择套餐。'
              : 'You have cancelled the payment or payment failed. You can return to the subscription page anytime to choose a plan.'}
          </p>

          {/* Back Button */}
          <button
            onClick={handleBackToSubscription}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-mono uppercase tracking-wider hover:bg-primary/90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'cn' ? '返回订阅页面' : 'Back to Subscription'}
          </button>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-zinc-500 font-mono">
              {lang === 'cn'
                ? '如有疑问，请联系客服：'
                : 'Questions? Contact support:'}{' '}
              <a
                href="mailto:x1596941391@gmail.com"
                className="text-primary hover:underline"
              >
                x1596941391@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
