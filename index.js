module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')

  app.on('pull_request.opened', async context => {
    const p = context.payload;

    await context.github.issues.addAssignees({
      owner: p.repository.owner.login,
      repo: p.repository.name,
      number: p.number,
      assignees: ['radugroza', 'larisagroza']
    });
  });
};
