# CroweLogic

Product, ingredient and batch tracking for the Southwest Mushrooms tincture line, with a public product page and an admin dashboard.

## Status

archived

Development stopped on 2025-04-21 (5 commits that day, per `git log`; last is "Add final files and update README with instructions"). The code is kept for reference. Southwest Mushrooms was a mushroom farm in Phoenix; the farm closed in February 2025. This app was written two months later, on Replit, for the extract products that outlived the farm.

## Install and first run

Not maintained. No supported install path.

There is no lockfile, so the exact dependency versions that ran in 2025 are unknown. Tried on 2026-09-10 with Node v26.5.0 and npm 11.17.0:

```
npm ci --ignore-scripts
# npm error The `npm ci` command can only install with an existing package-lock.json
```

Running it would also need a PostgreSQL `DATABASE_URL` (read in `server/db.ts` and `drizzle.config.ts`). None is provided.

## What runs today

Nothing is maintained.

What the repository holds (counts from `find` on 2026-09-10): 40 `.tsx`, 14 `.ts`, 4 `.png`, 4 `.js`, 3 `.json`, 1 `.css` file.

- `server/` : an Express API in TypeScript. Routes in `server/routes.ts` cover login and session, products, ingredients, product-ingredient links, batches (lookup by batch code), research documents, a Shopify CSV export and a QR code export.
- `shared/schema.ts` : Drizzle ORM tables `products`, `ingredients`, `product_ingredients`, `batches`, `batch_ingredients`, `research_documents`, `users`. A product has a name, SKU, description, health-benefit tag, image and status. A batch has a batch code, production date, alcohol percentage, organic certification and notes.
- `server/db-seed.ts` : seed data for 12 items: five mushroom ingredients (Lion's Mane, Blue Oyster, Reishi, Shiitake, Golden Oyster), organic cane alcohol, and six named tincture products.
- `client/src/` : a React and Vite front end with three pages (`home.tsx`, `admin.tsx`, `not-found.tsx`), Tailwind and shadcn components.
- `scripts/` : three Node scripts for cropping and background removal on logo images. `processed_assets/` holds their output.

One pull request was open on 2026-09-10 (a Dependabot bump of `drizzle-orm`). It is left as it was.

## Limits

- Inventory and batch software. It is not medical advice. The "health benefit" field is a catalog tag written by the seller, not a clinical claim, and nothing here should be read as guidance on dosing, safety or the effects of any extract.
- Not food-safety or cultivation guidance.
- A default admin username and password are hard-coded in `server/db-seed.ts` and `server/storage.ts`, and passwords are stored and compared in plain text. Do not deploy this as it stands.
- The Shopify export writes a CSV; it does not connect to a store.
- No products, batch codes or prices in this repository are current.

## License and contact

No license file. `package.json` declares MIT but no LICENSE file is present in the repository.

Contact: michael@crowelogic.com
