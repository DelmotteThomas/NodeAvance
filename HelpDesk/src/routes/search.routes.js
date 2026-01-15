const router = require('express').Router();
const SearchService = require('../services/search.service');
const SearchController = require('../controllers/search.controller');

const searchService = new SearchService();
const searchController = new SearchController(searchService);


// Recherche full text
router.get('/', searchController.search);
// AutoComplétion
router.get('/suggest', searchController.suggest);
// Bulk index admin
router.post('/index-all', searchController.indexAll);

module.exports = router;
