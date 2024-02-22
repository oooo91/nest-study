import typeorm from 'typeorm';

var dataSource = new typeorm.DataSource({
    type: "mysql",
    host: process.env.HOST,
    port: process.env.PORT,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    synchronize: false,
    entities: [require("./entity/user.entity"), require("./entity/post.entity")],
})

dataSource.initialize();

export default dataSource;