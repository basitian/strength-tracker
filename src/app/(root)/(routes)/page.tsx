import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prismadb';
import { auth, redirectToSignIn } from '@clerk/nextjs';
import { format } from 'date-fns';
import { Activity, ArrowUp, Dumbbell, Plus, Trophy } from 'lucide-react';
import Link from 'next/link';
import ExerciseSelector from '@/components/exercise-selector';
import ProgressChart from '@/components/progress-chart';
import { buttonVariants } from '@/components/ui/button';

type ExercisesPageProps = {
	searchParams: {
		from: string;
		to: string;
		exercise: string;
	};
};

const ExercisesPage = async ({ searchParams }: ExercisesPageProps) => {
	const { userId } = auth();

	if (!userId) {
		return redirectToSignIn();
	}

	const allExercises = await prisma.exercise.findMany();

	const trainings = await prisma.training.findMany({
		where: {
			userId: userId,
			performedAt: {
				gte: searchParams.from ? new Date(searchParams.from) : new Date(),
				lte: searchParams.to ? new Date(searchParams.to) : new Date(),
			},
			exercises: {
				some: {
					exercise: {
						id: searchParams.exercise ?? '',
					},
				},
			},
		},
		include: {
			exercises: {
				select: {
					id: true,
					weight: true,
					repetitions: true,
					rpe: true,
					exercise: true,
				},
			},
		},
		orderBy: {
			performedAt: 'desc',
		},
	});

	const maxWeight = Math.max(
		...trainings.flatMap((t) =>
			t.exercises
				.filter((e) => e.exercise.id === searchParams.exercise)
				.map((e) => e.weight)
		),
		0
	);

	const totalWeightLifted = trainings.reduce<number>((acc, curr) => {
		return (
			acc +
			curr.exercises
				.filter((e) => e.exercise.id === searchParams.exercise)
				.reduce((acc, curr) => {
					return acc + curr.weight * (curr.repetitions ?? 1);
				}, 0)
		);
	}, 0);

	const totalReps = trainings.reduce<number>((acc, curr) => {
		return (
			acc +
			curr.exercises
				.filter((e) => e.exercise.id === searchParams.exercise)
				.reduce((acc, curr) => {
					return acc + (curr.repetitions ?? 1);
				}, 0)
		);
	}, 0);

	const totalTrainings = trainings.length;

	const chartData = trainings
		.map((training) => {
			return {
				date: format(training.performedAt, 'dd.MM.yyyy'),
				weight: training.exercises.filter(
					(e) => e.exercise.id === searchParams.exercise
				)[0].weight,
			};
		})
		.reverse();

	return (
		<div className='h-full flex-1 space-y-4 p-4 pt-6'>
			<h2 className='text-3xl font-bold tracking-tight'>
				Training Dashboard
				{searchParams.exercise &&
					` • ${
						allExercises.find((e) => e.id === searchParams.exercise)?.name
					}`}
			</h2>
			<div className='space-y-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<ExerciseSelector exercises={allExercises} />
						<CalendarDateRangePicker />
					</div>
					<Link
						href='/training/add'
						className={buttonVariants({ variant: 'default' })}
					>
						<Plus className='w-5 h-5 mr-1' />
						Add Training
					</Link>
				</div>
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Trainings
							</CardTitle>
							<Trophy className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{totalTrainings}</div>
							{/* <p className='text-xs text-muted-foreground'>
								+2 from last month
							</p> */}
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Maximum Weight
							</CardTitle>
							<Dumbbell className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{maxWeight}kg</div>
							{/* <p className='text-xs text-muted-foreground'>
								+19kg from last month
							</p> */}
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Weight Lifted
							</CardTitle>
							<ArrowUp className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{totalWeightLifted}kg</div>
							{/* <p className='text-xs text-muted-foreground'>
								+18kg from last month
							</p> */}
						</CardContent>
					</Card>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Total Reps</CardTitle>
							<Activity className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{totalReps}</div>
							{/* <p className='text-xs text-muted-foreground'>
								+10 from last month
							</p> */}
						</CardContent>
					</Card>
				</div>
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
					<Card className='col-span-4'>
						<CardHeader>
							<CardTitle>Exercise Progress</CardTitle>
						</CardHeader>
						<CardContent className='pl-2'>
							{!searchParams.exercise ? (
								<p className='px-4 text-sm text-muted-foreground'>
									Select an exercise...
								</p>
							) : trainings.length > 0 ? (
								<ProgressChart data={chartData} />
							) : (
								<p className='px-4 text-sm text-muted-foreground'>
									No trainings yet...
								</p>
							)}
						</CardContent>
					</Card>
					<Card className='col-span-3'>
						<CardHeader>
							<CardTitle>Recent Trainings</CardTitle>
						</CardHeader>
						<CardContent className='px-2'>
							<div className='space-y-4'>
								{!searchParams.exercise ? (
									<p className='px-4 text-sm text-muted-foreground'>
										Select an exercise...
									</p>
								) : trainings.length > 0 ? (
									trainings.map((training) => (
										<Link
											href={`/training/${training.id}`}
											className='flex items-center hover:bg-secondary rounded-md px-4 py-2'
											key={training.id}
										>
											<div className='space-y-1'>
												<p className='text-sm font-medium leading-none'>
													{format(training.performedAt, 'dd.MM.yyyy')}
												</p>
												{training.location && (
													<p className='text-sm text-muted-foreground'>
														{training.location}
													</p>
												)}
											</div>
											<p className='ml-auto font-medium text-xl'>
												{
													training.exercises.filter(
														(e) => e.exercise.id === searchParams.exercise
													)[0].weight
												}
												kg{' '}
												<span className='text-sm font-normal text-muted-foreground'>
													x
													{
														training.exercises.filter(
															(e) => e.exercise.id === searchParams.exercise
														)[0].repetitions
													}{' '}
													@ RPE{' '}
													{
														training.exercises.filter(
															(e) => e.exercise.id === searchParams.exercise
														)[0].rpe
													}
												</span>
											</p>
										</Link>
									))
								) : (
									<p className='px-4 text-sm text-muted-foreground'>
										No trainings yet...
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default ExercisesPage;
