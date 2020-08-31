exports.up = function (knex) {
  return knex.schema.createTable("Users", (tbl) => {
    tbl.increments("id");
    tbl.string("username").unique().notNullable();
    tbl.string("password").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Users");
};
