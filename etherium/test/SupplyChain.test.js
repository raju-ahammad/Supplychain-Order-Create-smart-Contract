const SupplyChain = artifacts.require('SupplyChain.sol');

contract('SupplyChain', async(accounts) => {

	// members
	const supplier = accounts[0];
	const deliveryCompany = accounts[1];
	const customer = accounts[2];

	// order params
	const title = 'Mango';
	const description = 'Mango juice';

	// Statuses
	const CREATED = 0;
	const DELIVERING = 1;
	const DELIVERED = 2;
	const ACCEPTED = 3;
	const DECLINED = 4;

	// indexes
	const orderIndex = 0;

	it('1. Create new order', async() => {
		const instance = await SupplyChain.deployed();
		await instance.createOrder(title, description, deliveryCompany, customer);

		const order = await instance.getOrder(orderIndex);

		assert.equal(title, order[0], 'Order title is not correct');
		assert.equal(description, order[1], 'Description is not correct');
		assert.equal(supplier, order[2], 'Supplier is not correct');
		assert.equal(deliveryCompany, order[3], 'Supplier is not correct');
		assert.equal(customer, order[4], 'Supplier is not correct');
		assert.equal(CREATED, order[5], 'Status is not 0 (Created)');
	});

	it('2. Start delivering order', async() => {
		const instance = await SupplyChain.deployed();

		await instance.startDeliveringOrder(orderIndex, {from: deliveryCompany});

		const order = await instance.getOrder(orderIndex);

		assert.equal(DELIVERING, order[5], 'Status is not 1 (Delivering)');
	});

	it('3. Stop delivering order', async() => {
		const instance = await SupplyChain.deployed();

		await instance.stopDeliveringOrder(orderIndex, {from: deliveryCompany});

		const order = await instance.getOrder(orderIndex);

		assert.equal(DELIVERED, order[5], 'Status is not 2 (Delivered)');
	});

	it ('4. Customer accept order', async() => {
		const instance = await SupplyChain.deployed();

		await instance.acceptOrder(orderIndex, {from: customer});

		const order = await instance.getOrder(orderIndex);

		assert.equal(ACCEPTED, order[5], 'Status is not 3 (Accepted)');
	});

	it ('5. Customer can\'t decline accepted order', async() => {
		const instance = await SupplyChain.deployed();

		try {
			await instance.declineOrder(orderIndex, {from: customer});
		} catch(err) {
			assert.equal(err.message, 'Returned error: VM Exception while processing transaction: revert', 'Expected "revert" error');
		}
	});

	it ('6. Customer can decline delivered order', async() => {
		const instance = await SupplyChain.deployed();

		const newOrderIndex = orderIndex + 1;

		await instance.createOrder(title, description, deliveryCompany, customer);
		await instance.startDeliveringOrder(newOrderIndex, {from: deliveryCompany});
		await instance.stopDeliveringOrder(newOrderIndex, {from: deliveryCompany});
		await instance.declineOrder(newOrderIndex, {from: customer});

		const order = await instance.getOrder(newOrderIndex);

		assert.equal(DECLINED, order[5], 'Status is not 4 (Declined)');
	});

});