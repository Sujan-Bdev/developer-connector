const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')

exports.getOne = (Model, popOptions) => {
    catchAsync(async(req,res,next) => {
        let query = Model.findById(req.params.id);
        if(popOptions) query = query.populate(popOptions)

        const doc = await query;
    })
}