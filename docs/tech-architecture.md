# Technical Architecture

## Tech Stack Overview

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand for global state
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL 15 with advanced features
- **Cache**: Redis for sessions and caching
- **File Storage**: Local filesystem with optimization
- **Email**: Resend API or SMTP fallback

### Infrastructure
- **Hosting**: Self-hosted VPS (Hetzner CX21)
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx with SSL termination
- **SSL**: Let's Encrypt via Certbot
- **Monitoring**: Health checks and logging
- **Backups**: Automated daily database backups

### External Services
- **Payments**: Stripe (only required external service)
- **Analytics**: Self-hosted or optional Google Analytics

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side    │    │   Data Layer    │
│                 │    │                  │    │                 │
│ Next.js (React) │────│ Next.js API      │────│ PostgreSQL      │
│ Tailwind CSS    │    │ Routes           │    │ Redis Cache     │
│ TypeScript      │    │ Business Logic   │    │ File System     │
│ Zustand         │    │ Auth & Security  │    │ Automated       │
│ React Hook Form │    │ Email Service    │    │ Triggers        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌────────────────┐              │
         │              │ External APIs  │              │
         └──────────────│ - Stripe       │──────────────┘
                        │ - Email        │
                        │ - (Optional)   │
                        └────────────────┘
```

## Database Architecture

### Business Logic in Database
The PostgreSQL schema includes sophisticated business logic:

**Inventory Management:**
- Automatic volume calculations with computed columns
- Real-time stock alerts using generated columns
- Triggers for inventory updates on orders

**Order Processing:**
- Automatic order number generation (PS250523-1234 format)
- Status tracking with enum constraints
- Automatic timestamp updates

**Analytics Integration:**
- Built-in event tracking table
- Performance indexes for fast queries
- JSONB for flexible event data

### Key Database Features
```sql
-- Computed columns for real-time calculations
remaining_volume DECIMAL(8,2) GENERATED ALWAYS AS (total_volume - used_volume) STORED

-- Automatic alerts
low_stock_alert BOOLEAN GENERATED ALWAYS AS (remaining_volume <= low_stock_threshold) STORED

-- Automatic order numbers
PS250523-1234 (PS + YYMMDD + sequential)

-- Automatic inventory updates on orders
TRIGGER update_inventory_on_order
```

## API Design

### RESTful API Structure
```typescript
// Public API Endpoints
GET    /api/products              # List products with filters
GET    /api/products/[slug]       # Single product details
POST   /api/orders               # Create new order
GET    /api/orders/track         # Track order by email + number
POST   /api/checkout             # Create Stripe payment intent

// Admin API Endpoints  
GET    /api/admin/products        # Product management
POST   /api/admin/products        # Create product
PUT    /api/admin/products/[id]   # Update product
GET    /api/admin/orders          # Order management
PUT    /api/admin/orders/[id]     # Update order status
GET    /api/admin/inventory       # Inventory dashboard
GET    /api/admin/analytics       # Business metrics

// Health & Utility
GET    /api/health               # System health check
POST   /api/webhooks/stripe      # Stripe webhook handler
```

### API Response Format
```typescript
// Success Response
{
  success: true,
  data: T,
  meta?: {
    total?: number,
    page?: number,
    hasMore?: boolean
  }
}

// Error Response  
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

## Security Implementation

### Authentication & Authorization
- **Admin Access**: NextAuth.js with secure session management
- **Rate Limiting**: Nginx-level protection (10 req/s API, 50 req/s general)
- **CSRF Protection**: Built-in Next.js protection
- **Input Validation**: Zod schemas for all user inputs

### Data Protection
- **Environment Variables**: All secrets externalized
- **Database Security**: Parameterized queries, no raw SQL from user input
- **File Upload Security**: Type validation, size limits, secure storage
- **Payment Security**: PCI compliance via Stripe, no card data storage

### Infrastructure Security
```nginx
# Security headers automatically added
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000
Content-Security-Policy: default-src 'self' ...
```

## Performance Optimization

### Frontend Performance
- **Static Generation**: Product pages pre-generated
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Route-based automatic splitting
- **Lazy Loading**: Components and images
- **Compression**: Gzip/Brotli at Nginx level

### Backend Performance
- **Database Optimization**: Strategic indexes on all query patterns
- **Connection Pooling**: PostgreSQL connection pooling
- **Redis Caching**: Session data and frequent queries
- **Query Optimization**: Efficient joins and computed columns

### Caching Strategy
```typescript
// Multi-layer caching
1. Browser Cache (static assets)
2. Nginx Cache (reverse proxy)
3. Redis Cache (API responses)  
4. Database Query Cache (PostgreSQL)
```

## Monitoring & Observability

### Health Monitoring
```typescript
// Health check endpoints
/api/health          # Overall application health
/api/health/db       # Database connectivity  
/api/health/redis    # Cache connectivity
/api/health/stripe   # Payment system status
```

### Logging Strategy
- **Application Logs**: Structured JSON logging with Winston
- **Access Logs**: Nginx detailed access logging
- **Error Tracking**: Comprehensive error logging with stack traces
- **Performance Metrics**: Response times and resource usage

### Automated Monitoring
- **Health Checks**: Docker health checks for all services
- **Database Backups**: Daily automated backups with retention
- **SSL Certificate Renewal**: Automatic Let's Encrypt renewal
- **Disk Space Monitoring**: Automated alerts for low disk space

## Scalability Architecture

### Current Capacity (Hetzner CX21)
- **Concurrent Users**: 100-200 users
- **Orders/Month**: Up to 1,000 orders
- **Database**: 10GB storage capacity
- **Traffic**: 20TB bandwidth included

### Horizontal Scaling Path
```yaml
# Phase 1: Current setup (€8/month)
Single VPS with all services

# Phase 2: Scale up (€15/month)  
Upgrade to CX31 (4 vCPU, 8GB RAM)

# Phase 3: Scale out (€40/month)
Load balancer + 2 app instances
Separate database server
Object storage for images
```

### Database Scaling Strategy
```sql
-- Read replicas for analytics queries
-- Partitioning for order history
-- Indexes optimized for business queries
-- Connection pooling for efficiency
```

## Development Workflow

### Local Development
```bash
# Development setup
docker-compose -f docker-compose.dev.yml up
npm run dev        # Next.js development server
npm run db:migrate # Database migrations
npm run db:seed    # Sample data
```

### Production Deployment
```bash
# Production deployment
docker-compose up -d                    # All services
docker-compose logs -f app             # Monitor logs
docker-compose exec postgres pg_dump   # Manual backup
```

### Environment Management
- **Development**: Local Docker with hot reload
- **Staging**: Production-like environment for testing
- **Production**: Self-hosted VPS with all optimizations

## Business Intelligence Integration

### Real-time Analytics
The database schema includes built-in analytics capabilities:

```sql
-- Popular products by sales
SELECT p.name, SUM(oi.quantity) as total_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_sold DESC;

-- Inventory levels with alerts
SELECT p.name, i.remaining_volume, i.low_stock_alert
FROM products p  
JOIN inventory i ON p.id = i.product_id
WHERE i.low_stock_alert = true;

-- Revenue by time period
SELECT DATE_TRUNC('month', created_at) as month,
       SUM(total_amount) as revenue
FROM orders
WHERE payment_status = 'paid'
GROUP BY month
ORDER BY month;
```

### Business Metrics Dashboard
- **Sales Analytics**: Revenue, orders, average order value
- **Inventory Management**: Stock levels, reorder alerts, usage patterns  
- **Customer Insights**: Repeat purchase rate, popular products
- **Profit Analysis**: Cost tracking, margin analysis per product

## Technology Decisions & Rationale

### Why PostgreSQL over MySQL?
- **JSON Support**: JSONB for flexible event data
- **Array Types**: Perfect for fragrance notes
- **Generated Columns**: Real-time computed values
- **Advanced Indexing**: GIN indexes for complex queries

### Why Self-Hosted vs Cloud?
- **Cost Control**: €8/month vs €50+ cloud equivalent
- **Data Ownership**: Complete control over customer data
- **Customization**: Full server access for optimizations
- **Learning**: Deep understanding of the infrastructure

### Why Next.js over Separate Frontend/Backend?
- **Full-Stack**: Single codebase for frontend and API
- **Performance**: Built-in optimizations and caching
- **SEO**: Server-side rendering for product pages
- **Developer Experience**: TypeScript end-to-end

This architecture provides a robust, scalable foundation that can grow from startup to 1000+ orders/month while maintaining cost efficiency and operational simplicity.