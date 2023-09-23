import React from 'react';
import { Menu, Sparkles } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from '@/components/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { UserButton } from '@clerk/nextjs';

const MobileSidebar = () => {
	return (
		<Sheet>
			<SheetTrigger className='md:hidden pr-4'>
				<Menu />
			</SheetTrigger>
			<SheetContent
				side='left'
				className='p-0 bg-secondary pt-10 w-32 flex flex-col items-center justify-between'
			>
				<Sidebar />
				<div className='flex flex-col items-center space-y-2 pb-2'>
					<Separator />
					<Button size='sm' variant='premium'>
						Upgrade <Sparkles className='h-4 w-4 fill-white text-white ml-2' />
					</Button>
					<ModeToggle />
					<UserButton afterSignOutUrl='/' />
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileSidebar;
