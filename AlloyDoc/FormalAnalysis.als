open util/time
abstract sig Bool {}

one sig true extends Bool {}
one sig false extends Bool {}

sig UserPreferences {
	carSharing : one Bool,
	bikeSharing : one Bool,
	publicTransport : one Bool,
	maxWalkingRange : one int,
	ecoProfile : one Bool 
}

sig Priority {
	level : one int 			--The level of priority of a Task, used to topologically ordering the various tasks
}{
	level > 0 && level <= 5
}

abstract sig Vehicle {}

one sig privateVehicle extends Vehicle{}
one sig publicVehicle extends Vehicle{}

sig Trip {


}

sig Location { 			-- The location of a task, defined over its latitude and longitude
	lat : one int,
	long : one int
}

sig TimeSlot {
	

}

sig Stop {


}

sig Link {


}

sig Task {
	
	


}

sig User {




}

sig TravelSolution {



}
