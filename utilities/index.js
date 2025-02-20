const invModel = require("../models/inventoryModel");

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("Error: No classifications found.");
      return "<ul><li>No classifications available</li></ul>";
    }

    console.log("Building navigation for classifications:", data); // ✅ Debugging log

    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    list += '<li><a href="/inv/" title="View Inventory">Inventory</a></li>';
    data.forEach((row) => {
      list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
    });
    list += '<li><a href="/account/login">My Account</a></li>';
    list += "</ul>";

    return list;
  } catch (error) {
    console.error("Error generating navigation:", error);
    return "<ul><li>Error loading navigation</li></ul>";
  }
};

/* **************************************
 *  Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = function (data) {
  if (!data || data.length === 0) {
    return '<p class="notice">No vehicles found for this classification.</p>';
  }

  console.log("Vehicle data being processed:", data); // ✅ Debugging log

  let grid = '<ul id="inv-display">';
  data.forEach((vehicle) => {
    console.log(
      `Processing vehicle: ${vehicle.inv_make} ${vehicle.inv_model}, Thumbnail: ${vehicle.inv_thumbnail}`
    ); // ✅ Debugging log

    grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${
      vehicle.inv_make || "Unknown Make"
    } ${vehicle.inv_model || "Unknown Model"} details">
            <img src="${vehicle.inv_thumbnail || "/images/no-image.jpg"}"
                 alt="${vehicle.inv_make || "Unknown Make"} ${
      vehicle.inv_model || "Unknown Model"
    }" />
        </a>
        <div class="namePrice">
            <hr />
            <h2><a href="/inv/detail/${vehicle.inv_id}" title="View ${
      vehicle.inv_make || "Unknown Make"
    } ${vehicle.inv_model || "Unknown Model"} details">
            ${vehicle.inv_make || "Unknown Make"} ${
      vehicle.inv_model || "Unknown Model"
    }
            </a></h2>           
            <span>$${new Intl.NumberFormat("en-US").format(
              vehicle.inv_price
            )}</span>
        </div>
    </li>`;
  });
  grid += "</ul>";

  return grid;
};

/* **************************************
 *  Build the classification dropdown list for forms
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  try {
    let data = await invModel.getClassifications();

    if (!data || !Array.isArray(data)) {
      console.error("Error: No classifications found.");
      return "<select><option value=''>No classifications available</option></select>";
    }

    let classificationList =
      '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";

    data.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"`;
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected";
      }
      classificationList += `>${row.classification_name}</option>`;
    });

    classificationList += "</select>";
    return classificationList;
  } catch (error) {
    console.error("Error building classification list:", error);
    return "<select><option value=''>Error loading classifications</option></select>";
  }
};

/* **************************************
 * Export utility functions (Fixed)
 * ************************************ */
module.exports = {
  getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildClassificationList: Util.buildClassificationList,
};
