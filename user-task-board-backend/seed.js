const { sequelize } = require('./models');
const { User, List, Task } = require('./models');

sequelize.sync({ force: true }).then(async () => {
  try {
    // Create seed data here
    const user = await User.create({ username: 'pratham', password: 'mol@209' });

    // Use await when creating the list to ensure it's properly executed before moving on
    const taskList = await List.create({ title: 'My Task List', UserId: user.id });

    // Add tasks to the taskList
    await Task.create({ description: 'Complete task 1', ListId: taskList.id });
    await Task.create({ description: 'Complete task 2', ListId: taskList.id });
    // Add more tasks as needed

    console.log('Seed data created successfully.');
  } catch (error) {
    console.error('Error creating seed data:', error);
  } finally {
    process.exit();
  }
});
