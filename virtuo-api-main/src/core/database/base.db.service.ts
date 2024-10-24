import {
  buildFillable,
  buildRelations,
  buildSearchQuery,
} from '../utils/db-query';

export abstract class BaseDatabaseService {
  public fillable: string[] = [];
  public searchable: string[] = [];
  public relations: string[] = [];
  protected model;

  protected constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create({
      data: buildFillable(data, this.fillable),
    });
  }

  async update(id: number, data) {
    return await this.model.update({
      where: { id },
      data: buildFillable(data, this.fillable),
    });
  }

  async findAll(
    filterOptions = null,
    paginationOptions = null,
    relations = [],
  ) {
    const queryOptions = {};
    const { sortKey, sortDir, ...searchOptions } = filterOptions || {};
    const { skip, limit } = paginationOptions || {};
    relations = relations.length ? relations : this.relations;

    if (limit) {
      queryOptions['take'] = Number(limit);
    }

    if (skip) {
      queryOptions['skip'] = Number(skip);
    }

    if (sortKey) {
      queryOptions['orderBy'] = {
        [sortKey]: sortDir ? sortDir : 'asc',
      };
    }

    const buildWhere = buildSearchQuery(searchOptions, this.searchable);

    if (searchOptions) {
      queryOptions['where'] = buildWhere;
    }

    queryOptions['include'] = buildRelations(relations);

    return Promise.all([
      this.model.findMany(queryOptions),
      this.model.count({ where: buildWhere }),
    ]);
  }

  async count() {
    return this.model.count();
  }

  async findById(id: number | string, relations: string[] = []) {
    relations = relations.length ? relations : this.relations;
    let options = {};

    options['where'] = { id };

    if (relations.length) {
      options = { ...options, include: buildRelations(relations) };
    }

    return this.model.findUnique(options);
  }

  async findBySlug(slug: string, relations: string[] = []) {
    relations = relations.length ? relations : this.relations;
    let options = {};

    options['where'] = { slug };

    if (relations.length) {
      options = { ...options, include: buildRelations(relations) };
    }

    return this.model.findUnique(options);
  }

  async findFirst(where, relations: string[] = []) {
    relations = relations.length ? relations : this.relations;
    let options = {};

    options['where'] = where;

    if (relations.length) {
      options = { ...options, include: buildRelations(relations) };
    }

    return this.model.findFirst(options);
  }

  async findAllBy(where, relations: string[] = []) {
    relations = relations.length ? relations : this.relations;
    let options = {};

    options['where'] = where;

    if (relations.length) {
      options = { ...options, include: buildRelations(relations) };
    }

    return this.model.findMany(options);
  }

  async findAllByIn(whereField, array = [], relation = []) {
    const options = {
      where: {
        [whereField]: {
          in: array,
        },
      },
    };

    if (relation.length) {
      options['include'] = buildRelations(relation);
    }

    return this.model.findMany(options);
  }

  async delete(id: number | string) {
    return this.model.delete({
      where: { id },
    });
  }

  async updateBy(where: any, data: any) {
    return this.model.updateMany({
      where,
      data,
    });
  }

  async deleteBy(where: any) {
    return this.model.deleteMany({
      where,
    });
  }

  async countApproved() {
    return this.model.count({
      where: {
        status: 'APPROVED',
      },
    });
  }
}
