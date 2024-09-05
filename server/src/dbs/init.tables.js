import connection from "./init.mysql.js";


await connection.query(`CREATE TABLE IF NOT EXISTS user(
    user_id INT UNSIGNED NOT NULL unique,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    name VARCHAR(100),
    email VARCHAR(45) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role char(1) NOT NULL DEFAULT 'A',
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);`)



await connection.query(`CREATE TABLE IF NOT EXISTS key_token(
    token_id INT UNSIGNED AUTO_INCREMENT,
    token_key VARCHAR(255) NOT NULL unique,
    user_id INT UNSIGNED NOT NULL ,
    PRIMARY KEY(token_id),
    FOREIGN KEY (user_id) REFERENCEs user(user_id)
);`)

await connection.query(`
CREATE TABLE IF NOT EXISTS book(
	book_id INT UNSIGNED auto_increment,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(1000),
    filepath VARCHAR(200) NOT NULL,
	PRIMARY KEY (book_id)
);
`)
await connection.query(`
CREATE TABLE IF NOT EXISTS anotation(
	book_id INT UNSIGNED,
    user_id INT UNSIGNED,
    xml_data LONGTEXT,
    FOREIGN KEY (book_id) REFERENCES book(book_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);
`)
await connection.query(`
CREATE TABLE IF NOT EXISTS rate(
	rate_id INT UNSIGNED auto_increment,
    rate_value FLOAT DEFAULT 0,
    num_reviews INT UNSIGNED DEFAULT 0,
    book_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (rate_id),
    FOREIGN KEY (book_id) REFERENCES book(book_id)
);   
`)

await connection.query(`
CREATE TABLE IF NOT EXISTS category(
	category_id VARCHAR(10) UNIQUE NOT NULL ,
    name_category VARCHAR(45) NOT NULL,
    PRIMARY KEY (category_id)
);
`)
await connection.query(`
CREATE TABLE IF NOT EXISTS book_category (
	book_id INT UNSIGNED NOT NULL,
    category_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES book(book_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);
`)

await connection.query(`
CREATE TABLE IF NOT EXISTS comment(
	comment_id BIGINT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    content TEXT,
    user_id INT UNSIGNED NOT NULL,
    book_id INT UNSIGNED NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (book_id) REFERENCES book(book_id)
);    
`)


await connection.query(`
CREATE TABLE IF NOT EXISTS comment_rate(
	rate_id BIGINT UNSIGNED auto_increment,
    upvote INT UNSIGNED DEFAULT 0,
    downvote INT UNSIGNED DEFAULT 0,
    comment_id BIGINT UNSIGNED,
    PRIMARY KEY (rate_id),
    FOREIGN KEY (comment_id) REFERENCES comment(comment_id)
);
`)


await connection.query(`
    INSERT IGNORE INTO category VALUES 
        ('kns', 'Kỹ năng sống'),
        ('kt', 'Kinh tế'),
        ('tc', 'Tài chính'),
        ('cn', 'Công nghệ'),
        ('nn', 'Ngoại ngữ'),
        ('dc', 'Đề cương'),
        ('gt', 'Giáo trình');
    `)
    
export default 1