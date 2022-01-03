module.exports = {
  '**/*.{ts,tsx,js,jsx}': ['prettier --write', 'eslint --fix'],
  '**/*.{json,yml}': ['prettier --write'],
}
