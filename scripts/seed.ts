const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
	const exercises = [
		{ name: 'Squats' },
		{ name: 'Front Squats' },
		{ name: 'Overhead Squats' },
		{ name: 'Snatches' },
		{ name: 'Hang Snatches' },
		{ name: 'Power Snatches' },
		{ name: 'Cleans' },
		{ name: 'Hang Cleans' },
		{ name: 'Power Cleans' },
		{ name: 'Jerks' },
		{ name: 'Push Jerks' },
		{ name: 'Split Jerks' },
		{ name: 'Deadlifts' },
		{ name: 'Sumo Deadlifts' },
		{ name: 'Romanian Deadlifts' },
		{ name: 'Presses' },
		{ name: 'Push Presses' },
		{ name: 'Strict Presses' },
		{ name: 'Bench Presses' },
	];
	try {
		exercises.forEach(async (exercise) => {
			await db.exercise.create({
				data: exercise,
			});
			console.log(`Exercise ${exercise.name} created!`);
		});
	} catch (err) {
		console.error('Error seeding default exercises: ', err);
	} finally {
		await db.$disconnect();
	}
}

main();
