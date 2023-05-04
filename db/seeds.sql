USE employees_db;
INSERT INTO department (name)
VALUES
("Design"),                     -- 1
("Engineering"),                -- 2
("Art"),                        -- 3
("Design"),                     -- 4
("Animation"),                  -- 5
("Programming"),                -- 6
("Software Development");        -- 7

INSERT INTO roles (title,salary,department_id)
VALUES
("Lead Designer",130000, 1),                --1
("Designer",1000000,1),                     --2 
("Lead Software Engineer",150000,2),        --3
("Software Engineer",125000,2),             --4 
("Art Lead",140000,3),                      --5
("Concept Artist",100000,3),                --6
("Design Lead",120000,4),                   --7
("Game Designer",950000,4),                 --8
("Lead Animator",230000,5),                  --9
("Animator",85000,5),                       --10
("Lead Programmer",115000,6),                --11
("Programmer",100000,6),                    --12
("Lead Software Developer",130000,7),       --13
("Software Developer",100000,7);             --14

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Alivia","Thomas",9,NULL),
("Uriah","Belletto",7,NULL),
("Ashleigh","Chute",14,13),
("Ladonna","Heikes",13,NULL),
("Ashleigh","Raabe",14,13),
("William","Colvin III",3,NULL),
("Kelly","Synder",4,3),
("Sara","Mcsorley",5,NULL),
("Jeff","Doering",12,11),
("Jordan","Mayou",1,NULL);
