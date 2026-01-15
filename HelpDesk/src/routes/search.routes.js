const router = require('express').Router();
const SearchService = require('../services/search.service');
const SearchController = require('../controllers/search.controller');

const searchService = new SearchService();
const searchController = new SearchController(searchService);

router.get('/', searchController.search);
router.post('/index-all', searchController.indexAll);

module.exports = router;
