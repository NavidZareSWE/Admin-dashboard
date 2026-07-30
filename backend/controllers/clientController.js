import ProductModel from "../models/ProductModel.js";
import TransactionModel from "../models/TransactionModel.js";
import userModel from "../models/UserModel.js";

const getProducts = async (req, res) => {
  try {
    const productsWithStat = await ProductModel.aggregate([
      {
        $lookup: {
          from: "productstats",
          localField: "_id",
          foreignField: "productId",
          as: "stat",
        },
      },
    ]);

    res.status(200).json({ success: true, productsWithStat });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await userModel.find({ role: "user" });
    res.status(200).json({ success: true, customers });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Escape regex metacharacters so `search` can't break the pattern
// or be used to build a malicious/expensive regex.
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const _sort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
      };
      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? _sort() : {};

    const safeSearch = escapeRegex(search);

    // Search the Transaction collection for documents that match the search text.
    //
    // 1. Search both the "cost" and "userId" fields.
    // 2. A document is returned if EITHER field matches ($or).
    // 3. Use a regular expression ($regex) to perform a partial text search.
    // 4. The "i" flag makes the search case-insensitive.
    // 5. Sort the matching documents using sortFormatted.
    //    Example:
    //      { userId: 1 }  -> ascending
    //      { userId: -1 } -> descending
    // 6. Skip documents from previous pages for pagination.
    //    skip = page * pageSize
    // 7. Return at most pageSize documents for the current page.
    //
    // "cost" is a Number, and $regex only matches strings, so it's cast
    // to a string via $expr/$toString before the regex runs against it.
    const searchFilter = {
      $or: [
        { userId: { $regex: safeSearch, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$cost" },
              regex: safeSearch,
              options: "i",
            },
          },
        },
      ],
    };

    const transactions = await TransactionModel.find(searchFilter)
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const totalTransactions =
      await TransactionModel.countDocuments(searchFilter);

    res.status(200).json({ success: true, transactions, totalTransactions });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { getProducts, getCustomers, getTransactions };
