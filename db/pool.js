const { Pool } = require("pg")

module.exports = new Pool({
  connectionString: "postgresql://tickly:tickly@localhost:5432/make_electronics"
})
