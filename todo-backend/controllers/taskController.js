import prisma from '../config/db.js';

// Get all tasks with optional filtering
export const getTasks = async (req, res) => {
  try {
    const { search, status, categoryId } = req.query;

    // Build where clause for filtering
    // No userId filter - all users can see all tasks (global tasks)
    const where = {};

    // Add search filter if provided
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Add status filter if provided
    if (status) {
      where.status = {
        equals: status,
        mode: 'insensitive'
      };
    }

    // Add category filter if provided
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        category: true,
        user: {
          select: {
            id: true,
            nama: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            nama: true,
            email: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({
      message: 'Task retrieved successfully',
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, due_date, categoryId } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title || !categoryId) {
      return res.status(400).json({ error: 'Title and categoryId are required' });
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: status || 'pending',
        due_date: due_date ? new Date(due_date) : null,
        userId,
        categoryId: parseInt(categoryId)
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            nama: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date, categoryId } = req.body;
    const userId = req.user.id;

    // Check if task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // If categoryId is provided, verify it exists
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) }
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    // Update task
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(due_date && { due_date: new Date(due_date) }),
        ...(categoryId && { categoryId: parseInt(categoryId) })
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            nama: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Delete task
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};