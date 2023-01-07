import { faker } from "@faker-js/faker";
import { prisma } from "./db/client";
import { clean } from "./helpers/clean";

/*
 * many-to-many
 * A product can have multiple categories and a category can belong to multiple products
 */

async function createProductWithCategories() {
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

	const productPromises = Array(10)
		.fill(null)
		.map(() => {
			return prisma.product.create({
				data: {
					name: faker.commerce.productName(),
					description: faker.commerce.productDescription(),
					price: 100,
					category: {
						connect: [
							{
								// random number from categories to set product.category
								id: categories[Math.floor(Math.random() * categories.length)]
									.id,
							},
							{
								// random number from categories to set product.category
								id: categories[Math.floor(Math.random() * categories.length)]
									.id,
							},
						],
					},
				},
				include: {
					category: true,
				},
			});
		});

	// wrap promises into transaction, if some fail it will rollback
	return prisma.$transaction(productPromises);
}

console.log("Relationship: many-to-many");
console.log(JSON.stringify(await createProductWithCategories(), null, 2));
