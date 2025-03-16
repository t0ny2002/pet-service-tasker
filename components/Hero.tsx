import { Routes } from '@/lib/routes'
import Link from 'next/link'
import Image from 'next/image'
import SkillIcon from './SkillIcon'
import { categories } from '@/lib/constants'

export default async function Hero() {
	return (
		<main className='flex flex-col lg:flex-row p-6 gap-6 lg:h-[700px] mx-auto lg:max-w-7xl'>
			<section className='flex flex-col lg:w-3/4 sm:flex-row justify-between gap-4 bg-indigo-500 font-bold p-8 rounded-3xl w-[90%] mx-auto'>
				<div className='flex flex-col sm:w-1/2 gap-4'>
					<div className='flex flex-col gap-2'>
						<h1 className='max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white text-white'>
							PetTasker: <br />
							Effortless Pet Care
						</h1>
						<p className='max-w-2xl font-light text-white md:text-lg lg:text-xl'>
							Meet PetTasker, your go-to for trusted, efficient
							pet care. Quickly match with vetted service
							providers, manage tasks, and customize services—from
							grooming to training—all in one platform.
						</p>
					</div>
					<div className='flex flex-col gap-2'>
						<h2 className='text-xl text-white'>
							Looking for someone to care for your pet or to earn
							more money?
						</h2>
						<Link
							href={`${Routes.signup}`}
							className='flex justify-center md:w-fit text-white bg-neutral-900 px-4 py-1 rounded-lg border-white hover:border-4 border-2'
						>
							Register now
						</Link>
					</div>
				</div>
				<Image
					src='/dogs.png'
					alt='dog'
					width={500}
					height={300}
					className='rounded-3xl object-cover hidden sm:block max-w-lg sm:w-1/2 aspect-square'
				/>
			</section>
			<section className='flex flex-col gap-6 lg:h-full lg:w-1/4 bg-slate-200 text-indigo-500 font-bold p-8 rounded-3xl w-[90%] mx-auto'>
				<h1 className='mx-auto w-fit col-span-full text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl'>
					Services Offered
				</h1>
				<div className='flex flex-wrap gap-2 justify-between'>
					{categories.map((skill) => (
						<div
							className='flex flex-col mx-auto items-center'
							key={skill}
						>
							<div className='text-4xl'>
								<SkillIcon skill={skill} />
							</div>
							<p>{skill}</p>
						</div>
					))}
				</div>
			</section>
		</main>
	)
}
