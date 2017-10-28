abstract sig Bool {}

one sig true extends Bool {}
one sig false extends Bool {}

//XOR predicate
pred XOR[ x1 : Bool, x2 : Bool] {
    (x1 = false and x2 = true) or (x1 = false and x2 = true) 
}

//XOR predicate on three variables, true iif only one of the passed var is true 
pred XOR3[ x1 : Bool, x2 : Bool, x3 : Bool] {

    (x1 = true and x2 = false and x3 = false) 

    or (x1 = false and x2 = true and x3 = false) 
    
    or (x1 = false and x2 = false and x3 = true)      
}
