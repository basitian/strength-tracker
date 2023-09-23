'use client';

import React from 'react';
import { BookMarked, Dumbbell, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const Sidebar = () => {
	const pathname = usePathname();
	const router = useRouter();

	const routes = [
		{
			icon: Dumbbell,
			href: '/',
			label: 'Home',
		},
		{
			icon: Plus,
			href: '/training/add',
			label: 'Add',
		},
		{
			icon: BookMarked,
			href: '/log',
			label: 'Log',
		},
	];

	const onNavigate = (url: string) => {
		router.push(url);
	};

	return (
		<div className='flex flex-col h-full text-primary bg-secondary'>
			<div className='p-3 flex-1 justify-center flex'>
				<div className='space-y-2'>
					{routes.map((route) => (
						<div
							key={route.href}
							onClick={() => onNavigate(route.href)}
							className={cn(
								'text-muted-foreground text-xs flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
								pathname === route.href && 'bg-primary/10 text-primary'
							)}
						>
							<div className='flex flex-col gap-y-2 items-center flex-1'>
								<route.icon className='w-5 h-5' />
								{route.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
