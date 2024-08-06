import connection from "./init.mysql.js";


await connection.query(`CREATE TABLE IF NOT EXISTS user(
    user_id INT UNSIGNED NOT NULL unique,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role char(1) NOT NULL DEFAULT 'A',
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);`)



await connection.query(`CREATE TABLE IF NOT EXISTS user(
    user_id INT UNSIGNED NOT NULL unique,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role char(1) NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);`)

await connection.query(`CREATE TABLE IF NOT EXISTS token(
    token_id VARCHAR(255) NOT NULL unique,
    address_ip VARCHAR(15) 	NOT NULL,
    user_id INT UNSIGNED NOT NULL ,
    PRIMARY KEY(token_id),
    FOREIGN KEY (user_id) REFERENCEs user(user_id)
);`)

export default 1