import { EntitySchema } from "typeorm";

const UsersSchema = new EntitySchema({
    name: "Users",
    tableName: "user", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        userId: {
            primary: true,
            type: "int",
            generated: true,
        },
        email: {
            type: "varchar",
        },
        password: {
          type: "varchar",
        },
        nickname: {
          type: "varchar",
        },
        createdAt: {
          type: "datetime",
      },
    },
});

export default UsersSchema;