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

	- 	Males are orange, females are cyan -> they are created at random with 1/2 chance

	- 	Their motion is a random walk --> The next step they take is totally random 
		in the x, y direction on a 2d plane

	- 	All creatures start at the middle of the canvas (their habitat)

Scheduling:

	- 	The creatures live by a timing of day. 1 day = 1000 steps.

		Note: 1 step is in function of distance. At the beginning, the creatures can step
			  at only 10px in any directions

	- 	Once all creatures had the chance to make 1000 random steps, a new day begins

	- 	Before a new day starts, all creatures are brought back to the middle of the canvas
		to ensure fairness in the random walk and food consumption

Food:

	- 	Every day, a certain amount of food appears in the environment (food represented as small
		purple circles) at random positions. The food from the previous day disappears. 

	- 	If a creature is located at a distance of < 5px (calculated using euclidean distance) from a food source, 
		it can direcly go and eat it (the food disappears from the environment). This was put in place since
		the chances of a creature and food being at the same exact coordinates is practically 0. (x, y coords are doubles).

	- 	When a creature eats a food, its size increases (radius of ball increases). However, its size comes back to normal
		the next day

Some formulas (mostly from https://www.youtube.com/channel/UCKzJFdi57J53Vr_BkTfN3uQ):

	-	If we want population size to be constant: Death Rate = Birth Rate

	-	Death Rate = N (pop size) * D (Chances of individual of Dying)

	-	Birth Rate = B (spontaneous apparition) + N * R (Chances of individual reproducing)

	-	We get 	Death Rate = Birth Rate 	<=> 	N * D = B + N * R
											<=>		N = B/(D - R) 		(Simplification of above equation)