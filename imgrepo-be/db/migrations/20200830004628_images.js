exports.up = function (knex) {
  return knex.schema.createTable("Images", (tbl) => {
    tbl.increments("id");
    tbl.string("name").defaultTo("");
    tbl.string("description").defaultTo("");
    tbl.string("img_url").notNullable();
    tbl.string("user").notNullable();
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Images");
};
