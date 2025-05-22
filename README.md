# 🌸 Perfume Samples Platform

**A modern e-commerce platform for premium fragrance samples, built for the Bucharest market.**

> **Status**: Development Phase  
> **Target Launch**: Week 2  
> **Tech Stack**: Next.js 15 + TypeScript + PostgreSQL + Docker  

## 🎯 Project Overview

This platform enables customers in Bucharest to discover luxury fragrances through affordable samples (2ml, 5ml, 10ml) and curated discovery sets. Built with a modern Bay Area tech aesthetic and business-focused functionality.

### Key Features
- **Premium Fragrance Samples** - Designer & niche fragrances in multiple sizes
- **Inventory Management** - Real-time ML tracking for decanting operations  
- **Local Delivery** - Same-day/next-day delivery in Bucharest
- **Admin Dashboard** - Complete business management tools
- **Self-Hosted** - Full control with minimal external dependencies

## 🏗️ Project Structure

```
├── README.md                    # This file
├── database/
│   └── schema.sql              # Complete PostgreSQL schema
├── docker/
│   └── docker-compose.yml      # Full production setup
├── docs/
│   ├── business-plan.md        # Complete business strategy
│   ├── tech-architecture.md    # Technical implementation details
│   └── development-roadmap.md  # Phase-by-phase development plan
└── src/                        # Source code (Next.js app)
    └── .gitkeep               # Placeholder for future code
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Git

### Development Setup
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/perfume-samples-platform.git
cd perfume-samples-platform

# 2. Set up environment variables
cp docker/.env.example docker/.env
# Edit docker/.env with your configuration

# 3. Start the development stack
cd docker
docker-compose up -d

# 4. Initialize the database
docker-compose exec postgres psql -U perfume_user -d perfume_samples -f /docker-entrypoint-initdb.d/01-schema.sql

# 5. Access the application
# Web App: http://localhost:3000
# Database: localhost:5432
# Admin Panel: http://localhost:5050 (pgAdmin)
```

## 📋 Documentation

### Business Documentation
- **[Business Plan](docs/business-plan.md)** - Complete business model, pricing strategy, and market analysis
- **[Development Roadmap](docs/development-roadmap.md)** - Phase-by-phase development timeline with specific tasks

### Technical Documentation  
- **[Technical Architecture](docs/tech-architecture.md)** - System design, database schema, and infrastructure details
- **[Database Schema](database/schema.sql)** - Complete PostgreSQL schema with business logic
- **[Docker Setup](docker/docker-compose.yml)** - Production-ready containerized environment

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + shadcn/ui for Bay Area tech aesthetics
- **Framer Motion** for smooth animations

### Backend
- **Next.js API Routes** for serverless functions
- **Prisma ORM** for database management
- **PostgreSQL 15** for robust data storage
- **Redis** for caching and sessions

### Infrastructure
- **Self-hosted VPS** (Hetzner CX21 - €8/month)
- **Docker Compose** for service orchestration
- **Nginx** reverse proxy with SSL
- **Automated backups** and monitoring

### External Services
- **Stripe** for payments (only required external service)
- **Email API** for notifications (self-hosted SMTP option available)

## 📊 Business Model

### Product Offering
- **2ml samples**: €8-12 (discovery size)
- **5ml samples**: €18-25 (week trial)  
- **10ml samples**: €30-40 (month trial)
- **Discovery sets**: 3×2ml themed collections (€20-30)

### Revenue Projections
- **Month 3**: 50 orders/month → €225 profit
- **Month 6**: 200 orders/month → €1,400 profit
- **Target margin**: 30-35% after all costs

## 🎯 Development Phases

### Phase 1: MVP (Week 1-2) ⏳
- [ ] Complete e-commerce website
- [ ] Product catalog with 10 fragrances
- [ ] Order processing and Stripe payments
- [ ] Basic admin dashboard
- [ ] Email confirmations

### Phase 2: Enhancement (Week 3-4) 📋
- [ ] Advanced inventory management
- [ ] Customer reviews system
- [ ] Analytics dashboard
- [ ] Mobile optimization
- [ ] SEO implementation

### Phase 3: Growth (Month 2+) 🚀
- [ ] Customer accounts and loyalty program
- [ ] Subscription boxes
- [ ] Romanian localization
- [ ] AI-powered recommendations
- [ ] Marketing automation

## 🔧 Development Commands

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Database operations
docker-compose exec postgres psql -U perfume_user -d perfume_samples

# Stop all services
docker-compose down

# Backup database
docker-compose exec postgres pg_dump -U perfume_user perfume_samples > backup.sql

# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📈 Key Metrics & Goals

### Technical KPIs
- **Page Load Speed**: < 2 seconds
- **Uptime**: 99.9% availability
- **Mobile Performance**: 90+ Lighthouse score
- **Database Response**: < 100ms average

### Business KPIs
- **Customer Acquisition Cost**: < €5
- **Average Order Value**: €20+
- **Customer Retention**: 40%+
- **Inventory Turnover**: 8-10 times/year

## 🛡️ Security & Compliance

- **SSL/TLS**: Automatic Let's Encrypt certificates
- **PCI Compliance**: Via Stripe integration
- **Data Protection**: GDPR-compliant data handling
- **Regular Backups**: Automated daily database backups
- **Security Updates**: Automated system updates

## 🤝 Contributing

This is currently a solo project for a specific business use case. The repository serves as both documentation and implementation for the Bucharest perfume samples business.

### Future Open Source Plans
Once the business is established and the platform is proven, we may open-source components that could benefit other small e-commerce businesses.

## 📞 Support & Contact

- **Business**: Target launch in Bucharest, Romania
- **Technical Issues**: Check the documentation in `/docs/`
- **Infrastructure**: Self-hosted setup with minimal external dependencies

## 📄 License

Private business project. All rights reserved.

---

**Built with ❤️ for fragrance enthusiasts in Bucharest**

> *"Every fragrance tells a story. We help you discover yours."*