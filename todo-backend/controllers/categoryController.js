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

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input
    if (!id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        tasks: {
          select: {
            id: true
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has tasks
    if (category.tasks.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing tasks. Please delete or reassign tasks first.' 
      });
    }

    // Delete category
    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
