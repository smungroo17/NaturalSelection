# Natural Selection
Genetic Algorithm Project - Natural Selection

This project is meant to simulate the process of Natural Selection as it happens in the wild.


Inspired by:

	-	Primer, Youtube Channel: https://www.youtube.com/channel/UCKzJFdi57J53Vr_BkTfN3uQ

	-	Luke Garrigan article: https://dev.to/lukegarrigan/genetic-algorithms-in-javascript-mc3

	-	John Fish Youtube video and code:	https://www.youtube.com/watch?v=_Vxjh1QxApA&t=365s
											https://github.com/johnafish/garden/tree/main/geneticracer

This project is meant to simulate the process of Natural Selection as it happens in the wild.

The individual:

	- 	The individual will be simulated by a ball object.

	- 	Their motion is a random walk --> The next step they take is totally random 
		in the x, y direction on a 2d plane by a distance of 10 units (*2)

	- 	All creatures start at the middle of the canvas (their habitat)

Scheduling:

	- 	The creatures live by a timing of day. 1 day = 1000 steps.

		Note: 1 step is in function of distance. At the beginning, the creatures can step
			  at only 10 distance units (du) in any directions

	- 	Once all creatures had the chance to make 1000 random steps, a new day begins

	- 	Before a new day starts, all creatures are brought back to the middle of the canvas
		to ensure fairness in the random walk and food consumption

Food:

	- 	Every day, a certain amount of food appears in the environment (food represented as small
		purple circles) at random positions. The food from the previous day disappears. 

	- 	If a creature is located at a distance of < 10 du (calculated using euclidean distance from coords) from a food source, 
		it can direcly go and eat it (the food disappears from the environment). This was put in place since
		the chances of a creature and food being at the same exact coordinates is practically 0. (x, y coords are doubles). (*1)

	- 	When a creature eats a food, its size increases (radius of ball increases). However, its size comes back to normal
		the next day

	-	If a creature eats:
				0 unit of food -> it dies
				1 unit of food -> it survives to the next day
				2 units of food -> it survives to the next day and creates a copy of itself

Some formulas (mostly from https://www.youtube.com/channel/UCKzJFdi57J53Vr_BkTfN3uQ):

	-	If we want population size to be constant: Death Rate = Birth Rate

	-	Death Rate = N (pop size) * D (Chances of individual of Dying)

	-	Birth Rate = B (spontaneous apparition) + N * R (Chances of individual reproducing)

	-	We get 	Death Rate = Birth Rate 	<=> 	N * D = B + N * R
											<=>		N = B/(D - R) 		(Simplification of above equation)

Point mutations (IMPORTANT!):

	- 	Point mutations are inserted during replication. It is important to note that an individual DOESN'T CHANGE.
		When an individual is born some way its genes don't change (EXACTLY AS IN THE WILD). Point mutations have
		a 4% of happening.

	-	When replicating (making a copy of itself), an individual leads to a descendant X. That descendant has a 2% chance
		of suffering from a mutation touching its sight (distance at which it can see food and jump directly to it, see (*1)).
		This mutation has a 50% chance of being advantageous (can see food at 15 du instead of 10 du) or disadvantageous
		(can see food at only 5 du instead of 10 du).

	-	Therefore, the current probabilities are:
			*	Advantageous mutation touching sight = 0.04 * 0.25 = 0.01 = 1% chance
			*	Disadvantageous mutation touching sight = 0.04 * 0.5 = 0.01 = 1% chance

	-	NEW MUTATION: A new mutation was added touching the displacement of the individual in the x, y direction. 
		When replicating (making a copy of itself), an individual leads to a descendant X. That descendant has a 2% chance
		of suffering from a mutation touching its displacement (random walk step length in the x, y direction). 
		This mutation has a 50% chance of being advantageous (next step length of 12 du instead of 10 du) 
		or disadvantageous (next step length of 8 du instead of 10 du).

	-	Therefore, the current probabilities are:
			*	Advantageous mutation touching displacement = 0.04 * 0.25 = 0.01 = 1% chance
			*	Disadvantageous mutation touching displacement = 0.04 * 0.5 = 0.01 = 1% chance
