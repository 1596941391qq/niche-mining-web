import React, { useEffect, useState } from "react";
import { CheckCircle, Loader, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";

const PaymentSuccess: React.FC = () => {
  const { getToken, refreshSession } = useAuth();
  const { lang } = useLanguage();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      console.log(
        "========== PaymentSuccess: Starting verifyPayment =========="
      );
      console.log("📍 Current full URL:", window.location.href);

      // 从 URL 获取 checkout_id（支持多种格式）
      let checkout_id, signature;

      // 格式 1: ?payment_order=xxxxx#payment/success (302.AI 实际返回)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("payment_order")) {
        checkout_id = urlParams.get("payment_order");
        console.log("✅ Found payment_order in URL params:", checkout_id);
      }

      // 格式 2: #payment/success?checkout_id=xxxxx (我们期望的格式)
      if (!checkout_id) {
        const hashParts = window.location.hash.split("?");
        if (hashParts.length >= 2) {
          const hashParams = new URLSearchParams(hashParts[1]);
          checkout_id = hashParams.get("checkout_id");
          signature = hashParams.get("302_signature");
          console.log("✅ Found checkout_id in hash params:", checkout_id);
        }
      }

      // 格式 3: 双保险，尝试从整个 URL 中提取
      if (!checkout_id) {
        const urlMatch = window.location.href.match(
          /payment_order=([a-zA-Z0-9]+)/
        );
        if (urlMatch) {
          checkout_id = urlMatch[1];
          console.log("✅ Extracted checkout_id from URL:", checkout_id);
        }
      }

      console.log("📍 Final checkout_id:", checkout_id);
      console.log("📍 302_signature:", signature);

      // 关键修复：只要找到 checkout_id 就继续，不要求 hash 有参数
      if (!checkout_id) {
        console.error("❌ checkout_id not found in any format");
        setStatus("error");
        setMessage("Missing payment parameters - checkout_id not found");
        return;
      }

      console.log("✅ checkout_id found:", checkout_id);

      const token = getToken();
      console.log(
        "📍 Token:",
        token ? `${token.substring(0, 10)}...` : "No token"
      );

      if (!token) {
        console.log("❌ No authentication token");
        setStatus("error");
        setMessage("Please login first");
        return;
      }

      // 构建API URL
      const apiUrl = `/api/payment/verify-checkout?checkout_id=${checkout_id}${
        signature ? `&302_signature=${signature}` : ""
      }`;
      console.log("🚀 Calling verify API:", apiUrl);

      // 调用验证 API
      console.log("⏳ Fetching from verify API...");
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📥 Response status:", response.status);
      const data = await response.json();
      console.log("📦 Response data:", JSON.stringify(data, null, 2));

      if (data.success) {
        setStatus("success");
        setMessage(
          lang === "cn"
            ? "支付成功！正在为您升级套餐并充值credits..."
            : "Payment successful! Upgrading subscription and adding credits..."
        );

        // 重要：清除缓存，强制刷新用户数据
        console.log("🔄 Clearing cache and refreshing user data...");
        localStorage.removeItem("cached_user");
        localStorage.removeItem("session_last_refresh");
        localStorage.removeItem("dashboard_cache");
        localStorage.removeItem("dashboard_preload_time");

        // 刷新用户会话（获取最新订阅和credits数据）
        await refreshSession();
        console.log("✅ User session refreshed with latest data");

        // 立即跳转到订阅页面并刷新（显示最新状态）
        setTimeout(() => {
          console.log("🔄 Redirecting to subscription page with fresh data...");
          window.location.hash = "#console/subscription";
          // 强制刷新页面
          window.location.reload();
        }, 1500);
      } else {
        setStatus("error");
        setMessage(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verify payment error:", error);
      setStatus("error");
      setMessage("Failed to verify payment");
    }
  };

  const handleBackToSubscription = () => {
    window.location.hash = "#console/subscription";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-surface border border-border p-8 text-center">
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-orange"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-orange"></div>

          {status === "verifying" && (
            <>
              <Loader className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-white mb-2 font-mono">
                {lang === "cn" ? "验证支付中..." : "Verifying Payment..."}
              </h2>
              <p className="text-zinc-400 text-sm">
                {lang === "cn"
                  ? "请稍候，正在确认您的支付状态"
                  : "Please wait while we confirm your payment"}
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2 font-mono">
                {lang === "cn" ? "支付成功！" : "Payment Successful!"}
              </h2>
              <p className="text-zinc-400 text-sm mb-6">{message}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 font-mono">
                <Loader className="w-4 h-4 animate-spin" />
                {lang === "cn"
                  ? "即将跳转到订阅页面..."
                  : "Redirecting to subscription page..."}
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2 font-mono">
                {lang === "cn" ? "验证失败" : "Verification Failed"}
              </h2>
              <p className="text-zinc-400 text-sm mb-6">{message}</p>
              <button
                onClick={handleBackToSubscription}
                className="px-6 py-3 bg-primary text-black font-mono uppercase tracking-wider hover:bg-primary/90 transition-all"
              >
                {lang === "cn" ? "返回订阅页面" : "Back to Subscription"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
