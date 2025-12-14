INSERT INTO user_info (user_id, name, age, gender, nationality)
SELECT id, username, NULL, NULL, NULL FROM users;