const _ = require('lodash');

module.exports = app => {
  app.log('Yay, the app was loaded!')

  app.on('pull_request.opened', async context => {
    const {owner, repo} = context.repo({path: '.github/auto-assign.yml'})
    const p = context.payload

    let cfg = await context.config('auto-assign.yml', {})
    if (!cfg || !cfg.users) {
      /* comment on the PR, no users could be found */
      await context.github.issues.createComment({
        owner: owner,
        repo: repo,
        number: p.number,
        body: 'Could not auto-assign the PR because no users have been found. Make sure the **`.github/auto-assign.yml`** file exists and contains a `users` entry array'
      })
      return
    }

    /* randomly select a user and assign the PR */
    if (!p.pull_request.assignees.length) {
      cfg.users = cfg.users.filter((user) => user !== p.pull_request.user.login)

      await context.github.issues.addAssignees({
        owner: owner,
        repo: repo,
        number: p.number,
        assignees: [_.sample(cfg.users)]
      })
    }
  })
}
