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
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
      layout: "layouts/layout",
      nav,
    });
  } catch (error) {
    console.error("Error in buildByVehicleId:", error);
    next(error);
  }
};

/* ***************************
 *  Render the management view
 * ************************** */
invCont.renderManagementView = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("message"),
    layout: "layouts/layout",
  });
};

/* ***************************
 *  Render Add Classification Form
 * ************************** */
invCont.renderAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    message: req.flash("message"),
    layout: "layouts/layout",
  });
};

/* ***************************
 *  Handle Adding a New Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;

  // ✅ Server-side validation
  const validName = /^[a-zA-Z0-9]+$/.test(classification_name);
  if (!validName) {
    req.flash(
      "message",
      "Invalid classification name. Only letters and numbers allowed."
    );
    return res.redirect("/inv/add-classification");
  }

  const success = await invModel.addClassification(classification_name);
  if (success) {
    req.flash("message", "Classification added successfully.");
    return res.redirect("/inv/");
  } else {
    req.flash("message", "Failed to add classification.");
    return res.redirect("/inv/add-classification");
  }
};

/* ***************************
 *  Render Add Inventory Form
 * ************************** */
invCont.renderAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      message: req.flash("message"),
      layout: "layouts/layout",
    });
  } catch (error) {
    console.error("Error in renderAddInventory:", error);
    next(error);
  }
};

/* ***************************
 *  Handle Adding a New Vehicle
 * ************************** */
// invCont.addInventory = async function (req, res, next) {
//   try {
//     console.log("Received form data:", req.body);

//     const {
//       classification_id,
//       inv_make,
//       inv_model,
//       inv_price,
//       inv_year,
//       inv_miles,
//       inv_color,
//       inv_image,
//     } = req.body;

//     // ✅ Validate required fields
//     if (
//       !classification_id ||
//       !inv_make ||
//       !inv_model ||
//       !inv_price ||
//       !inv_year ||
//       !inv_miles ||
//       !inv_color ||
//       !inv_image
//     ) {
//       req.flash("message", "All fields are required.");
//       return res.redirect("/inv/add-inventory");
//     }

//     // ✅ Validate numeric fields
//     if (
//       isNaN(inv_price) ||
//       inv_price <= 0 ||
//       isNaN(inv_year) ||
//       inv_year < 1900 ||
//       isNaN(inv_miles) ||
//       inv_miles < 0
//     ) {
//       req.flash("message", "Invalid numeric values.");
//       return res.redirect("/inv/add-inventory");
//     }

//     // ✅ Add vehicle to the database
//     const success = await invModel.addInventory({
//       classification_id,
//       inv_make,
//       inv_model,
//       inv_price,
//       inv_year,
//       inv_miles,
//       inv_color,
//       inv_image,
//     });

//     if (success) {
//       req.flash("message", "Vehicle added successfully.");
//       return res.redirect("/inv/");
//     } else {
//       req.flash("message", "Failed to add vehicle.");
//       return res.redirect("/inv/add-inventory");
//     }
//   } catch (error) {
//     console.error("Error in addInventory:", error);
//     next(error);
//   }
// };

// invCont.addInventory = async function (req, res, next) {
//   try {
//     console.log("Received form data:", req.body); // ✅ Debugging log

//     const {
//       classification_id,
//       inv_make,
//       inv_model,
//       inv_price,
//       inv_year,
//       inv_miles,
//       inv_color,
//       inv_image,
//     } = req.body;

//     // ✅ Validate required fields
//     if (
//       !classification_id ||
//       !inv_make ||
//       !inv_model ||
//       !inv_price ||
//       !inv_year ||
//       !inv_miles ||
//       !inv_color ||
//       !inv_image
//     ) {
//       req.flash("message", "All fields are required.");
//       return res.redirect("/inv/add-inventory");
//     }

//     // ✅ Validate numeric fields
//     if (
//       isNaN(inv_price) ||
//       inv_price <= 0 ||
//       isNaN(inv_year) ||
//       inv_year < 1900 ||
//       isNaN(inv_miles) ||
//       inv_miles < 0
//     ) {
//       req.flash("message", "Invalid numeric values.");
//       return res.redirect("/inv/add-inventory");
//     }

//     // ✅ Insert the vehicle into the database
//     const success = await invModel.addInventory({
//       classification_id,
//       inv_make,
//       inv_model,
//       inv_price,
//       inv_year,
//       inv_miles,
//       inv_color,
//       inv_image,
//     });

//     if (success) {
//       console.log("Vehicle added successfully!"); // ✅ Debugging log
//       req.flash("message", "Vehicle added successfully.");
//       return res.redirect("/inv/");
//     } else {
//       console.error("Vehicle insertion failed."); // ✅ Debugging log
//       req.flash("message", "Failed to add vehicle.");
//       return res.redirect("/inv/add-inventory");
//     }
//   } catch (error) {
//     console.error("Error in addInventory:", error);
//     next(error);
//   }
// };

// invCont.addInventory = async function (req, res, next) {
//   try {
//     console.log("Received form data:", req.body); // ✅ Debugging log

//     const {
//       classification_id,
//       inv_make,
//       inv_model,
//       inv_price,
//       inv_year,
//       inv_miles,
//       inv_color,
//       inv_image,
//     } = req.body;

//     // ✅ Validate required fields
//     if (!classification_id || !inv_make || !inv_model || !inv_price) {
//       req.flash("message", "All fields are required.");
//       return res.redirect("/inv/add-inventory");
//     }

//     // ✅ Validate numeric fields
//     if (
//       isNaN(inv_price) ||
//       inv_price <= 0 ||
//       (inv_year && isNaN(inv_year)) ||
//       (inv_miles && isNaN(inv_miles))
//     ) {
//       req.flash("message", "Invalid numeric values.");
//       return res.redirect("/inv/add-inventory");
//     }

//     // ✅ Insert vehicle into the database
//     const success = await invModel.addInventory({
//       classification_id,
//       inv_make,
//       inv_model,
//       inv_price,
//       inv_year,
//       inv_miles,
//       inv_color,
//       inv_image,
//     });

//     if (success) {
//       console.log("Vehicle added successfully!"); // ✅ Debugging log
//       req.flash("message", "Vehicle added successfully.");
//       return res.redirect(`/inv/type/${classification_id}`);
//     } else {
//       console.error("Vehicle insertion failed."); // ✅ Debugging log
//       req.flash("message", "Failed to add vehicle.");
//       return res.redirect("/inv/add-inventory");
//     }
//   } catch (error) {
//     console.error("Error in addInventory:", error);
//     next(error);
//   }
// };

invCont.addInventory = async function (req, res, next) {
  try {
    console.log("Received form data:", req.body);

    const {
      classification_id,
      inv_make,
      inv_model,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
      inv_description,
    } = req.body;

    // ✅ Validate required fields
    if (
      !classification_id ||
      !inv_make ||
      !inv_model ||
      !inv_price ||
      !inv_description ||
      !inv_thumbnail ||
      !inv_image
    ) {
      req.flash("message", "All fields are required.");
      return res.redirect("/inv/add-inventory");
    }

    // ✅ Validate numeric fields
    if (
      isNaN(inv_price) ||
      inv_price <= 0 ||
      (inv_year && isNaN(inv_year)) ||
      (inv_miles && isNaN(inv_miles))
    ) {
      req.flash("message", "Invalid numeric values.");
      return res.redirect("/inv/add-inventory");
    }

    // ✅ Insert the vehicle into the database
    const success = await invModel.addInventory({
      classification_id,
      inv_make,
      inv_model,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
      inv_description,
    });

    if (success) {
      console.log("Vehicle added successfully!");
      req.flash("message", "Vehicle added successfully.");
      return res.redirect(`/inv/type/${classification_id}`);
    } else {
      console.error("Vehicle insertion failed.");
      req.flash("message", "Failed to add vehicle.");
      return res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    console.error("Error in addInventory:", error);
    next(error);
  }
};

/* ***************************
 *  Export Controller Functions
 * ************************** */
module.exports = invCont;
