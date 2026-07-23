// x402 payment challenge — same shape OKX required for Pantr's X Layer listing:
// scheme "exact", CAIP-2 network eip155:196 (X Layer), USDT0 token.
export const USDT0_XLAYER = '0x779ded0c9e1022225f8e0630b35a9b54be713736';

// PLACEHOLDER — replace with GamesOracle's real X Layer treasury address before
// submitting to OKX. Submitting with this placeholder will fail live payment
// verification even if the agent otherwise passes automated checks.
export const TREASURY = process.env.GAMESORACLE_TREASURY || '0x000000000000000000000000000000000000dEaD';

export function buildChallenge(req, feeUsdt, description) {
  return {
    x402Version: 1,
    accepts: [{
      scheme: 'exact',
      network: 'eip155:196',
      maxAmountRequired: Math.round(feeUsdt * 1e6).toString(),
      resource: req.originalUrl,
      description,
      mimeType: 'application/json',
      payTo: TREASURY,
      maxTimeoutSeconds: 300,
      asset: USDT0_XLAYER,
      extra: null,
    }],
  };
}

// Hackathon scope: verifies only that a payment header was presented, not that
// it settled on-chain. Real settlement verification is a follow-up task.
//
// DEMO_FREE_MODE: temporary override for demo recording while the treasury
// wallet has no funded counterparty to test real settlement. Matches the
// fee "0" temporarily set on the OKX listing itself — revert both together.
export function requirePayment(feeUsdt, description) {
  return (req, res, next) => {
    if (process.env.DEMO_FREE_MODE === 'true') return next();
    const paymentHeader = req.headers['x-payment'];
    if (!paymentHeader) {
      return res.status(402).json(buildChallenge(req, feeUsdt, description));
    }
    next();
  };
}
