# NeuraHear Lab Website

This is a [Next.js](https://nextjs.org) project for NeuraHear Lab.

**🌐 Live Site**: [https://www.neurahear.com](https://www.neurahear.com)

## 📚 Documentation

- **[SERVER-INFO.md](./SERVER-INFO.md)** - 🔴 **服务器部署路径和管理命令** (重要!)
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 生产环境部署指南
- **[DATA-MANAGEMENT.md](./server/din-backend/DATA-MANAGEMENT.md)** - 数据备份和管理

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

## 🛠️ Project Structure

```
neurahear-site/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Homepage
│   ├── teams/                    # Team page
│   ├── publications/             # Publications page
│   ├── projects/                 # Projects page
│   ├── seminars/                 # Seminars page
│   └── tools/                    # Tools page
├── public/
│   └── tools/
│       └── digit-in-noise-test/  # DIN test static files
├── server/
│   └── din-backend/              # DIN test backend (Express)
├── out/                          # Build output (static export)
└── static-server.js              # Local dev server with API proxy
```

## 🚀 Deployment

**Production Server**: `/var/www/labsite` on Alibaba Cloud ECS

Quick deployment:
```bash
# On server
cd /var/www/labsite
git pull origin main
cd server/din-backend
pm2 restart din-backend
```

See [SERVER-INFO.md](./SERVER-INFO.md) for complete server details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🔗 Quick Links

- **Website**: https://www.neurahear.com
- **DIN Test**: https://www.neurahear.com/tools/digit-in-noise-test/
- **Single DIN (R&D)**: https://www.neurahear.com/tools/single-digit-in-noise-test/
- **Admin Panel**: https://www.neurahear.com/tools/digit-in-noise-test/admin.html
- **GitHub**: https://github.com/sqgwang/neurahear-site

## 📍 Server Info (Quick Reference)

```
服务器路径: /var/www/labsite
后端目录:   /var/www/labsite/server/din-backend
数据存储:   /var/www/labsite/server/din-backend/data/
```

**详细信息请查看**: [SERVER-INFO.md](./SERVER-INFO.md) 📖

---

**Note**: This project is deployed on a self-hosted Alibaba Cloud server, not Vercel.

# Test auto-deploy with safe data
