const BaseRepository = require("./base-controller");

class BaseService {
 /**
  * 
  * @param {BaseRepository} repository - Instance du repository associé
  */   
  constructor(repository) {
    this.repository = repository;
  }

  async findAll(options) {
    return this.repository.findAll(options);
  }

  async findOne(options) {
    return this.repository.findOne(options);
  }
  async findById(id) {
    return this.repository.findById(id);
  }

  async create(data) {
    return this.repository.create(data);
  }

  async update(id, data) {
    return this.repository.update(id, data);
  }

  async delete(id) {
    return this.repository.delete(id);
  }

}

module.exports = BaseService