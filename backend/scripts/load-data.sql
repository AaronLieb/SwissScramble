INSERT or IGNORE INTO canton (name, value, level, destroyed, team_id) VALUES
    ('Aargau', 1, 0, false, 0),
    ('Appenzell Ausserrhoden', 1, 0, false, 0),
    ('Appenzell Innerrhoden', 1, 0, false, 0),
    ('Basel-Landschaft', 1, 0, false, 0),
    ('Basel-Stadt', 1, 0, false, 0),
    ('Bern', 1, 0, false, 0),
    ('Fribourg / Freiburg', 1, 0, false, 0),
    ('Geneva', 1, 0, false, 0),
    ('Glarus', 1, 0, false, 0),
    ('Grisons', 1, 0, false, 0),
    ('Jura', 1, 0, false, 0),
    ('Lucerne', 1, 0, false, 0),
    ('Neuchatel', 1, 0, false, 0),
    ('Nidwalden', 1, 0, false, 0),
    ('Obwalden', 1, 0, false, 0),
    ('Schaffhausen', 1, 0, false, 0),
    ('Schwyz', 1, 0, false, 0),
    ('Solothurn', 1, 0, false, 0),
    ('St. Gallen', 1, 0, false, 0),
    ('Thurgau', 1, 0, false, 0),
    ('Ticino', 1, 0, false, 0),
    ('Uri', 1, 0, false, 0),
    ('Valais', 1, 0, false, 0),
    ('Vaud', 1, 0, false, 0),
    ('Zug', 1, 0, false, 0),
    ('Zurich', 1, 0, false, 0);

INSERT or IGNORE INTO team (name, money, score, curses, challenges, income, hand_size) VALUES ('A team', 0, 0, 0, 2, 0, 3);
INSERT or IGNORE INTO team (name, money, score, curses, challenges, income, hand_size) VALUES ('Swiss Misters', 0, 0, 0, 2, 0, 3);

INSERT or IGNORE INTO user (username, firstname, lastname, team_id, hashed_password) VALUES
   -- remove these before starting the game, create users through api
   ('aaronlieb', 'Aaron', 'Lieberman', 1, '$2b$12$D.Sp6Eavi4YrE0gZ8fC.n.LEkxkvDRosaWSZYlDXQgw9vuzVLN1ne'),
   ('antonio', 'Antonio', 'Alonso', 1, '$2b$12$6yGm3YcfVi9INTsxbvVwo.kgoZyeGHx7SoQsSuGLquVrVxgksTOfy'),
   ('icf', 'Isaac', 'Feldman', 2, '$2b$12$DGHT20nYOFSX6b396YKdEeE62fz5Anu86jYPiGNHfNPQCOFD3w/ZO'),
   ('timjhh', 'Tim', 'Harrold', 2, '$2b$12$8vFV2m/UVBt6zt5w6aa4zud5zjkbGxKbYxj.bXYALPjqgyLiijSe6');

INSERT or IGNORE INTO game (active, day, 'start', 'end', 'day_start', 'day_end', passive_income_enabled) VALUES (true, 1, '2025-03-20T08:00:05+01:00', '2025-03-22T19:00:05+01:00', '08:00:05.000', '19:00:05.000', true);

