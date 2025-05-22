import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { ArrowRight, Filter } from 'lucide-react'
import Link from 'next/link'

interface ProductsPageProps {
  searchParams: {
    search?: string
    brand?: string
    category?: string
    gender?: string
    page?: string
  }
}

async function getProducts(searchParams: ProductsPageProps['searchParams']) {
  const page = parseInt(searchParams.page || '1')
  const limit = 12
  const skip = (page - 1) * limit

  try {
    const where: any = {
      inStock: true,
    }

    if (searchParams.search) {
      where.OR = [
        { name: { contains: searchParams.search, mode: 'insensitive' } },
        { brand: { contains: searchParams.search, mode: 'insensitive' } },
      ]
    }

    if (searchParams.brand) {
      where.brand = { equals: searchParams.brand, mode: 'insensitive' }
    }

    if (searchParams.category) {
      where.category = searchParams.category
    }

    if (searchParams.gender) {
      where.gender = searchParams.gender
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          inventory: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    }
  }
}

async function getBrands() {
  try {
    const brands = await prisma.product.findMany({
      select: {
        brand: true,
      },
      distinct: ['brand'],
      where: {
        inStock: true,
      },
      orderBy: {
        brand: 'asc',
      },
    })

    return brands.map(b => b.brand)
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="perfume-card group hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </CardTitle>
            <CardDescription className="font-medium mt-1">
              {product.brand}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1 ml-2">
            {product.category && (
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            )}
            {product.gender && (
              <Badge variant="outline" className="text-xs">
                {product.gender}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fragrance Notes Preview */}
        <div className="space-y-2">
          {product.topNotes?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Top Notes</p>
              <p className="text-sm text-muted-foreground">
                {product.topNotes.slice(0, 3).join(', ')}
                {product.topNotes.length > 3 && '...'}
              </p>
            </div>
          )}
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">2ml</p>
            <p className="font-semibold text-sm">
              {product.price2ml ? formatPrice(Number(product.price2ml)) : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">5ml</p>
            <p className="font-semibold text-sm">
              {product.price5ml ? formatPrice(Number(product.price5ml)) : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">10ml</p>
            <p className="font-semibold text-sm">
              {product.price10ml ? formatPrice(Number(product.price10ml)) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Stock indicator */}
        {product.inventory?.[0] && (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              product.inventory[0].lowStockAlert ? 'bg-orange-500' : 'bg-green-500'
            }`} />
            <span className="text-xs text-muted-foreground">
              {product.inventory[0].lowStockAlert ? 'Low stock' : 'In stock'}
            </span>
          </div>
        )}

        <Link href={`/products/${product.slug}`} className="block">
          <Button className="w-full group/btn">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function ProductGrid({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { products, totalCount, totalPages, currentPage } = await getProducts(searchParams)
  const brands = await getBrands()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif mb-4">Our Fragrance Collection</h1>
        <p className="text-muted-foreground">
          Discover premium fragrances from designer and niche houses. {totalCount} products available.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 bg-white/50 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" />
          <h2 className="font-semibold">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search fragrances..."
              defaultValue={searchParams.search || ''}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <select 
              defaultValue={searchParams.brand || ''}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select 
              defaultValue={searchParams.category || ''}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Categories</option>
              <option value="designer">Designer</option>
              <option value="niche">Niche</option>
              <option value="fresh">Fresh</option>
              <option value="oriental">Oriental</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">For</label>
            <select 
              defaultValue={searchParams.gender || ''}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Everyone</option>
              <option value="masculine">Men</option>
              <option value="feminine">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          {currentPage > 1 && (
            <Button variant="outline" asChild>
              <Link href={`/products?page=${currentPage - 1}`}>Previous</Link>
            </Button>
          )}
          
          <span className="text-sm text-muted-foreground px-4">
            Page {currentPage} of {totalPages}
          </span>
          
          {currentPage < totalPages && (
            <Button variant="outline" asChild>
              <Link href={`/products?page=${currentPage + 1}`}>Next</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}