import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponse, ProductSearchParams } from '@/types'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const params: ProductSearchParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '12'), 50), // Max 50 items
      search: searchParams.get('search') || undefined,
      brand: searchParams.get('brand') || undefined,
      category: searchParams.get('category') as any || undefined,
      gender: searchParams.get('gender') as any || undefined,
      priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
      inStock: searchParams.get('inStock') === 'true' ? true : undefined,
      sortBy: searchParams.get('sortBy') as any || 'createdAt',
      sortOrder: searchParams.get('sortOrder') as any || 'desc',
    }

    // Build where clause
    const where: Prisma.ProductWhereInput = {}

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { brand: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    if (params.brand) {
      where.brand = { equals: params.brand, mode: 'insensitive' }
    }

    if (params.category) {
      where.category = params.category
    }

    if (params.gender) {
      where.gender = params.gender
    }

    if (params.inStock !== undefined) {
      where.inStock = params.inStock
    }

    // Price filtering (check any of the price fields)
    if (params.priceMin || params.priceMax) {
      const priceConditions: Prisma.ProductWhereInput[] = []
      
      if (params.priceMin) {
        priceConditions.push(
          { price2ml: { gte: params.priceMin } },
          { price5ml: { gte: params.priceMin } },
          { price10ml: { gte: params.priceMin } }
        )
      }

      if (params.priceMax) {
        priceConditions.push(
          { price2ml: { lte: params.priceMax } },
          { price5ml: { lte: params.priceMax } },
          { price10ml: { lte: params.priceMax } }
        )
      }

      if (priceConditions.length > 0) {
        where.OR = (where.OR || []).concat(priceConditions)
      }
    }

    // Build orderBy clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = {}
    if (params.sortBy === 'name') {
      orderBy.name = params.sortOrder
    } else if (params.sortBy === 'brand') {
      orderBy.brand = params.sortOrder
    } else if (params.sortBy === 'price') {
      // Sort by lowest available price
      orderBy.price2ml = params.sortOrder
    } else {
      orderBy.createdAt = params.sortOrder
    }

    // Calculate pagination
    const skip = (params.page! - 1) * params.limit!

    // Execute queries
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          inventory: {
            select: {
              totalVolume: true,
              usedVolume: true,
              lowStockAlert: true,
            }
          },
          _count: {
            select: {
              reviews: {
                where: {
                  isPublished: true
                }
              }
            }
          }
        },
        orderBy,
        skip,
        take: params.limit,
      }),
      prisma.product.count({ where }),
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / params.limit!)
    const hasMore = params.page! < totalPages

    const response: ApiResponse = {
      success: true,
      data: products,
      meta: {
        total: totalCount,
        page: params.page,
        limit: params.limit,
        hasMore,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching products:', error)
    
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'FETCH_PRODUCTS_ERROR',
        message: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
    }

    return NextResponse.json(response, { status: 500 })
  }
}