
/* 2022-08-04 23:41:13 [17 ms] */ 
CREATE TABLE IF NOT EXISTS Auth_users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    nickname VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL
);

CREATE TYPE status AS ENUM('TO_DO', 'DOING', 'DONE');

CREATE TABLE IF NOT EXISTS Auth_tasks (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(64) NOT NULL,
    description VARCHAR(1024) DEFAULT 'No description provided',
    deadline DATE,
    status status  DEFAULT 'TO_DO',
    author_id VARCHAR(64),
    FOREIGN KEY (author_id) REFERENCES Auth_users(id)
);

CREATE TABLE IF NOT EXISTS Auth_assignees (
    task_id VARCHAR(64),
    assignee_id VARCHAR(64),
    PRIMARY KEY (task_id, assignee_id),
    FOREIGN KEY (task_id) REFERENCES Auth_tasks(id),
    FOREIGN KEY (assignee_id) REFERENCES Auth_users(id)
);

SELECT id,name,nickname,email,password FROM auth_users;

ALTER TABLE auth_users ADD role VARCHAR(64) NOT NULL;
