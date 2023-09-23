'use client';

import { Sparkles } from 'lucide-react';
import { Orbitron } from 'next/font/google';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import MobileSidebar from '@/components/mobile-sidebar';

const font = Orbitron({ weight: '600', subsets: ['latin'] });

export const Navbar = () => {
	return (
		<div className='fixed w-full h-16 z-50 flex justify-between items-center py-2 px-4 border-b  bg-secondary'>
			<div className='flex items-center'>
				<MobileSidebar />
				<Link href='/'>
					<h1
						className={cn(
							'text-xl md:text-3xl font-bold text-primary',
							font.className
						)}
					>
						Strength Tracker
					</h1>
				</Link>
			</div>
			<div className='hidden md:flex items-center gap-x-3'>
				{/* <Button size='sm' variant='premium'>
					Upgrade <Sparkles className='h-4 w-4 fill-white text-white ml-2' />
				</Button> */}
				<ModeToggle />
				<UserButton afterSignOutUrl='/' />
			</div>
		</div>
	);
};
