INSERT INTO canton (name, value, level, destroyed, team_id) VALUES
    ('Aargau', 1, 1, false, 1),
    ('Appenzell Ausserrhoden', 1, 1, false, 1),
    ('Appenzell Innerrhoden', 1, 3, false, 1),
    ('Basel-Landschaft', 1, 1, false, 1),
    ('Basel-Stadt', 1, 2, false, 1),
    ('Bern', 1, 1, false, 1),
    ('Fribourg / Freiburg', 1, 1, false, 1),
    ('Geneva', 1, 1, false, 1),
    ('Glarus', 1, 1, false, 1),
    ('Grisons', 1, 2, false, 1),
    ('Jura', 1, 1, false, 1),
    ('Lucerne', 1, 1, false, 1),
    ('Neuchatel', 1, 1, false, 1),
    ('Nidwalden', 1, 1, false, 1),
    ('Obwalden', 1, 1, false, 1),
    ('Schaffhausen', 1, 1, false, 1),
    ('Schwyz', 1, 1, false, 1),
    ('Solothurn', 1, 3, false, 1),
    ('St. Gallen', 1, 1, false, 2),
    ('Thurgau', 1, 1, false, 2),
    ('Ticino', 1, 1, false, 2),
    ('Uri', 1, 1, false, 2),
    ('Valais', 1, 1, false, 2),
    ('Vaud', 1, 1, false, 2),
    ('Zug', 1, 1, false, 2),
    ('Zurich', 1, 1, false, 2);

-- INSERT INTO powerup (name, description, cost) VALUES
--     ('location', 'See the other teams’ location for some time', 100),
--     ('double up ', 'double payment for traffifs', 100),
--     ('Upper hand', 'Increase your hand size by one temporarily', 100),
--     ('Trade deal', "Trade one card in your hand with one in the opponent's hand.", 100);

INSERT INTO team (name, money, score) VALUES ('A team', 0, 0);
INSERT INTO team (name, money, score) VALUES ('Timsaac', 0, 0);

INSERT INTO user (username, firstname, lastname, team_id, hashed_password) VALUES
   -- remove these before starting the game, create users through api
   ('aaronlieb', 'Aaron', 'Lieberman', 1, '$2b$12$D.Sp6Eavi4YrE0gZ8fC.n.LEkxkvDRosaWSZYlDXQgw9vuzVLN1ne'),
   ('antonio', 'Antonio', 'Alonso', 1, null),
   ('icf', 'Isaac', 'Feldman', 2, '$2b$12$DGHT20nYOFSX6b396YKdEeE62fz5Anu86jYPiGNHfNPQCOFD3w/ZO'),
   ('timjhh', 'Tim', 'Harrold', 2, '$2b$12$6ErTXqbHymWp6To/ckK5EuMqNPYiD8ZvvZAXWE0lmJKh/nS/uQl0G');

