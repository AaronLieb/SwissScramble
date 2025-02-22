INSERT INTO canton (name, value, level) VALUES
    ('Aargau', 1, 0),
    ('Appenzell Ausserrhoden', 1, 0),
    ('Appenzell Innerrhoden', 1, 0),
    ('Basel-Landschaft', 1, 0),
    ('Basel-Stadt', 1, 0),
    ('Bern', 1, 0),
    ('Fribourg', 1, 0),
    ('Geneva', 1, 0),
    ('Glarus', 1, 0),
    ('Graubünden', 1, 0),
    ('Jura', 1, 0),
    ('Lucerne', 1, 0),
    ('Neuchâtel', 1, 0),
    ('Nidwalden', 1, 0),
    ('Obwalden', 1, 0),
    ('Schaffhausen', 1, 0),
    ('Schwyz', 1, 0),
    ('Solothurn', 1, 0),
    ('St. Gallen', 1, 0),
    ('Thurgau', 1, 0),
    ('Ticino', 1, 0),
    ('Uri', 1, 0),
    ('Valais', 1, 0),
    ('Vaud', 1, 0),
    ('Zug', 1, 0),
    ('Zürich', 1, 0);

INSERT INTO powerup (name, description, cost) VALUES
    ('location', 'See the other teams’ location for some time', 100),
    ('double up ', 'double payment for traffifs', 100),
    ('Upper hand', 'Increase your hand size by one temporarily', 100),
    ('Trade deal', "Trade one card in your hand with one in the opponent's hand.", 100);

INSERT INTO curse (name, description, cost) VALUES
    ('freeze', 'Freeze the other team in place for some time', 1);

INSERT INTO challenge (name, description, levels, money) VALUES
    ('easy', 'baby shit', 1, 0),
    ('medium', 'based', 2, 2),
    ('hard', 'eat nails', 3, 5);


INSERT INTO team (name, money, score) VALUES ('A team', 0, 0);
INSERT INTO team (name, money, score) VALUES ('Timsaac', 0, 0);

INSERT INTO user (username, firstname, lastname, team_id, hashed_password) VALUES
   ('aaronlieb', 'Aaron', 'Lieberman', 1, '$2b$12$D.Sp6Eavi4YrE0gZ8fC.n.LEkxkvDRosaWSZYlDXQgw9vuzVLN1ne'),
   ('antonio', 'Antonio', 'Alonso', 1, null),
   ('icf', 'Isaac', 'Feldman', 2, null),
   ('timjh', 'Tim', 'Harrold', 2, null);

