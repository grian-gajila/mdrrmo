module.exports = {
   // Type check TypeScript files
   '**/*.(ts|tsx)': () => 'pnpm run ts-check',

   // Lint & Prettify TS and JS files
   '**/*.(ts|tsx|js)': () => ['pnpm run lint:fix', 'pnpm run format'],

   // Prettify only Markdown and JSON files
   '**/*.(md|json)': () => 'pnpm run format'
};
