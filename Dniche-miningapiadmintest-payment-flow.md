# 支付测试完整流程

## 步骤 1: 完成支付
1. 访问: https://niche-mining-web.vercel.app/#console/subscription
2. 点击任意付费套餐 (建议 Pro $30)
3. 完成 302.AI 支付流程
4. 会自动跳转到 /#payment/success

## 步骤 2: 查看日志
在 Vercel Dashboard 或本地查看日志:
- 找到 checkout_id
- 查看实际的 status 值

## 步骤 3: 如果有问题，使用测试端点
```bash
# 查询最近的订单
https://niche-mining-web.vercel.app/api/admin/check-payment-status

# 测试具体订单的 status
https://niche-mining-web.vercel.app/api/admin/test-verify-payment?checkout_id=YOUR_CHECKOUT_ID
```

## 期望结果
- 支付成功后应该看到: "✅ Payment verified as COMPLETED"
- credits 应该立即到账
- 订阅计划应该升级

## 如果失败
请复制完整的日志（从 🔍 Querying 到 🎉 完成的所有日志）。
