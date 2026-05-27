import prisma from '../config/db.js';

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        tasks: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        nama_kategori: 'asc'
      }
    });

    res.status(200).json({
      message: 'Categories retrieved successfully',
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { nama_kategori } = req.body;

    // Validate input
    if (!nama_kategori) {
      return res.status(400).json({ error: 'nama_kategori is required' });
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        nama_kategori: {
          equals: nama_kategori,
          mode: 'insensitive'
        }
      }
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        nama_kategori
      },
      include: {
        tasks: {
          select: {
            id: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
