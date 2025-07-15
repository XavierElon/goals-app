This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploying on Ubuntu Server with systemd

### 1. Build and Deploy

1. Build the app:
   ```bash
   npm run build
   ```
2. Copy the systemd service file:
   ```bash
   sudo cp goals-app.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable goals-app.service
   ```
3. Start the service:
   ```bash
   sudo systemctl start goals-app.service
   ```
4. Check status:
   ```bash
   sudo systemctl status goals-app.service
   ```
5. The app will be available at `http://<your-server-ip>:10820`

### 2. Autodeploy Script

You can use the provided `autodeploy.sh` script to automatically build and restart the service:

```bash
./autodeploy.sh
```

This will:
- Pull the latest code (if using git)
- Install dependencies
- Build the app
- Restart the systemd service

---

## Example autodeploy.sh

```
#!/bin/bash
set -e

echo "[Autodeploy] Pulling latest code..."
git pull

echo "[Autodeploy] Installing dependencies..."
npm install

echo "[Autodeploy] Building app..."
npm run build

echo "[Autodeploy] Restarting service..."
sudo systemctl restart goals-app.service

echo "[Autodeploy] Done!"
```

Make it executable:
```bash
chmod +x autodeploy.sh
```

---

For logs:
```bash
sudo journalctl -u goals-app.service --no-pager -n 50
```
