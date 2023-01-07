import { faker } from "@faker-js/faker";
import { prisma } from "./db/client";
import { clean } from "./helpers/clean";

/*
 * many-to-many
 * A category can have a parent category and a category can have multiple child categories
 */

async function createCategories() {
	await clean();

	const categoriesPromises = Array(10)
		.fill(null)
		.map(() => {
			return prisma.category.create({
				data: {
					name: faker.commerce.productAdjective(),
				},
			});
		});

	// wrap promises into transaction, if some fail it will rollback
	const categories = await prisma.$transaction(categoriesPromises);

	// create child categories
	const childCategoriesPromises = Array(10)
		.fill(null)
		.map((_, index) => {
			return prisma.category.create({
				data: {
					name: faker.commerce.productAdjective(),
					parent: {
						connect: {
							id: categories[index].id,
						},
					},
				},
			});
		});

	return prisma.$transaction(childCategoriesPromises);
}

function findCategory() {
	return prisma.category.findMany({
		include: {
			parent: true,
			children: true
		}
	});
}

console.log("Relationship: many-to-many");
console.log(JSON.stringify(await createCategories(), null, 2));
console.log("\n\n ### ---- ### \n ### ---- ### \n\n");
console.log(JSON.stringify(await findCategory(), null, 2));
