const express = require('express');

const sequelize = require('../models/index').sequelize;
const { List, Task, User } = require('../models');
const router = express.Router();


// Create a new task list
router.post('/lists', async (req, res) => {
  try {
    const { title, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({ error: 'Title and UserId are required for the task list' });
    }

    const newList = await List.create({ title, UserId: userId });

    res.status(201).json({ message: 'Task list created successfully', newList });
  } catch (error) {
    console.error('Error creating task list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find the task by ID
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Delete the task
    await task.destroy();

    // Fetch the lists with eager loading tasks
    const Lists = await List.findAll({
      include: [
        {
          model: Task,
          as: 'Tasks',
        },
      ],
    });

    // Fetch the tasks separately
    const tasks = await Task.findAll();

    res.json({ Lists, tasks });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
router.put('/tasks/:taskId/move', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { ListId } = req.body;
    console.log('Task ID:', taskId);
    console.log('List ID:', ListId);

    // Find the task by ID
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const previousListId = task.ListId;

    // Update the task's ListId
    task.ListId = ListId;
    await task.save();

    // Fetch the lists without eager loading tasks
    const Lists = await List.findAll();

    // Fetch the tasks separately
    const tasks = await Task.findAll();

    // Fetch the specific list to which the task has been moved
    const movedList = await List.findByPk(ListId);

    // Fetch the specific list from which the task has been moved
    const previousList = await List.findByPk(previousListId);

    res.json({ Lists, tasks, movedList, previousList });
  } catch (error) {
    // Log detailed error information
    console.error('Error moving task:', error);

    // Send a more descriptive error response
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



//retrieve all task lists
router.get('/lists', async (req, res) => {
 
  try {
    console.log('Received a request to retrieve all task lists')
    // Your logic to retrieve all task lists
    const lists = await List.findAll();

    res.json({ lists });
  } catch (error) {
    console.error('Error retrieving task lists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Add a new task to a specific list
router.post('/:listId/tasks', async (req, res) => {
  try {
    const { listId } = req.params;
    console.log('Received a request to add a task to list with ID:', listId);
    const { description, status } = req.body;

    // Check if the listId is provided
    if (!listId) {
      return res.status(400).json({ error: 'List ID is required' });
    }

    // Find the list by ID
    const list = await List.findByPk(listId);

    // Check if the list exists
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    // Create a new task associated with the list
    const newTask = await Task.create({ description, status, ListId: list.id });

    res.status(201).json({ message: 'Task added successfully', newTask });
  } catch (error) {
    console.error('Error adding task to list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all task lists for a specific user
router.get('/user/:userId/lists', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId
    const user = await User.findByPk(userId, {
      include: [
        {
          model: List,
          as: 'Lists', // Use the correct alias
          include: [
            {
              model: Task,
              as: 'Tasks', // Use the correct alias
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const Lists = user.Lists; // Rename the variable to "Lists"

    res.json({ Lists }); // Send "Lists" in the response
  } catch (error) {
    console.error('Error retrieving task lists for the user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Fetch tasks for a specific task list
router.get('/lists/:listId/tasks', async (req, res) => {
  try {
    const { listId } = req.params;

    // Check if the listId is provided
    if (!listId) {
      return res.status(400).json({ error: 'List ID is required' });
    }

    // Your logic to retrieve tasks for the specified task list
    const list = await List.findByPk(listId, { include: [{ model: Task }] });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.json({ list });
  } catch (error) {
    console.error('Error retrieving tasks for the list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
