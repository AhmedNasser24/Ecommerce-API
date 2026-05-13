class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // 1) Filtration
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields", "keyword", "populate"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Apply MongoDB operators (gte, gt, lte, lt) by adding the '$' prefix
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  // 2) Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  // 3) Field Selection
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  // 4) Search
  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "Product") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  // 5) Pagination
  paginate(countDocuments) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 20;
    const skip = (page - 1) * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // Next page
    if (skip + limit < countDocuments) {
      pagination.next = page + 1;
    }
    // Previous page
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }

  // 6) Population
  populate() {
    if (this.queryString.populate) {
      const populateOpt = this.queryString.populate.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.populate(populateOpt);
    }
    return this;
  }
}

module.exports = ApiFeatures;
