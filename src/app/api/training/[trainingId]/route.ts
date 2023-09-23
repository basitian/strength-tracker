import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function PATCH(
	req: Request,
	{ params }: { params: { trainingId: string } }
) {
	try {
		const body = await req.json();
		const user = await currentUser();
		const { performedAt, location, exercises } = body;

		if (!params.trainingId) {
			return new NextResponse('Missing trainingId parameter', { status: 400 });
		}

		if (!user || !user.id || !user.firstName) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (!performedAt || !exercises) {
			return new NextResponse('Missing required fields', { status: 400 });
		}

		console.log(
			'[TRAINING_PATCH]',
			params.trainingId,
			user.id,
			performedAt,
			location,
			exercises
		);

		const training = await prismadb.training.update({
			where: {
				id: params.trainingId,
				userId: user.id,
			},
			data: {
				performedAt,
				location,
				userId: user.id,
				exercises: {
					upsert: [
						...exercises.map((exercise: any) => ({
							where: { id: exercise.id ?? '' },
							update: exercise,
							create: exercise,
						})),
					],
				},
			},
			include: {
				exercises: true,
			},
		});

		return NextResponse.json(training);
	} catch (error: any) {
		console.log('[TRAINING_PATCH]', error.message);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { trainingId: string } }
) {
	try {
		const user = await currentUser();

		if (!user || !user.id || !user.firstName) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const training = await prismadb.training.delete({
			where: {
				userId: user.id,
				id: params.trainingId,
			},
		});

		return NextResponse.json(training);
	} catch (error) {
		console.log('[TRAINING_DELETE]', error);

		return new NextResponse('Internal Error', { status: 500 });
	}
}
