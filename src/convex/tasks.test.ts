import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { modules } from './test.setup';
import schema from './schema';

test('tasks crud operations', async () => {
	const t = convexTest(schema, modules);

	// Test creating a task
	const firstTask = await t.run(async (ctx) => {
		await ctx.db.insert('tasks', { text: 'Test task', isCompleted: false });
		return await ctx.db.query('tasks').first();
	});

	expect(firstTask).toMatchObject({
		text: 'Test task',
		isCompleted: false
	});
});