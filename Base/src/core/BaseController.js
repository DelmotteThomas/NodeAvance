class BaseController {
  /**
   * @param {BaseService} service - Instance du servuce associé
   */
  constructor(service) {
    this.service = service;
  }
  handleRequest(method) {
    return async (req, res, next) => {
      try {
        const result = await this[method](req, res, next);
        res.json(result);
      } catch (error) {
        // TODO: Exécuter la méthode passée en paramètre (this[method])
        // ATTENTION : Il faut passer req, res, next }
        // TODO: Passer l'erreur au middleware d'erreur d'Express (next)
        next(error);
      }
    };
  }
  async findAll(options) {
    return this.service.findAll(options);
  }
  async getAll(req, res) {
    // TODO Récupérer les ites via le service
    // ToDo Renvoyer une réponse Json (status 200 par default)
    return this.service.getAll(req, res);
  }
  async findOne(options) {
    return this.service.findOne(options);
  }
  async findById(id) {
    return this.service.findById(id);
  }
  async getById(req, res) {
    // TODO Récupérer l'item via le service
    // ToDo Renvoyer une réponse Json (status 200 par default)
    return this.service.getById(req, res);
  }
  async create(req, res) {
    // TODO Créer l'item via le service
    // ToDo Renvoyer une réponse Json (status 201 par default)
    return this.service.create(req, res);
  }

  async update(req, res) {
    // TODO Mettre à jour l'item via le service
    //ToDO Renvoyer l'items mis a jour
    return this.service.update(req, res);
  }

  async delete(req, res) {
    // TODO Supprimer l'item via le service
    // ToDo Renvoyer
    return this.service.delete(req, res);
  }
}
module.exports = BaseController;