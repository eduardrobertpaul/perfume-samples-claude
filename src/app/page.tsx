import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Truck, Shield, Heart } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
      },
      include: {
        inventory: true,
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return products
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

function ProductCardSkeleton() {
  return (
    <Card className="perfume-card animate-pulse">
      <CardHeader>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-8 bg-gray-200 rounded mt-4"></div>
        </div>
      </CardContent>
    </Card>
  )
}

async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="perfume-card group hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors">
                  {product.name}
                </CardTitle>
                <CardDescription className="font-medium">
                  {product.brand}
                </CardDescription>
              </div>
              {product.category && (
                <Badge variant="secondary" className="ml-2">
                  {product.category}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fragrance Notes */}
            <div className="notes-pyramid space-y-2">
              {product.topNotes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Top Notes</p>
                  <p className="text-sm">{product.topNotes.slice(0, 3).join(', ')}</p>
                </div>
              )}
              {product.middleNotes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Heart Notes</p>
                  <p className="text-sm">{product.middleNotes.slice(0, 3).join(', ')}</p>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">2ml sample</span>
                <span className="font-semibold">
                  {product.price2ml ? formatPrice(Number(product.price2ml)) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">5ml sample</span>
                <span className="font-semibold">
                  {product.price5ml ? formatPrice(Number(product.price5ml)) : 'N/A'}
                </span>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href={`/products/${product.slug}`}>
                Explore Fragrance
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-8">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-serif tracking-tight text-gray-900 sm:text-6xl">
            Discover Your
            <span className="text-primary"> Signature Scent</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Experience luxury fragrances through premium samples. From designer classics to niche discoveries, 
            explore the world of perfume without the commitment. Delivered fresh to your door in Bucharest.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/products">
                Browse Fragrances
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/discovery-sets">Discovery Sets</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold font-serif tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Perfume Samples?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Smart fragrance discovery for the modern perfume enthusiast
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Risk-Free Discovery</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Try before you invest in a full bottle. Perfect for exploring new scents.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Premium Quality</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Fresh decants from authentic bottles. Every sample is made to order.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Fast Local Delivery</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Same-day delivery in Bucharest. Get your samples quickly and safely.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Authentic & Safe</h3>
                <p className="mt-2 text-sm text-gray-600">
                  100% authentic fragrances with secure packaging and reliable service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold font-serif tracking-tight text-gray-900 sm:text-4xl">
              Featured Fragrances
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Handpicked selections from our premium collection
            </p>
          </div>
          
          <Suspense 
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <FeaturedProducts />
          </Suspense>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">
                View All Fragrances
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-serif tracking-tight text-gray-900 sm:text-4xl">
            Start Your Fragrance Journey
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join hundreds of fragrance enthusiasts in Bucharest who have discovered their perfect scent through our samples.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Browse All Fragrances</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/discovery-sets">Try Discovery Sets</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}