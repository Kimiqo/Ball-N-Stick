// Only link to Paystack-hosted stores; never accept credentials or arbitrary schemes.
export function isPaystackStorefrontUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'paystack.shop' && url.pathname !== '/' && !url.username && !url.password && !url.port;
  } catch { return false; }
}
