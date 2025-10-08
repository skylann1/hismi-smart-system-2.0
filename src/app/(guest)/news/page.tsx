"use client";

import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

interface BadgeInfo {
  text: string;
  bgColorClass: string;
  textColorClass?: string;
}

interface MainFeaturedItemData {
  id: string;
  imageUrl: string;
  badge: BadgeInfo;
  title: string;
  description: string;
  date?: string;
}

interface SideFeaturedItemData {
  id: string;
  imageUrl: string;
  badge: BadgeInfo;
  title: string;
}

interface LatestNewsItemData {
  id: string;
  imageUrl: string;
  badge: BadgeInfo;
  title: string;
  metadata: string;
}

const MainFeaturedCard: React.FC<MainFeaturedItemData> = ({ id, imageUrl, badge, title, description, date }) => {
  return (
    <div className="relative col-span-1 lg:col-span-2 h-[400px] md:h-[450px] rounded-xl overflow-hidden shadow-2xl group">
      <Link href={`/news/${id}`} legacyBehavior>
        <a className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
            {date && (
              <span className='text-xs text-gray-300 mb-1.5'>{date}</span>
            )}
            <span
              className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm ${badge.bgColorClass} ${badge.textColorClass || 'text-white'}`}
            >
              {badge.text}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
              {title}
            </h2>
            <p className="text-sm text-gray-200 hidden md:block leading-relaxed">
              {description}
            </p>
          </div>
        </a>
      </Link>
    </div>
  );
};

const SideFeaturedCard: React.FC<SideFeaturedItemData> = ({ id, imageUrl, badge, title }) => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-xl group h-full">
      <Link href={`/news/${id}`} legacyBehavior>
        <a className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-black/25 flex flex-col justify-between p-4 md:p-5">
            <div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm ${badge.bgColorClass} ${badge.textColorClass || 'text-white'}`}
              >
                {badge.text}
              </span>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-semibold text-white leading-snug group-hover:text-blue-300 transition-colors duration-200">
                {title}
              </h3>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

const NewsGridCard: React.FC<LatestNewsItemData> = ({ id, imageUrl, badge, title, metadata }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg group flex flex-col h-full border border-gray-200">
       <Link href={`/news/${id}`} legacyBehavior>
        <a className="block group flex flex-col h-full">
          <div className="relative w-full h-40 md:h-44">
            <Image
              src={imageUrl}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md mb-2 self-start shadow-sm ${badge.bgColorClass} ${badge.textColorClass || 'text-white'}`}
            >
              {badge.text}
            </span>
            <h4 className="text-sm md:text-md font-semibold text-slate-700 mb-1 leading-snug flex-grow group-hover:text-blue-600 transition-colors duration-200">
              {title}
            </h4>
            <p className="text-xs text-gray-500 mt-auto pt-1">{metadata}</p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default function NewsHomePage() {
  const mainFeatured: MainFeaturedItemData = {
    id: 'marvel-box-office',
    imageUrl: '/assets/undraw/news-main.jpg',
    badge: { text: 'Entertainment', bgColorClass: 'bg-purple-600' },
    title: 'New Marvel Movie Breaks Box Office Records',
    description: 'The latest Marvel blockbuster has taken the world by storm, shattering box office records in its opening weekend.',
    date: 'March 8, 2025',
  };

  const sideFeatured: SideFeaturedItemData[] = [
    {
      id: 'un-climate',
      imageUrl: '/assets/undraw/news-main.jpg',
      badge: { text: 'Politics', bgColorClass: 'bg-sky-600' },
      title: 'United Nations Announces Global Climate Agreement',
    },
    {
      id: 'lebron-scorer',
      imageUrl: '/assets/placeholder/lebron-james.jpg',
      badge: { text: 'Sports', bgColorClass: 'bg-orange-500' },
      title: 'LeBron James Becomes All-Time Leading Scorer in NBA History',
    },
  ];

  const latestNews: LatestNewsItemData[] = [
    {
      id: 'billy-joel',
      imageUrl: '/assets/undraw/news-main.jpg',
      badge: { text: 'Music', bgColorClass: 'bg-pink-500' },
      title: 'Billy Joel Postpones Concerts Due to Medical Condition',
      metadata: 'Variety • March 12, 2025',
    },
    {
      id: 'ai-boxing',
      imageUrl: '/assets/placeholder/ai-boxing.jpg',
      badge: { text: 'Sports', bgColorClass: 'bg-red-600' },
      title: 'AI Enhances Viewing Experience of Boxing Day Test Match',
      metadata: 'ESPN • March 12, 2025',
    },
    {
      id: 'tech-ai-ux',
      imageUrl: '/assets/placeholder/tech-ai-ux.jpg',
      badge: { text: 'Technology', bgColorClass: 'bg-teal-500' },
      title: 'Tech Giants Integrate AI to Enhance User Experience',
      metadata: 'TechCrunch • March 11, 2025',
    },
    {
      id: 'california-storms',
      imageUrl: '/assets/placeholder/california-storms.jpg',
      badge: { text: 'Nature', bgColorClass: 'bg-green-600' },
      title: 'California Faces Severe Storms and Evacuations',
      metadata: 'Reuters • March 11, 2025',
    },
     {
      id: 'ioc-manifestos',
      imageUrl: '/assets/placeholder/ioc.jpg',
      badge: { text: 'Sports', bgColorClass: 'bg-blue-700' },
      title: 'IOC Reveals Manifestos of Presidential Candidates',
      metadata: 'Olympics News • March 10, 2025',
    },
    {
      id: 'apple-iphone-ai',
      imageUrl: '/assets/placeholder/apple-iphone.jpg',
      badge: { text: 'Technology', bgColorClass: 'bg-gray-500' },
      title: 'Apple Unveils AI-Powered iPhone 18',
      metadata: 'Apple Insider • March 10, 2025',
    },
    {
      id: 'billie-eilish-album',
      imageUrl: '/assets/placeholder/billie-eilish.jpg',
      badge: { text: 'Entertainment', bgColorClass: 'bg-emerald-500' },
      title: 'Billie Eilish Announces New Album Release Date',
      metadata: 'Billboard • March 9, 2025',
    },
    {
      id: 'messi-fifa-award',
      imageUrl: '/assets/placeholder/messi.jpg',
      badge: { text: 'Sports', bgColorClass: 'bg-indigo-600' },
      title: 'Messi Wins FIFA Best Player Award for 2024',
      metadata: 'FIFA Official • March 9, 2025',
    },
  ];

  return (
    <div className={`min-h-screen bg-white text-slate-700 ${inter.className} py-8 md:py-12`}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section aria-labelledby="featured-news-title" className="mb-10 md:mb-16">
          <h2 id="featured-news-title" className="sr-only">Featured News</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <MainFeaturedCard {...mainFeatured} />
            <div className="col-span-1 lg:col-span-1 flex flex-col gap-6 md:gap-8">
              {sideFeatured.map((item) => (
                <SideFeaturedCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="latest-news-title">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 id="latest-news-title" className="text-2xl md:text-3xl font-bold text-slate-800">
              Latest News
            </h2>
            <Link href="/all-news" legacyBehavior>
              <a className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                View more &rarr;
              </a>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {latestNews.map((item) => (
              <NewsGridCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}