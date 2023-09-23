'use client';

import { useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import * as z from 'zod';
import axios from 'axios';

import { Exercise, ExerciseResult, Training } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
	CalendarIcon,
	Check,
	ChevronsUpDown,
	Dumbbell,
	Plus,
	Trash2,
} from 'lucide-react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';

type TrainingFormProps = {
	initialData: (Training & { exercises: ExerciseResult[] }) | null;
	exercises: Exercise[];
};

const formSchema = z.object({
	performedAt: z
		.date({ required_error: 'Date is required' })
		.max(new Date(new Date().setHours(23, 59, 59, 999)), {
			message: 'Date cannot be in the future',
		}),
	location: z
		.string()
		.min(1, { message: 'Location cannot be empty' })
		.max(50, { message: 'Location cannot be longer than 50 characters' }),
	exercises: z.array(
		z.object({
			id: z.string().optional(),
			exerciseId: z
				.string({ required_error: 'Exercise is required' })
				.nonempty('Pick an exercise'),
			weight: z.coerce.number({ required_error: 'Weight is required' }),
			repetitions: z.coerce.number().min(0),
			rpe: z.coerce.number().min(0).max(10),
		})
	),
});

const TrainingForm = ({ initialData, exercises }: TrainingFormProps) => {
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		// @ts-ignore
		defaultValues: initialData || {
			performedAt: new Date(new Date().setHours(0, 0, 0, 0)),
			location: '',
			exercises: [{ exerciseId: '', weight: 0, repetitions: 0, rpe: 0 }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		name: 'exercises',
		control: form.control,
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			if (initialData) {
				// Update training
				await axios.patch(`/api/training/${initialData.id}`, values);
				toast({ description: 'Successfully updated training' });
			} else {
				// Create training
				await axios.post('/api/training', values);
				toast({
					title: 'Success',
					description: 'Successfully saved training',
				});
			}

			router.refresh();
			router.push('/');
		} catch (error) {
			toast({ variant: 'destructive', description: 'Something went wrong...' });
		}
	};

	return (
		<div className='h-full p-4 space-y-2 max-w-4xl mx-auto'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 pb-10'
				>
					<div className='space-y-2 w-full'>
						<div>
							<h3 className='text-lg font-medium'>
								{initialData ? 'Edit Training' : 'New Training'}
							</h3>
							<p className='text-sm text-muted-foreground'>
								Add a training to your training log
							</p>
						</div>
						<Separator className='bg-primary/90' />
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<FormField
							name='performedAt'
							control={form.control}
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													disabled={isLoading}
													variant={'outline'}
													className={cn(
														'w-full pl-3 text-left font-normal',
														!field.value && 'text-muted-foreground'
													)}
												>
													{field.value ? (
														format(field.value, 'dd.MM.yyyy')
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className='w-auto p-0' align='start'>
											<Calendar
												mode='single'
												selected={field.value}
												onSelect={field.onChange}
												disabled={isLoading}
												initialFocus
											/>
										</PopoverContent>
									</Popover>

									<FormDescription>When did you train?</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='location'
							control={form.control}
							render={({ field }) => (
								<FormItem className='col-span-2 md:col-span-1'>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder='Central Park'
											{...field}
										/>
									</FormControl>
									<FormDescription>Where did you train?</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='space-y-2 w-full'>
						<div className='flex justify-between items-center w-full'>
							<div>
								<h3 className='text-lg font-medium'>Exercises</h3>
								<p className='text-sm text-muted-foreground'>
									Your trainings exercises, weights and reps
								</p>
							</div>
							<Button
								onClick={() =>
									append({ exerciseId: '', weight: 0, repetitions: 0, rpe: 0 })
								}
								size='sm'
								disabled={isLoading}
								variant='ghost'
								type='button'
							>
								<Plus className='w-4 h-4 mr-2' />
								Add Exercise
							</Button>
						</div>
						<Separator className='bg-primary/90' />
					</div>
					{fields.map((field, index) => (
						<div className='flex justify-between space-x-2' key={field.id}>
							<FormField
								name={`exercises.${index}.exerciseId`}
								render={({ field }) => (
									<FormItem className='col-span-2 md:col-span-1'>
										<FormLabel>Exercise</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														disabled={isLoading}
														variant='outline'
														role='combobox'
														className={cn(
															'w-full pl-3 text-left font-normal',
															!field.value && 'text-muted-foreground'
														)}
													>
														{field.value
															? exercises.find(
																	(exercise) => exercise.id === field.value
															  )?.name
															: 'Select exercise'}
														<ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className='w-full p-0' side='right'>
												<Command>
													<CommandInput placeholder='Search exercise...' />
													<CommandEmpty>No exercise found.</CommandEmpty>
													<CommandGroup>
														{exercises.map((exercise) => (
															<CommandItem
																value={exercise.name}
																key={exercise.id}
																onSelect={() => {
																	form.setValue(
																		`exercises.${index}.exerciseId`,
																		exercise.id
																	);
																}}
															>
																<Check
																	className={cn(
																		'mr-2 h-4 w-4',
																		exercise.id === field.value
																			? 'opacity-100'
																			: 'opacity-0'
																	)}
																/>
																{exercise.name}
															</CommandItem>
														))}
													</CommandGroup>
												</Command>
											</PopoverContent>
										</Popover>
										<FormDescription>
											Which exercise did you do?
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name={`exercises.${index}.weight`}
								render={({ field }) => (
									<FormItem className='col-span-2 md:col-span-1'>
										<FormLabel>Weight (kg)</FormLabel>
										<FormControl>
											<Input
												type='number'
												min={0}
												disabled={isLoading}
												{...field}
											/>
										</FormControl>
										<FormDescription>
											How much weight did you lift?
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name={`exercises.${index}.repetitions`}
								render={({ field }) => (
									<FormItem className='col-span-2 md:col-span-1'>
										<FormLabel>Repetitions</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												min={0}
												type='number'
												{...field}
											/>
										</FormControl>
										<FormDescription>How many reps did you do?</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name={`exercises.${index}.rpe`}
								render={({ field }) => (
									<FormItem className='col-span-2 md:col-span-1'>
										<FormLabel>Exertion (RPE)</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												min={0}
												max={10}
												type='number'
												{...field}
											/>
										</FormControl>
										<FormDescription>
											How much exertion did you feel?
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								onClick={() => remove(index)}
								size='icon'
								disabled={isLoading}
								className='self-center'
							>
								<Trash2 className='w-4 h-4' />
							</Button>
						</div>
					))}
					<div className='w-full flex justify-center'>
						<Button type='submit' size='lg' disabled={isLoading}>
							<Dumbbell className='w-4 h-4 mr-2' />
							{initialData ? 'Edit training' : 'Add training'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default TrainingForm;
