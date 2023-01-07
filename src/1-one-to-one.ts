import { faker } from "@faker-js/faker";
import { prisma } from "./db/client";
import { clean } from "./helpers/clean";

/*
 * one-to-one
 * A user has one profile, a profile belongs to one user
 */
async function createUserWithProfile() {
	// clean db
	await clean();

	// create an user and then a profile
	const user = await prisma.user.create({
		data: {},
	});

	const profile = await prisma.profile.create({
		data: {
			name: faker.name.firstName(),
			userId: user.id,
		},
	});

	const userOne = await prisma.user.findUnique({
		where: {
			id: user.id,
		},
		include: {
			// profile: true // include all profile fileds
			profile: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	// create an user with a profile
	const userTwo = await prisma.user.create({
		data: {
			profile: {
				create: {
					name: faker.name.firstName(),
				},
			},
		},
		include: {
			profile: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	return { userOne, userTwo };
}

console.log("Relationship: one-to-one");
console.log(await createUserWithProfile());
