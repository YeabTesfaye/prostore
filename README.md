# Prostore

A full featured Ecommerce website built with Next.js, TypeScript, PostgreSQL and Prisma.

<img src="/public/screen.png" alt="Next.js Ecommerce" />

## Table of conent

<!--toc:start-->

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Usage](#usage)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
    - [PostgreSQL Database URL](#postgresql-database-url)
    - [Next Auth Secret](#next-auth-secret)
    - [PayPal Client ID and Secret](#paypal-client-id-and-secret)
    - [Uploadthing Settings](#uploadthing-settings)
    - [Resend API Key](#resend-api-key)
  - [Run](#run)
- [Prisma Studio](#prisma-studio)
- [Seed Database](#seed-database)
- [Demo](#demo)
- [License](#license)
<!--toc:end-->

## Features

- Next Auth authentication
- Admin area with stats & chart using Recharts
- Order, product and user management
- User area with profile and orders
- Stripe API integration
- PayPal integration
- Cash on delivery option
- Interactive checkout process
- Featured products with banners
- Multiple images using Uploadthing
- Ratings & reviews system
- Search form (customer & admin)
- Sorting, filtering & pagination
- Dark/Light mode
- Much more

## Usage

### Install Dependencies

```bash
npm install
```

Note: Some dependencies may have not yet been upadated to support React 19. If you get any errors about depencency compatability, run the following:

```bash
npm install --legacy-peer-deps
```

### Environment Variables

Rename the `.example-env` file to `.env` and add the following

#### PostgreSQL Database URL

Sign up for a free PostgreSQL database through Vercel. Log into Vercel and click on "Storage" and create a new Postgres database. Then add the URL.

**Example:**

```
DATABASE_URL="postgresql://username:password@host:port/dbname"
```

#### Next Auth Secret

Generate a secret with the following command and add it to your `.env`:

```bash
openssl rand -base64 32
```

**Example:**

```
NEXTAUTH_SECRET="xmVpackzg9sdkEPzJsdGse3dskUY+4ni2quxvoK6Go="
```

#### PayPal Client ID and Secret

Create a PayPal developer account and create a new app to get the client ID and secret.

**Example:**

```
PAYPAL_CLIENT_ID="YOUR PAYPAL_CLINENT_ID"
PAYPAL_APP_SECRET="PAYPAL_APP_SECRET"
```

#### Uploadthing Settings

Sign up for an account at https://uploadthing.com/ and get the token, secret and app ID.

**Example:**

```
UPLOADTHING_TOKEN='YOUR_UPPLOADTHING_TOKEN'
UPLOADTHIUG_SECRET='UPLOADTHING_SECRET'
UPLOADTHING_APPID='UPLOADTHING_APPID'
```

#### Resend API Key

Sign up for an account at https://resend.io/ and get the API key.

**Example:**

```
RESEND_API_KEY="re_ZnhUfrjR_QD2cDqdee3iYCrkfvPYFCYiXm"
```

### Run

```bash

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm start

# Export static site
npm run export
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prisma Studio

To open Prisma Studio, run the following command:

```bash
npx prisma studio
```

## Seed Database

To seed the database with sample data, run the following command:

```bash
npx tsx ./db/seed
```

## Demo

I am not sure how long I will have this demo up but you can view it here:

<!-- [ https://prostore-one.vercel.app/ ](https://prostore-one.vercel.app/) -->

## License

MIT License

Copyright (c) [2025] [Traversy Media]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall
