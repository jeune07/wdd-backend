const invModel = require("../models/inventoryModel");

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();

    if (!data || !Array.isArray(data)) {
      console.error("Error: No classifications found.");
      return "<ul><li>No classifications available</li></ul>";
    }

    let list = "<ul>";
    list +=
      '<li class="li-style-nav"><a href="/" title="Home page">Home</a></li>';
    data.forEach((row) => {
      list += `<li class="li-style-nav"><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
    });
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
// Util.buildClassificationGrid = function (data) {
//   if (!data || data.length === 0) {
//     return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
//   }

//   let grid = '<ul id="inv-display">';
//   data.forEach((vehicle) => {
//     grid += `<li>
//         <a href="/inv/detail/${vehicle.inv_id}" title="View ${
//       vehicle.inv_make
//     } ${vehicle.inv_model} details">
//             <img src="${vehicle.inv_thumbnail}" alt="Image of ${
//       vehicle.inv_make
//     } ${vehicle.inv_model} on CSE Motors" />
//         </a>
//         <div class="namePrice">
//             <hr />
//             <h2><a href="/inv/detail/${vehicle.inv_id}" title="View ${
//       vehicle.inv_make
//     } ${vehicle.inv_model} details">${vehicle.inv_make} ${
//       vehicle.inv_model
//     }</a></h2>
//             <span>$${new Intl.NumberFormat("en-US").format(
//               vehicle.inv_price
//             )}</span>
//         </div>
//     </li>`;
//   });
//   grid += "</ul>";

//   return grid;
// };

Util.buildClassificationGrid = function (data) {
  if (!data || data.length === 0) {
    return '<p class="notice">No vehicles found for this classification.</p>';
  }

  let grid = '<ul id="inv-display">';
  data.forEach((vehicle) => {
    grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${
      vehicle.inv_make
    } ${vehicle.inv_model} details">
            <img src="${
              vehicle.inv_thumbnail || "/images/no-image.jpg"
            }" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />
        </a>
        <div class="namePrice">
            <hr />
            <h2><a href="/inv/detail/${vehicle.inv_id}" title="View ${
      vehicle.inv_make
    } ${vehicle.inv_model} details">${vehicle.inv_make} ${
      vehicle.inv_model
    }</a></h2>
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
 * Export utility functions
 * ************************************ */
module.exports = {
  getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid,
  buildClassificationList: Util.buildClassificationList,
};
