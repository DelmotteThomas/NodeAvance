const TagEntity = require ('../models/tag.entity');
const { ValidationError, NotFoundError } = require('../errors/apiError');
const AppDataSource = require('../config/data_source');
const { In } = require('typeorm');

class TagService {
    constructor() {
        this.tagRepo = AppDataSource.getRepository(TagEntity);
    }

    async findAll() {
        return await this.tagRepo.find({
            relations: {
                todos: true
            }
        });
    }

    async findByIds(ids) {
        return await this.tagRepo.findBy({ id: In(ids) });
    }

    async create(data) {
        if (!data.label || data.label.trim() === "") {
            throw new ValidationError("Le label est obligatoire");
        }
        const newTag = this.tagRepo.create(data);
        return await this.tagRepo.save(newTag);
        }
}

const tagService = new TagService();
module.exports = tagService;