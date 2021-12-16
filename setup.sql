  DROP TABLE IF EXISTS signatures;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS user_profiles;
  
    CREATE TABLE user_profiles(
      id SERIAL PRIMARY KEY,
      age INT,
      url VARCHAR(255),
      city VARCHAR(255),
      user_id INT NOT NULL UNIQUE
    );

    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL,
      last VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

    CREATE TABLE signatures(
      id SERIAL PRIMARY KEY,
      signature TEXT NOT NULL,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );


    

