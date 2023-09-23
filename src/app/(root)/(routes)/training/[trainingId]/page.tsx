import { auth, redirectToSignIn } from '@clerk/nextjs';
import prisma from '@/lib/prismadb';
import TrainingForm from './components/training-form';

type TrainingIdPageProps = {
	params: {
		trainingId: string;
	};
};

const TrainingIdPage = async ({ params }: TrainingIdPageProps) => {
	const { userId } = auth();

	if (!userId) {
		return redirectToSignIn();
	}

	const { trainingId } = params;

	const training = await prisma.training.findUnique({
		where: {
			id: trainingId,
			userId: userId,
		},
		include: {
			exercises: true,
		},
	});

	const exercises = await prisma.exercise.findMany();

	return <TrainingForm initialData={training} exercises={exercises} />;
};

export default TrainingIdPage;
