const express = require('express');
const router = express.Router();
const { fetchData } = require('./dataFetcher');

// Dashboard home route
router.get('/', async (req, res) => {
  try {
    const data = await fetchData();
    res.render('index', { 
      title: 'Real-Time Environmental Data Dashboard',
      data: data
    });
  } catch (error) {
    console.error('Error in route handler:', error);
    res.status(500).render('index', { 
      title: 'Real-Time Environmental Data Dashboard',
      error: 'Failed to fetch data. Please try again later.'
    });
  }
});

// API endpoint for fetching fresh data (as fallback)
router.get('/api/data', async (req, res) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;