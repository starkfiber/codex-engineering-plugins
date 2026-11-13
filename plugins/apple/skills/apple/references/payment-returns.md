# FPX and external payment return acceptance

A successful callback, a browser closing, a correct native destination and a ledger credit are four separate checks. Never infer any one from another.

| Case | App expectation | Ledger expectation |
|---|---|---|
| Verified success | Correct purchase result and owning Vault/Scheme destination | Exactly one credit for the paid order |
| Cancelled/failed | Calm retry/exit; no provider internals | No credit |
| Pending/unknown | Bounded waiting, recheck and safe exit | No premature success |
| Replayed callback or re-opened return | Same result | No additional credit |
| Background/killed app | Restore pending order after authenticated resume | Same idempotent outcome |
| Lost network | Recover without creating a second purchase | Reconcile original order |

Run independently for Vault and Scheme, Android and iOS, warm and cold return, including user closing the browser. Verify app links/custom scheme, callback host, target bundle and runtime channel. Return URL parameters are not proof of payment: verify server-side authenticated provider evidence, merchant, order, currency, amount and quoted rate before crediting atomically with a unique settlement key. Preserve older outstanding payments during gateway changes.

Inspect actual navigator ownership. A sibling tab may require navigation rather than replacement; a replace action can bubble to a parent that sends the customer Home. Do not dismiss the entire stack or globally reset tabs to mask this: drafts may be lost. Test the real installed navigation library's reducer and the physical app.

Customer wording: “Payment wasn’t completed” with retry and return actions. Do not claim no money was deducted unless established. Keep raw gateway reasons in protected diagnostics. Never label a test fixture as a successful real payment. Automatic invoice issuance stays unchanged/off unless separately authorised. Verify customer-authorised PDF access independently, including rejection of another account.
