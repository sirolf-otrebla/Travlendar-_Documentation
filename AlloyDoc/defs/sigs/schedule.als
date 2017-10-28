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

	and (all trav : travels, trav2 : travels |
				(trav2 != trav implies trav.task_to != trav2.task_to ))

	and (all trav : travels, trav2 : travels |
				(trav2 != trav implies trav.task_from != trav2.task_from))
		
    


}


//sig scheduleSet{
//	schedules : some schedule,
//	tasks : one taskSet
//} {
//	all s : schedules | all t1 : tasks | some t2 : s.tasks.task | (t1 = t2)  
//	#s.tasks > 5
//}