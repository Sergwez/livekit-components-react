/**
 * Linting is defined for all packages of the monorepo in the eslint-config-custom package.
 * Linting config is extended from /packages/eslint-config-custom/index.js
 */
module.exports = {
  root: true,
  extends: ['custom'],
  rules: {
    'import/no-anonymous-default-export': [
      'warn',
      {
        allowObject: true, // Storybook uses export default in every story.
      },
    ],
  },
};
