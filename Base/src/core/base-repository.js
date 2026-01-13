class BaseRepository {
  /**
   * @param {string|EntitySchema} entity - L'entité cible (ex: 'User')
   *@param {DataSource} dataSource - La connexion TypeORM
   */
  constructor(entity, dataSource) {
    this.entity = entity;
    this.dataSource = dataSource;
  }
  // Accesseur pour obtenir le repo TypeORM spécifique à l'entité
  get repo() {
    return this.dataSource.getRepository(this.entity);
  }
  async findAll(option={}){
    return await this.repo.find(option);
  }
  async findOne(option={}){
    return await this.repo.findOne(option);
  }
  async create(entity){
    return await this.repo.save(entity);
  }
  async update(id, entity){
    await this.repo.update(id, entity);
    return await this.repo.findOne(id);
  }
  async delete(id){
    await this.repo.delete(id);
    return true;
  }
}

module.exports = BaseRepository;
