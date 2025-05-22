# Business Plan
# Bucharest Perfume Samples - Complete Business & Technical Plan

## **Business Model Design**

### Core Value Proposition
- **Affordable luxury discovery** - Try expensive fragrances without buying full bottles
- **Local Bucharest delivery** - Same-day/next-day delivery advantage
- **Curated selection** - Focus on 10-20 premium fragrances initially
- **Fresh decants** - Made-to-order, not pre-made samples

### Product Structure
**Sample Sizes & Pricing Strategy:**
- **2ml samples**: €8-12 (discovery size)
- **5ml samples**: €18-25 (week trial)
- **10ml samples**: €30-40 (month trial)
- **Discovery sets**: 3x2ml for €20-30 (themed collections)

**Initial Fragrance Categories:**
- Designer classics (Chanel, Dior, Tom Ford)
- Niche discoveries (Creed, Maison Margiela, Le Labo)
- Fresh/Summer collection
- Winter/Oriental collection

---

## **Technical Architecture (Self-Hosted)**

### **Tech Stack Recommendation**
```
Frontend: Next.js 15 + TypeScript + Tailwind CSS
Backend: Next.js API Routes + Prisma ORM
Database: PostgreSQL (self-hosted)
Hosting: VPS (DigitalOcean/Hetzner) + Docker
Payments: Stripe (minimal subscription needed)
Email: Resend API or SMTP (self-hosted)
Images: Local storage + optimization
```

### **Infrastructure Setup**
**VPS Requirements:**
- **Server**: Hetzner CX21 (~€8/month) or DigitalOcean Droplet
- **Location**: Germany (closest to Bucharest, good speeds)
- **Specs**: 2 vCPU, 4GB RAM, 40GB SSD
- **OS**: Ubuntu 22.04 LTS

**Self-Hosted Stack:**
```dockerfile
# Docker Compose Setup
- Next.js app (main website)
- PostgreSQL database
- Nginx reverse proxy
- Certbot for SSL
- Redis for caching (optional)
```

---

## **Database Design**

### **Core Tables:**
```sql
Products (fragrances)
├── id, name, brand, description
├── notes (top/middle/base)
├── price_2ml, price_5ml, price_10ml
├── in_stock, bottle_size_owned
└── ai_generated_description

Orders
├── id, customer_email, total_amount
├── shipping_address, phone
├── status (pending/processing/shipped/delivered)
└── created_at

OrderItems
├── order_id, product_id
├── size_ml, quantity, unit_price
└── custom_notes

Inventory
├── product_id, bottle_size_ml
├── total_volume, used_volume
├── last_updated, low_stock_alert
└── cost_per_ml
```

### **Business Intelligence Features:**
- **Inventory tracking**: Auto-calculate remaining ml per bottle
- **Cost analysis**: Track profit margins per fragrance
- **Popular products**: Analytics for restock decisions
- **Customer insights**: Email collection for future marketing

---

## **Website Features & Functionality**

### **Customer-Facing Features:**
**Product Discovery:**
- **Fragrance finder quiz** - AI-powered recommendations
- **Filter by**: Brand, scent family, price, popularity
- **Detailed product pages**: Notes pyramid, similar fragrances
- **Sample size comparison**: Clear pricing tiers

**Checkout Process:**
- **Guest checkout** (no account required initially)
- **Bucharest-specific**: Address validation, delivery zones
- **Payment options**: Card (Stripe), Cash on Delivery
- **Delivery scheduling**: Same-day (premium) or next-day

**Post-Purchase:**
- **Order tracking**: SMS/Email updates
- **Review system**: Rate fragrances after delivery
- **Reorder easily**: One-click repeat purchases

### **Admin Dashboard:**
**Inventory Management:**
- **Bottle tracker**: Visual remaining ml per fragrance
- **Decanting calculator**: Optimal sample cutting
- **Low stock alerts**: Auto-notifications
- **Cost tracking**: Profit per sample

**Order Management:**
- **Order queue**: Decanting workflow
- **Shipping labels**: Automated generation
- **Customer communication**: Template emails
- **Analytics**: Sales, popular products, margins

---

## **Marketing & Growth Strategy**

### **Launch Strategy (Month 1-2)**
1. **Instagram presence**: Aesthetic sample photos, decanting videos
2. **Local Facebook groups**: Bucharest perfume enthusiasts
3. **Influencer seeding**: Send samples to Romanian beauty bloggers
4. **SEO content**: "Best perfumes to try in Romania" articles

### **Customer Acquisition:**
- **Referral program**: 20% off for referring friends
- **Discovery sets**: Loss-leader pricing to attract customers
- **Seasonal collections**: Summer/Winter exclusive sets
- **Corporate gifts**: Office sample sets for special occasions

### **Retention:**
- **Email newsletter**: New arrivals, fragrance education
- **Loyalty program**: Points for repeat purchases
- **VIP access**: Early access to rare fragrances
- **Community building**: WhatsApp group for fragrance discussions

---

## **Cost Structure & Profitability**

### **Startup Costs:**
- **Initial inventory**: €500-800 (10-20 bottles)
- **Decanting supplies**: €100 (atomizers, labels, tubes)
- **VPS hosting**: €8/month
- **Domain**: €10/year
- **Stripe fees**: 2.9% + €0.30 per transaction

### **Revenue Projections:**
**Conservative (Month 3):**
- 50 orders/month × €15 average = €750/month
- 30% margin = €225 profit/month

**Growth (Month 6):**
- 200 orders/month × €20 average = €4,000/month
- 35% margin = €1,400 profit/month

### **Key Metrics to Track:**
- **Customer acquisition cost** (CAC)
- **Average order value** (AOV)
- **Repeat purchase rate**
- **Inventory turnover**
- **Profit per fragrance**

---

## **Development Roadmap**

### **Phase 1: MVP (Week 1-2)**
- [x] Product catalog with 10 fragrances
- [x] Shopping cart and checkout
- [x] Basic admin dashboard
- [x] Order management system
- [x] Email confirmations

### **Phase 2: Enhancement (Week 3-4)**
- [ ] Inventory tracking system
- [ ] Customer reviews
- [ ] AI fragrance recommendations
- [ ] Advanced analytics
- [ ] Mobile optimization

### **Phase 3: Growth (Month 2+)**
- [ ] User accounts and profiles
- [ ] Subscription boxes
- [ ] Advanced search filters
- [ ] Loyalty program
- [ ] Multi-language (Romanian)

---

## **Risk Mitigation**

### **Business Risks:**
- **Supplier issues**: Build relationships with 2-3 fragrance suppliers
- **Shipping damage**: Proper packaging, insurance
- **Seasonal fluctuations**: Diversify product range
- **Competition**: Focus on superior customer service

### **Technical Risks:**
- **Server downtime**: Automated backups, monitoring
- **Data loss**: Daily PostgreSQL backups to cloud
- **Payment issues**: Stripe integration testing
- **Security**: SSL, input validation, secure headers

---

## **Next Steps**

### **Immediate Actions (This Week):**
1. **Register domain**: perfume-samples.ro or similar
2. **Setup VPS**: Hetzner/DigitalOcean account
3. **Source initial inventory**: Research suppliers
4. **Create Instagram**: Start building brand presence
5. **Begin development**: Set up Next.js project

### **Week 2 Goals:**
- Complete MVP website
- First 5 fragrances ready for decanting
- Test order process with friends
- Launch soft opening

**Ready to start building? Let's create that Bay Area tech aesthetic for your perfume empire!** 🚀
