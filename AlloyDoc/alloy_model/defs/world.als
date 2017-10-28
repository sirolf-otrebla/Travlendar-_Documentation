

sig timeslot{
  start   : one Int,
  end		: one Int 
}{
	start<=end and start > 0 and end > 0
}
sig task{
	time_slot : one timeslot
}

sig travel {
	task_from : one task,
	task_to : one task,
	time_slot : one timeslot

}{
    	task_from.time_slot.end	< task_to.time_slot.start 	and
		time_slot.start >= task_from.time_slot.end 				and
		time_slot.end <= task_to.time_slot.start
}
sig schedule{
    dummy_start_task : one task,
    dummy_end_task : one task,
	tasks : some task,
	travels: some travel
}{
	#travels = plus[#tasks, 1]

	and (no t : tasks | t = dummy_start_task)  		
																	
	and (no t : tasks | t = dummy_end_task)		

	and  (dummy_start_task = dummy_end_task implies #tasks = 0)

	and ((some tr : travels | tr.task_from = dummy_start_task and tr.task_to = dummy_end_task ) implies
								#tasks = 0 ) 																														

	and	(all t : tasks | t.time_slot.start != t.time_slot.end)																											

	and (all t : travels | t.time_slot.start != t.time_slot.end)
																											
   // every task is not overlapped with other tasks
    and (all u :tasks | no v :tasks |  v != u and overlapped[v.time_slot, u.time_slot]	)	

	and (all trav : travels | no task : tasks | overlapped[trav.time_slot, task.time_slot])	  		
							                              							                            						
	and (all trav : travels, u : travels | overlapped[trav.time_slot, u.time_slot] implies u = trav)                                    

	and (all t : tasks | some trav : travels | 
											trav.task_from = t and not trav.task_to = t 
											or  ( not trav.task_from = t and trav.task_to = t ))

	and (no t : tasks | t.time_slot.start < dummy_start_task.time_slot.start) 

	and (no u : tasks | u.time_slot.end > dummy_end_task.time_slot.start)

	and (all tas : tasks + dummy_end_task | some trav : travels | trav.task_to = tas)

	and (all tas : tasks + dummy_start_task | some trav : travels | trav.task_from = tas)

		
    


}


//sig scheduleSet{
//	schedules : some schedule,
//	tasks : one taskSet
//} {
//	all s : schedules | all t1 : tasks | some t2 : s.tasks.task | (t1 = t2)  
//	#s.tasks > 5
//}

//sig taskSet{
//	tasks : some task
//} {
//	#tasks > 6
	
//	no x, y : tasks | overlapped[x.time_slot,y.time_slot]
//}

pred overlapped[t,u : timeslot]{
	u.start = t.start or
	(u.start > t.start implies u.start < t.end) and
	(t.start > u.start implies t.start < u.end) or eq[t,u]
}

pred eq[t, u: timeslot]{
(t.start = u.start and t.end = u.end) or t=u
}

pred bigSchedule[s: schedule]{
	#s.tasks > 1
}
//run notOverlapped for 10 timeslot, 0 task, 0 schedule
//run  bigSchedule for 3 schedule, 6 task, 10 timeslot


assert contained{
no s : schedule | (
		bigSchedule[s] and some x : s.tasks, y : s.tasks | (
				x.time_slot.start > y.time_slot.start and x.time_slot.end < y.time_slot.end
				)
		)
}

assert continuous_sched {
	all s : schedule | (
			bigSchedule[s] implies
			 one t : s.travels | t.task_to = s.dummy_end_task and continuous_pt2[t, s]
	)
}

pred continuous_pt2[t : travel, s :schedule]{
	t.task_from = s.dummy_start_task 
	or (some t2 : s.travels | t.task_from = t2.task_to and continuous_pt3[t2, s]) 
}

pred continuous_pt3[t : travel, s :schedule]{
	t.task_from = s.dummy_start_task 
	or (some t2 : s.travels | t.task_from = t2.task_to and continuous_pt2[t2, s] )

}

sig World {
 bestSchedule : one schedule,
 tasks : some task,
 travs: some travel
} {
tasks = bestSchedule.tasks
 //(all t1 : tasks | one t2 : bestSchedule.tasks | ( t1 = t2 ))
 //and (all t2 : bestSchedule.tasks |one t1 : tasks | ( t1 = t2 ))
 and (all t1 : tasks, t2 : tasks | (t2 != t1) implies ( t1.time_slot != t2.time_slot and 
																					not overlapped[t1.time_slot, t2.time_slot]))
 
 and (all tr1: bestSchedule.travels | one tr2 : travs | tr1 = tr2 )

 and (all tr : bestSchedule.travels | no tr2 : travs | ( tr != tr2 ) and (( tr.task_from = tr2.task_from )
            and (tr.task_to = tr2.task_to )
             and ( minus[tr.time_slot.end, tr.time_slot.start] >  minus[tr2.time_slot.end, tr2.time_slot.start] ))
)
}
pred showWorld[wor : World]{
	bigSchedule[wor.bestSchedule]
	//#wor.tasks > 2
 	//#wor.travs > 3
}

run showWorld for 1 World, 1 schedule, 4 task, 5 travel, 10 timeslot 
run bigSchedule for  1 schedule, 4 task, 3 travel, 7 timeslot, 0 World
check continuous_sched for  1 schedule, 4 task, 3 travel, 7 timeslot
