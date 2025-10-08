import type { UserType } from "@/types";

interface PoinDivisi {
  title: string;
  description: string;
}

interface DivisiSettingsType {
  nama?: string;
  mainTitle: string;
  secondaryTitle: string;
  mainDescription: string;
  secondaryDescription: string;
  poinDivisi: PoinDivisi[];
  images: {
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    image5: string;
  };
}

type UserSafe = Omit<UserType, "password">;

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillAlert } from "react-icons/ai";
import { BsImageAlt } from "react-icons/bs";
import { inter } from "@/app/fonts"; // Assuming this is defined correctly

const TeamCarousel = ({ members }: { members: UserSafe[] | null }) => {
  if (!members || members.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Team members could not be loaded.
      </div>
    );
  }

  return (
    <div className="relative w-full mt-10">
      <div
        className="w-full flex flex-nowrap justify-start items-center gap-6 overflow-x-auto overflow-y-hidden px-4 touch-pan-x snap-x snap-mandatory custom-scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {members.map((member) => (
          <div
            key={member.id}
            className="w-60 flex-shrink-0 overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 relative group snap-start"
          >
            <div className="w-full h-[270px]">
              <Image
                width={1000}
                height={1000}
                src={member.imageUrl}
                alt={member.nama}
                className="object-cover object-bottom w-full h-full grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] p-2 bg-white/80 bg-opacity-90 backdrop-blur-sm rounded-sm">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {member.nama}
              </h3>
              <p className="opacity-70 text-sm">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default async function DivisionPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const fetchDivisi = async (
    slug: string
  ): Promise<DivisiSettingsType | null> => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/divisi/${slug}`;
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) {
        console.error(`Failed to fetch data for slug: ${slug}`);
        return null;
      }
      const result = await res.json();
      return result.data as DivisiSettingsType;
    } catch (err) {
      console.error("Error during fetch for Divisi:", err);
      return null;
    }
  };

  const fetchTeam = async (slug: string): Promise<UserSafe[] | null> => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/anggota/${slug}`;
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) {
        console.error(`Failed to fetch data for slug: ${slug}`);
        return null;
      }
      const result = await res.json();
      const mockTeam = result.data as UserSafe[];
      return mockTeam;
    } catch (err) {
      console.error("Error during fetch for Team:", err);
      return null;
    }
  };

  const initialDivisi: DivisiSettingsType = {
    mainTitle: "Loading Title...",
    secondaryTitle: "Loading Secondary Title...",
    mainDescription: "Loading description...",
    secondaryDescription: "Loading description...",
    poinDivisi: [],
    images: { image1: "", image2: "", image3: "", image4: "", image5: "" },
    nama: "",
  };

  const [divisiData, teamData] = await Promise.all([
    fetchDivisi(slug),
    fetchTeam(slug),
  ]);

  const divisi = divisiData || initialDivisi;
  const loading = !divisiData;

  return (
    <>
      <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center md:px-12 px-6 max-w-7xl py-8">
        {/* section1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="mb-2 text-sm font-bold text-primary tracking-wide bg-indigo-100 px-3 py-2 rounded-full uppercase">
              Divisi {slug}
            </span>
            {loading ? (
              <>
                <div className="w-full bg-gray-200 animate-pulse h-14 rounded-xl"></div>
                <div className="w-full bg-gray-200 animate-pulse h-14 rounded-xl mt-1"></div>
                <div className="w-full bg-gray-200 animate-pulse h-6 rounded-xl mt-6"></div>
              </>
            ) : (
              <>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  {divisi.mainTitle}
                </h1>
                <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-lg">
                  {divisi.mainDescription}
                </p>
              </>
            )}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              <Link
                href="#live-demo"
                className="w-full sm:w-auto px-6 py-3 font-semibold text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
              >
                Proker <span>&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="w-full h-full hidden lg:grid grid-cols-3 gap-28 relative ml-6">
            {/* Background circles */}
            <div className="w-[550px] h-[550px] rounded-full bg-primary opacity-15 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-[450px] h-[450px] rounded-full bg-primary opacity-25 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-[350px] h-[350px] rounded-full bg-primary opacity-35 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-[250px] h-[250px] rounded-full bg-primary opacity-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-[150px] h-[150px] rounded-full bg-primary opacity-55 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

            {/* Image Grid */}
            <div className="space-y-9 pt-20 w-48 h-fit z-10">
              {loading ? (
                <>
                  <div className="w-full h-72 bg-gray-200 animate-pulse rounded-2xl flex justify-center items-center">
                    <BsImageAlt className="text-3xl text-gray-400" />
                  </div>
                  <div className="w-full h-72 bg-gray-200 animate-pulse rounded-2xl flex justify-center items-center">
                    <BsImageAlt className="text-3xl text-gray-400" />
                  </div>
                </>
              ) : (
                <>
                  {divisi.images.image1 && (
                    <Image
                      width={1000}
                      height={1000}
                      src={divisi.images.image1}
                      alt="Division Image 1"
                      className="w-full h-72 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-black/40 opacity-90"
                    />
                  )}
                  {divisi.images.image2 && (
                    <Image
                      width={1000}
                      height={1000}
                      src={divisi.images.image2}
                      alt="Division Image 2"
                      className="w-full h-72 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-black/40 opacity-90"
                    />
                  )}
                </>
              )}
            </div>
            <div className="space-y-9 h-fit w-48 z-10">
              {loading ? (
                <>
                  <div className="w-full h-72 bg-gray-200 animate-pulse rounded-2xl flex justify-center items-center">
                    <BsImageAlt className="text-3xl text-gray-400" />
                  </div>
                  <div className="w-full h-72 bg-gray-200 animate-pulse rounded-2xl flex justify-center items-center">
                    <BsImageAlt className="text-3xl text-gray-400" />
                  </div>
                </>
              ) : (
                <>
                  {divisi.images.image3 && (
                    <Image
                      width={1000}
                      height={1000}
                      src={divisi.images.image3}
                      alt="Division Image 3"
                      className="w-full h-72 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-black/40 opacity-90"
                    />
                  )}
                  {divisi.images.image4 && (
                    <Image
                      width={1000}
                      height={1000}
                      src={divisi.images.image4}
                      alt="Division Image 4"
                      className="w-full h-72 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-black/40 opacity-90"
                    />
                  )}
                </>
              )}
            </div>
            <div className="space-y-9 h-fit w-48 pt-36 z-10">
              {loading ? (
                <div className="w-full h-72 bg-gray-200 animate-pulse rounded-2xl flex justify-center items-center">
                  <BsImageAlt className="text-3xl text-gray-400" />
                </div>
              ) : (
                <>
                  {divisi.images.image5 && (
                    <Image
                      width={1000}
                      height={1000}
                      src={divisi.images.image5}
                      alt="Division Image 5"
                      className="w-full h-72 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-black/40 opacity-90"
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="lg:hidden grid grid-cols-2 gap-4">
            {divisi.images.image2 && (
              <Image
                width={1000}
                height={1000}
                src={divisi.images.image2}
                alt="Team collaboration"
                className="w-full h-72 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-black/40 opacity-90"
              />
            )}
            {divisi.images.image3 && (
              <Image
                width={1000}
                height={1000}
                src={divisi.images.image3}
                alt="Team collaboration"
                className="w-full h-72 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-black/40 opacity-90"
              />
            )}
          </div>
        </div>

        {/* section2 */}
        <div className="w-full mt-20 md:mt-40">
          <div className="flex flex-col justify-start gap-2 max-w-3xl">
            {loading ? (
              <div className="w-full h-8 bg-gray-200 animate-pulse rounded-lg"></div>
            ) : (
              <h1 className="text-2xl md:text-4xl text-primary font-bold">
                {divisi.secondaryTitle}
              </h1>
            )}
            {loading ? (
              <>
                <div className="w-full h-4 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="w-[80%] h-4 bg-gray-200 animate-pulse rounded-lg"></div>
              </>
            ) : (
              <span className="text-gray-600 text-base font-normal">
                {divisi.secondaryDescription}
              </span>
            )}
          </div>
          <div className="mt-16 flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full md:w-[33%] flex flex-col justify-between h-72"
                  >
                    <div className="flex flex-col animate-pulse">
                      <span className="w-10 h-10 bg-gray-300 rounded-lg mb-2"></span>
                      <div className="h-4 w-2/3 bg-gray-300 rounded mt-4"></div>
                      <div className="h-3 w-full bg-gray-300 rounded mt-2"></div>
                      <div className="h-3 w-5/6 bg-gray-300 rounded mt-2"></div>
                      <div className="h-3 w-4/6 bg-gray-300 rounded mt-2"></div>
                    </div>
                  </div>
                ))
              : divisi.poinDivisi.map((poin, index) => (
                  <div
                    key={index}
                    className="w-full md:w-[33%] flex flex-col justify-between h-72 "
                  >
                    <div className="flex flex-col">
                      <span className="text-white text-lg font-semibold w-10 h-10 bg-primary flex flex-col items-center justify-center rounded-lg mb-2">
                        <AiFillAlert className="text-xl" />
                      </span>
                      <h3 className="font-semibold text-base text-black/95 mt-4">
                        {poin.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2 font-normal">
                        {poin.description}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* section 3: Team Carousel */}
        <div className="mt-20 md:mt-40 w-full flex items-center flex-col">
          <div className="flex flex-col gap-2 justify-center items-center max-w-3xl relative">
            <h1
              className={`${inter.className} text-2xl md:text-4xl font-bold text-center`}
            >
              Kami memiliki tim khusus yang sepenuhnya didedikasikan untuk
              menangani divisi ini
            </h1>
            <span className="opacity-70 text-sm md:text-base font-normal text-center md:mt-2 mt-4">
              terbentuk dari orang-orang profesional yang fokus pada bidang ini.
            </span>
          </div>
          {/* The server-rendered TeamCarousel is called here, passing the fetched team data.
            It's a "dumb" component that just displays the data it's given.
          */}
          <TeamCarousel members={teamData} />
        </div>

        {/* section 4 */}
        <div className="mt-20 md:mt-40 w-full">
          <div className="w-full flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <h1 className="md:text-4xl text-2xl font-bold">
                Proker Beserta Kegiatan
              </h1>
              <span className="text-sm md:text-base font-normal opacity-80 mt-3 text-center">
                Proker beserta kegiatan divisi pendidikan satu priode ini, up to
                update disetiap priodenya.
              </span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-12 mt-12 justify-center items-start">
              <CardProkerOrKegiatan />
              <CardProkerOrKegiatan />
              <CardProkerOrKegiatan />
            </div>
          </div>
        </div>

        {/* section 5 */}
        <div className="w-full mt-20 md:mt-40 mb-20">
          <div className="w-full py-12 md:py-28 flex flex-col justify-center items-center bg-slate-900 rounded-lg text-white md:px-6 px-6">
            <div className="flex flex-col justify-center items-center">
              <h1
                className={`${inter.className} text-2xl md:text-4xl font-semibold`}
              >
                Ringkasan Divisi
              </h1>
              <span className="text-sm font-normal opacity-85 mt-4 text-center">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Itaque, rem.
              </span>
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-between items-center mt-16 gap-y-0.5">
              <div className="w-full lg:w-[49.93%] flex max-sm:flex-col flex-row items-center justify-between gap-0.5">
                <div className="w-full md:w-[49.9%] bg-slate-800 flex justify-center items-center flex-col rounded-t-lg md:rounded-none md:rounded-l-lg px-4 h-32 max-lg:rounded-tl-lg max-lg:rounded-none">
                  <span className="text-3xl font-semibold">10</span>
                  <span className="text-xs font-medium opacity-80 mt-0.5 text-center">
                    Kegiatan yang sudah dilakukan
                  </span>
                </div>
                <div className="w-full md:w-[49.9%] bg-slate-800 flex justify-center items-center flex-col h-32 max-lg:rounded-tr-lg max-lg:rounded-none">
                  <span className="text-3xl font-semibold">1</span>
                  <span className="text-xs font-medium opacity-80 mt-0.5 text-center px-4">
                    Kegiatan yang akan datang / terjadwal
                  </span>
                </div>
              </div>
              <div className="w-full lg:w-[49.93%] flex max-sm:flex-col flex-row items-center justify-between gap-0.5">
                <div className="w-full md:w-[49.9%] bg-slate-800 flex justify-center items-center flex-col h-32 max-lg:rounded-bl-lg max-lg:rounded-none">
                  <span className="text-3xl font-semibold">5</span>
                  <span className="text-xs font-medium opacity-80 mt-0.5 text-center">
                    Total Proker
                  </span>
                </div>
                <div className="w-full md:w-[49.9%] bg-slate-800 flex justify-center items-center flex-col h-32 rounded-b-lg md:rounded-none md:rounded-r-lg px-4 max-lg:rounded-br-lg max-lg:rounded-none">
                  <span className="text-3xl font-semibold">12</span>
                  <span className="text-xs font-medium opacity-80 mt-0.5 text-center px-4">
                    Total Anggota
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const CardProkerOrKegiatan = () => {
  return (
    <div className="w-80">
      <div className="h-96 flex flex-col justify-between">
        <div className="w-full h-48 rounded-xl overflow-hidden">
          <Image
            width={1000}
            height={1000}
            src="/assets/static-img/pendidikan-background.JPG"
            alt="Proker Image"
            className="object-cover w-full h-full object-center"
          />
        </div>
        <div className="w-full flex flex-col">
          <div className="flex gap-6">
            <span className="text-xs font-medium opacity-80">Mar 16, 2025</span>
            <span className="text-xs font-semibold">Kegiatan</span>
          </div>
          <Link
            href={"/"}
            className="text-lg font-semibold mt-4 hover:opacity-80 line-clamp-2"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Link>
          <p className="line-clamp-3 text-sm opacity-80 mt-3 font-normal">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cupiditate
            corporis aperiam nam nihil doloremque. Ipsum aliquam repellendus
            quaerat saepe. Illum quis est voluptas obcaecati accusamus officia
            maiores quia quisquam! Aliquid ullam earum accusamus ipsa officia?
          </p>
        </div>
      </div>
      <div className="w-full flex gap-4 mt-8">
        <div className="w-8 h-8 rounded-full">
          <Image
            src={"/assets/static-img/logo.png"}
            alt="Logo"
            width={1000}
            height={1000}
            className="w-full h-full object-center object-cover"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold">HIMSI KALIABANG</span>
          <span className="text-xs opacity-80 font-normal">Div Pendidikan</span>
        </div>
      </div>
    </div>
  );
};
