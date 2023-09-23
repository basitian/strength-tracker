'use client';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Exercise } from '@prisma/client';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

const ExerciseSelector = ({ exercises }: { exercises: Exercise[] }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedExercise = searchParams.get('exercise');

	const from = searchParams.get('from');
	const to = searchParams.get('to');

	const onSelect = (exercise: string) => {
		const query = {
			exercise: exercise,
			from,
			to,
		};

		const url = qs.stringifyUrl(
			{ url: window.location.href, query },
			{ skipEmptyString: true, skipNull: true }
		);

		router.push(url);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					className='w-52 pl-3 text-left font-normal'
				>
					{selectedExercise
						? exercises.find((exercise) => exercise.id === selectedExercise)
								?.name
						: 'Select exercise'}
					<ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
				</Button>
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
								onSelect={() => onSelect(exercise.id)}
							>
								<Check
									className={cn(
										'mr-2 h-4 w-4',
										exercise.id === selectedExercise
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
	);
};

export default ExerciseSelector;
