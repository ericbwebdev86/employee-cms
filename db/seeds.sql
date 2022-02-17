INSERT INTO department (department_name)
VALUES
  ('Engineering'),
  ('Finance'),
  ('Legal'),
  ('Sales');

INSERT INTO employee_role (title, salary, department_id)
VALUES
  ('Sales Lead', 100000.00, 4),
  ('Salesperson', 80000.00, 4),
  ('Lead Engineer', 150000.00, 1),
  ('Software Engineer', 120000.00, 1),
  ('Account Manager', 160000.00, 2),
  ('Accountant', 125000.00, 2),
  ('Legal Team Lead', 250000, 3),
  ('Lawyer', 190000.00, 3);

  INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Kaelthas', 'Sunstrider', 1, null),
  ('Lorthremar', 'Theron', 2, 1),
  ('Lady', 'Liadrin', 2, 1),
  ('Arthas', 'Menethil', 3, null),
  ('Jaina','Proudmoore', 4, 3),
  ('Anduin', 'Wrynn', 4, 3),
  ('Uther', 'Lightbringer', 5, null),
  ('Grom', 'Hellscream', 6, 7),
  ('Ogrim', 'Doomhammer', 6, 7),
  ('Varok', 'Saurfang', 7, null),
  ('Gally', 'Wix', 8, 10),
  ('Marin', 'Noggenfogger', 8, 10);