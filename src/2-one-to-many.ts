import { createProductsWithCategories } from "./helpers/products";
import { createUser } from "./helpers/user";
import { prisma } from "./db/client";
import { sampleArray } from "./helpers/random";
import { clean } from "./helpers/clean";

/*
 * One to many
 * An order has one user, a user can have many orders
 */
async function createOrder() {
	// clean db
	await clean();

	// create products and users
	const products = await createProductsWithCategories();
	const user = await createUser();

	// create order
	const order = await prisma.order.create({
		data: {
			user: {
				connect: {
					id: user.id
				}
			},
			products: {
				connect: sampleArray(products).map((product) => ({
					id: products.id
				}))
			}
		}
	});

	return { order };
}


console.log("Relationship: one-to-may");
console.log(await createOrder());
