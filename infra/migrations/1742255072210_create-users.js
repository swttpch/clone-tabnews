exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    // for reference, Github limits usernames to 39 characters
    username: {
      type: "varchar(32)",
      notNull: true,
      unique: true,
    },
    // for reference, RFC 5321 limits email addresses to 254 characters
    // why 254 characters? https://stackoverflow.com/a/574698
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    // why 60 characters? https://www.npmjs.com/package/bcrypt#hash-info
    password: {
      type: "varchar(60)",
      notNull: true,
    },
    // why timestamptz? https://justatheory.com/2012/04/postgres-use-timestamptz/
    created_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
    updated_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
  });
};

exports.down = false;
