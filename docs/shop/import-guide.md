# B&S one-time Paystack product import

The first batch has 18 entries: 14 sticks (one entry per supplied brand), three cone heights (3, 6 and 9 inches), and training bibs. Hockey sticks cost GHS 1,000; cones and bibs default to GHS 250. All entries use currency GHS, unlimited false and quantity 10. Paystack prices are expressed in pesewas: 100000 means GHS 1,000 and 25000 means GHS 250. Review the JSON catalogue before importing. No models, carbon percentages, materials, colours, lengths or pack quantities have been invented.

## Preview (no key, no requests)

```sh
node scripts/import-paystack-products.mjs
```

Edit docs/shop/paystack-products.json to change titles, descriptions, prices and quantities. Its review section is internal and is never sent to Paystack. Cone and bib prices are defaults as requested; confirm whether they represent singles or packs. SKT and VERA spelling is retained; reliable product image matches were not located. Do not substitute a different brand.

## Import

Obtain the numeric ID of your ball-and-stick-shop Storefront in the same Paystack mode as your secret key. The public slug alone is not the numeric ID. You can list Storefronts with GET https://api.paystack.co/storefront and find the record with slug ball-and-stick-shop. Keep the secret key in your local terminal only, never in chat, source control or a VITE_* variable.

For zsh on this Mac:

```sh
read -s 'PAYSTACK_SECRET_KEY?Paystack secret key: '
export PAYSTACK_SECRET_KEY
node scripts/import-paystack-products.mjs --apply --mode live --storefront-id YOUR_NUMERIC_ID
unset PAYSTACK_SECRET_KEY
```

Use --mode test with an sk_test_ key and a test Storefront ID to rehearse. Use --mode live with an sk_live_ key to populate the customer shop. Changing the mode does not convert test products into live products.

The importer verifies Storefront slug/currency first, checks the existing catalogue, creates only missing products, adds only missing Storefront associations, and confirms that all expected product IDs appear in the Storefront. It reuses products whose names match ignoring case and whitespace, and preserves their stock and descriptions. It stops before creating anything if an existing name is ambiguous or has different price/currency or is inactive. It saves a local operation log under ignored tmp/paystack-import/. It never calls the publish endpoint, deletes products or automatically retries writes.

If a request fails or times out, check Paystack before rerunning; some earlier products may already have been created. Listing on a rerun helps avoid duplicates, but concurrent runs or manual product renames can defeat name matching. Run only one importer at a time. Review shipping settings in Paystack afterwards.

## Direct curl alternative

Individual create payloads are also provided under docs/shop/payloads/. These were generated from the initial draft; if you later edit the main catalogue, update the individual payload too (the importer reads the main catalogue).

Example, after setting PAYSTACK_SECRET_KEY as above:

```sh
curl --fail-with-body https://api.paystack.co/product \
  -H "Authorization: Bearer $PAYSTACK_SECRET_KEY" \
  -H 'Content-Type: application/json' \
  --data-binary @docs/shop/payloads/harrow-hockey-stick.json
```

To add previously created products, POST to /storefront/YOUR_NUMERIC_ID/product with a JSON file containing {"products":[PRODUCT_ID_1,PRODUCT_ID_2]}. Direct repeated curl creates can duplicate products; the importer adds reuse checks.

## Photos and product references

The published create/update Product API documents name, description, price, currency, unlimited and quantity. It does not document an image upload field or product image-upload endpoint. A files field appearing in read responses is not evidence that sending it in a create request is supported. This importer therefore does NOT attach photos or send undocumented files/image_url fields.

Reference pages for identifiable brands are recorded in each entry's review.image_source_page. These are places to find photos after confirming which model you sell; they are not verified matches to B&S stock. Some references are current brand ranges with several different models, and the Parda store was unavailable when checked. Selecting a random premium stick photo would imply a model not supplied here. Use actual stock photos or confirm the exact model, then add photos in the Paystack dashboard (a separate browser-assisted task can handle that). There are no verified cone/bib pack or colour references yet.

## Website admin option for later

An admin product-import screen is feasible with CSV/JSON upload, editable preview and per-item status. The required Paystack fields are name, description, price and currency; limited-stock products additionally need quantity, with unlimited=false. A Supabase Edge Function or other authenticated server endpoint would make API calls, holding the secret in backend secrets. The browser must never hold the Paystack secret. Role checks, duplicate tracking and error handling belong on that backend. Images would still need a separately supported upload route or dashboard workflow.

The current admin Shop screen only configures the Storefront link; this one-time import adds no admin UI.

Sources: https://paystack.com/docs/api/product/ and https://paystack.com/docs/api/storefront/
