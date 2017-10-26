sig timeslot{
  start   : one Int,
  end		: one Int 
}{
	start<end and start > 0 and end > 0
}
sig task{
	time_slot : one timeslot
}

sig travel {
	task_from : one task,
	task_to : one task,
	time_slot : one timeslot
    travel_time : one int

}{
	// task_from.time_slot.start	<	task_to.time_slot.start	and
    	task_from.time_slot.end	< task_to.time_slot.start 	and
		time_slot.start > task_from.time_slot.end           and
		time_slot.end < task_to.time_slot.start             and
        travel_time = minus[time_slot.end, time_slot.start]
}
sig schedule{
	tasks : some task,
	travels: some travel
    total_travel_time : one Int
}{
	(all t :tasks | no u :tasks |  t != u and overlapped[t.time_slot, u.time_slot]	)			    and
	(all travel : travels | no task : tasks | overlapped[travel.time_slot, task.time_slot])	        and
	(all travel : travels | no u : travels | overlapped[travel.time_slot, u.time_slot])             and
    sum p :  
}

sig notOverlappedScheduleSet{
	schedules : some schedule
	tasks : some task
} {
    all t : task | no u : task | overlapped[t,u] and u != t
	all s : schedules | all t1 : tasks | some t2 : s.tasks.task | (t1 = t2)  
	#s.tasks > 5
}


