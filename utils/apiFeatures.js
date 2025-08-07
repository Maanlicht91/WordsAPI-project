class APIFeatures {
  constructor(query, queryString) {
    this.queryString = queryString;
    this.query = query;
  }

  filter() {
    //-copy query string
    const queryObj = { ...this.queryString };
    //-remove reserved fields
    const excludedFields = ["search", "sort", "page", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //Add search and partOfSpeech filters
    if (this.queryString.search)
      queryObj.word = { $regex: this.queryString.search, $options: "i" }; //-- for case-insensitive search
    if (
      this.queryString.partOfSpeech &&
      this.queryString.partOfSpeech !== "all"
    )
      queryObj.partOfSpeech = this.queryString.partOfSpeech;

    //-- Advanced filtering - Numeric Filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    const sortBy = this.queryString.sort
      ? this.queryString.sort.split(",").join(" ")
      : "-createdAt";
    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    const selectFields = this.queryString.fields
      ? this.queryString.fields.split(",").join(" ")
      : "";
    this.query = this.query.select(selectFields);
    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.page = page; //an be accessed from the features instance in your controller.
    this.limit = limit;
    return this;
  }
}

module.exports = APIFeatures;
