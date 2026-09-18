export function formatMoney(amountInCents: number, currency = "USD") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(amountInCents / 100);
}