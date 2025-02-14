// const invModel = require("../models/inventoryModel");

// const Util = {};

// /* ************************
//  * Constructs the nav HTML unordered list
//  ************************** */
// Util.getNav = async function () {
//   try {
//     let data = await invModel.getClassifications();

//     if (!data || !Array.isArray(data)) {
//       console.error("Error: No classifications found.");
//       return "<ul><li>No classifications available</li></ul>";
//     }

//     let list = "<ul>";
//     list += '<li><a href="/" title="Home page">Home</a></li>';
//     data.forEach((row) => {
//       list += "<li>";
//       list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
//       list += "</li>";
//     });
//     list += "</ul>";
//     return list;
//   } catch (error) {
//     console.error("Error generating navigation:", error);
//     return "<ul><li>Error loading navigation</li></ul>";
//   }
// };

// /* **************************************
//  *  Build the classification view HTML
//  * ************************************ */
// Util.buildClassificationGrid = function (data) {
//   if (!data || data.length === 0) {
//     return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
//   }

//   let grid = '<ul id="inv-display">';
//   data.forEach((vehicle) => {
//     grid += `<li>
//         <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
//       vehicle.inv_make
//     } ${vehicle.inv_model} details">
//             <img src="${vehicle.inv_thumbnail}" alt="Image of ${
//       vehicle.inv_make
//     } ${vehicle.inv_model} on CSE Motors" />
//         </a>
//         <div class="namePrice">
//             <hr />
//             <h2><a href="../../inv/detail/${vehicle.inv_id}" title="View ${
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

// /* **************************************
//  * Export utility functions
//  * ************************************ */
// module.exports = {
//   getNav: Util.getNav,
//   buildClassificationGrid: Util.buildClassificationGrid, // ✅ Fix: Ensure this is exported correctly
// };

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
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.forEach((row) => {
      list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
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
Util.buildClassificationGrid = function (data) {
  if (!data || data.length === 0) {
    return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  let grid = '<ul id="inv-display">';
  data.forEach((vehicle) => {
    grid += `<li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${
      vehicle.inv_make
    } ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${
      vehicle.inv_make
    } ${vehicle.inv_model} on CSE Motors" />
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
 * Export utility functions
 * ************************************ */
module.exports = {
  getNav: Util.getNav,
  buildClassificationGrid: Util.buildClassificationGrid, // ✅ Fix: Ensure this is exported correctly
};
