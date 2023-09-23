import prismadb from '@/lib/prismadb';
import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const user = await currentUser();
		const { performedAt, location, exercises } = body;

		if (!user || !user.id || !user.firstName) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (!performedAt || !exercises) {
			return new NextResponse('Missing required fields', { status: 400 });
		}

		const training = await prismadb.training.create({
			data: {
				performedAt,
				location,
				userId: user.id,
				exercises: {
					create: exercises,
				},
			},
			include: {
				exercises: true,
			},
		});

		return NextResponse.json(training);
	} catch (error) {
		console.log('[TRAINING_POST]');
		return new NextResponse('Internal Error', { status: 500 });
	}
}
