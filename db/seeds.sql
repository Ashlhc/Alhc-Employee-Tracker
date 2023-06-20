
INSERT INTO departments (name)
VALUES
("Design"),                     
("Engineering"),                
("Art"),                        
("Animation"),                  
("Programming"),                
("Software Development");      
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
("Software Developer", 100000, 6);         

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Alivia", "Thomas", 1, NULL),               
("Uriah", "Belletto", 2, 1),                          
("Ashleigh", "Chute", 3, NULL),               
("Ladonna", "Heikes", 4, 3),            
("Ashleigh", "Raabe", 5, NULL),               
("William", "Colvin III", 6, 5),         
("Kelly", "Synder", 7, NULL),                  
("Sara", "McSorley", 8, 7),              
("Jeff", "Doering", 9, NULL),                 
("Jordan", "Mayou", 10, 9),              
("Scarlett", "Rose", 11, NULL);

