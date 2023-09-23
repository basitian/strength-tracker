'use client';

import Link from 'next/link';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pen, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type MoreDropdownMenuProps = {
	trainingId: string;
};

const MoreDropdownMenu = ({ trainingId }: MoreDropdownMenuProps) => {
	const router = useRouter();

	const deleteTraining = async (id: string) => {
		try {
			// Delete training
			await axios.delete(`/api/training/${id}`);
			toast({
				title: 'Success',
				description: 'Successfully deleted training',
			});

			router.refresh();
		} catch (error) {
			toast({ variant: 'destructive', description: 'Something went wrong...' });
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
				>
					<MoreHorizontal className='h-4 w-4' />
					<span className='sr-only'>Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[140px]'>
				<DropdownMenuItem asChild>
					<Link href={`/training/${trainingId}`}>
						<Pen className='w-4 h-4 mr-4' />
						Edit
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => deleteTraining(trainingId)}>
					<Trash2 className='w-4 h-4 mr-4' />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default MoreDropdownMenu;
