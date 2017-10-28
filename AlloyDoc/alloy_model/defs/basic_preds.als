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
