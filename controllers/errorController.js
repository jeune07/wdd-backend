const errorController = {};

errorController.throwIntentionalError = (req, res, next) => {
  try {
    throw new Error("Intentional Server Error!");
  } catch (error) {
    next(error);
  }
};

module.exports = errorController;
