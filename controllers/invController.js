const invModel = require("../models/inventoryModel");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const classificationData = await invModel.getClassificationById(
      classification_id
    );

    if (!classificationData) {
      return res.redirect("/");
    }

    const className = classificationData.classification_name;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    if (!data || data.length === 0) {
      return res.redirect("/");
    }

    const grid = utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();

    res.render("inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
      layout: "layouts/layout",
    });
  } catch (error) {
    console.error("Error in buildByClassificationId:", error);
    next(error);
  }
};

/* ***************************
 *  Build vehicle details view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const vehicleId = req.params.id;
    const vehicle = await invModel.getVehicleById(vehicleId);

    if (!vehicle) {
      return res.status(404).render("inventory/not-found", {
        title: "Vehicle Not Found",
        layout: "layouts/layout",
      });
    }

    let nav = await utilities.getNav();
    res.render("inventory/detail", {
      title: `${vehicle.make} ${vehicle.model}`,
      vehicle,
      layout: "layouts/layout",
      nav,
    });
  } catch (error) {
    console.error("Error in buildByVehicleId:", error);
    next(error);
  }
};

// ✅ Ensure both functions are correctly exported
module.exports = invCont;
