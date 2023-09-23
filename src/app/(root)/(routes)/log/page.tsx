import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { auth, redirectToSignIn } from '@clerk/nextjs';
import prisma from '@/lib/prismadb';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import MoreDropdownMenu from './components/more-dropdown-menu';

type LogPageProps = {
	searchParams: {
		from: string;
		to: string;
	};
};

const LogPage = async ({ searchParams }: LogPageProps) => {
	const { userId } = auth();

	if (!userId) {
		return redirectToSignIn();
	}

	const trainings = await prisma.training.findMany({
		where: {
			userId: userId,
			performedAt: {
				gte: searchParams.from ? new Date(searchParams.from) : new Date(),
				lte: searchParams.to ? new Date(searchParams.to) : new Date(),
			},
		},
		include: {
			exercises: {
				select: {
					id: true,
					weight: true,
					repetitions: true,
					rpe: true,
					exercise: {
						select: {
							name: true,
						},
					},
				},
			},
		},
		orderBy: {
			performedAt: 'desc',
		},
	});

	return (
		<div className='h-full p-4 space-y-2 max-w-4xl mx-auto'>
			<div className='space-y-2 w-full'>
				<div className='flex justify-between items-center'>
					<div>
						<h3 className='text-lg font-medium'>Training Log</h3>
						<p className='text-sm text-muted-foreground'>
							Search your performed trainings
						</p>
					</div>
					<div className='flex items-center gap-2'>
						<p>{trainings.length} total</p>
						<CalendarDateRangePicker />
					</div>
				</div>
				<Separator className='bg-primary/90' />
			</div>
			{trainings.map((training) => (
				<Card key={training.id}>
					<Collapsible>
						<CardHeader className='flex flex-row justify-between items-center px-4 py-2'>
							<CardTitle className='text-xl flex items-center'>
								{format(training.performedAt, 'dd.MM.yyyy')}
								{training.location && (
									<p className='ml-1 text-sm font-normal text-muted-foreground'>
										• {training.location}
									</p>
								)}
							</CardTitle>
							<CardDescription className='flex items-center'>
								{training.exercises.length > 0 && (
									<CollapsibleTrigger>
										<Button
											className='flex items-center space-x-2'
											variant='ghost'
										>
											<p>
												{training.exercises[0].exercise.name}
												{training.exercises.length > 1 &&
													' + ' +
														(training.exercises.length - 1) +
														' other exercise' +
														(training.exercises.length > 2 ? 's' : '')}
											</p>
											<ChevronDown />
										</Button>
									</CollapsibleTrigger>
								)}
								<MoreDropdownMenu trainingId={training.id} />
							</CardDescription>
						</CardHeader>
						<CollapsibleContent>
							<CardContent className='px-4'>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Exercise</TableHead>
											<TableHead>Weight</TableHead>
											<TableHead>Repetitions</TableHead>
											<TableHead>Exertion (RPE)</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{training.exercises.map((exercise) => (
											<TableRow key={exercise.id}>
												<TableCell className='font-medium'>
													{exercise.exercise.name}
												</TableCell>
												<TableCell>{exercise.weight}kg</TableCell>
												<TableCell>{exercise.repetitions}</TableCell>
												<TableCell>{exercise.rpe}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</CollapsibleContent>
					</Collapsible>
				</Card>
			))}
		</div>
	);
};

export default LogPage;
