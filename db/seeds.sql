USE employees_db;
INSERT INTO departments (name)
VALUES
("Design"),                     
("Engineering"),                
("Art"),                        
("Animation"),                  
("Programming"),                
("Software Development"),  
("Quality Assurance");     

INSERT INTO roles (title, salary, department_id)
VALUES
("Lead Designer", 130000, 1),                
("Game Designer", 1000000,1),                
("Lead Software Engineer", 150000, 2),       
("Software Engineer", 125000, 2),            
("Art Lead", 140000, 3),                     
("Concept Artist", 100000, 3),               
("Lead Animator", 230000, 4),                
("Animator", 85000, 4),                      
("Lead Programmer", 115000, 5),              
("Programmer", 100000, 5),                   
("Lead Software Developer", 130000, 6),      
("Software Developer", 100000, 6),
("Quality Assurance Lead", 85000, 7);           

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Alivia", "Thomas", 9, NULL),               
("Uriah", "Belletto", 1, NULL),                          
("Ashleigh", "Chute", 12, 4),               
("Ladonna", "Heikes", 11, NULL),            
("Ashleigh", "Raabe", 12, 4),               
("William", "Colvin III", 3, NULL),         
("Kelly", "Synder", 4, 6),                  
("Sara", "McSorley", 5, NULL),              
("Jeff", "Doering", 10, 1),                 
("Jordan", "Mayou", 1, NULL),              
("Scarlett", "Rose", 13, NULL);