const asyncHandler = require("express-async-handler");
const ApiError = require("./ApiError");
const ApiFeatures = require("./apiFeatures");

exports.deleteOne = (Model, checkRefs) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (checkRefs) {
      const error = await checkRefs(id);
      if (error) {
        return next(error);
      }
    }

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document found with ID ${id}`, 404));
    }
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
      req.params.id,
       req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!document) {
      return next(
        new ApiError(`No document found with ID ${req.params.id}`, 404),
      );
    }
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document found with ID ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    // @ts-ignore
    if (req.filterObj) {
      // @ts-ignore
      filter = req.filterObj;
    }
    // 1) Get total count of documents
    const countDocuments = await Model.countDocuments(filter);

    // 2) Build mongoose query using ApiFeatures
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(countDocuments)
      .filter()
      .search(modelName)
      .sort()
      .limitFields()
      .populate();

    // 3) Execute the query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });
