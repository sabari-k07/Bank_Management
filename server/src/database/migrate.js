const fs = require('fs');
const path = require('path');
const { db } = require('../config/db');

function runMigrations() {
  console.log('🔄 Running database migrations...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  // Split and execute statements
  db.exec(schemaSql);
  console.log('✅ All tables, constraints, and relational schemas created successfully!');
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };

