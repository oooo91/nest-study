import { EntitySchema } from "typeorm";

const PostsSchema = new EntitySchema({
    name: "Posts",
    tableName: "posts", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        postId: {
            primary: true,
            type: "int",
            generated: true,
        },
        userId: {
            type: "int",
        },
        title: {
          type: "varchar",
        },
        status: {
          type: "varchar"
        },
        content: {
          type: "varchar",
        },
        createdAt: {
          type: "datetime",
        },
        updatedAt: {
          type: "datetime",
        },
    },

    relations: {
      user: {
        target: "Users",
        type: "many-to-many",
        joinTable: true,
        joinColumn: {name: 'userId'},
        cascade: true,
    },
    }
});

export default PostsSchema;
