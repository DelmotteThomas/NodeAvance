const BaseRepository = require('../core/base-repository');

class UserRepository extends BaseRepository {
     constructor(dataSource) {
        // TODO: Appeler le constructeur parent (super) avec le nom de l'entité 'User'
        super('User', dataSource);
  }
  
  
  // Pour l'instant, aucune méthode spécifique n'est nécessaire. 
  // On hérite de findAll, create, etc.
   }

   module.exports = UserRepository;