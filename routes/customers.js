const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /customers?page=1&limit=10&employer=3
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    

  const employer = req.query.employer ? parseInt(req.query.employer) : null;

  let baseQuery = `SELECT * FROM customers`;
  let countQuery = `SELECT COUNT(*) AS total FROM customers`;
  let queryParams = [];

  if (employer) {
    baseQuery += ` WHERE employer_number = ?`;
    countQuery += ` WHERE employer_number = ?`;
    queryParams.push(employer);
  }

  baseQuery += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  db.all(baseQuery, queryParams, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get(countQuery, employer ? [employer] : [], (err, countResult) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        page,
        limit,
        employer: employer || 'all',
        customers: rows,
      });
    });
  });
});

module.exports = router;
