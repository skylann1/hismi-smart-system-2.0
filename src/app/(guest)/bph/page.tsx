import Image from "next/image";
// import { inter } from "@/app/fonts";
import Link from "next/link";
import { AiFillAlert } from "react-icons/ai";
import { FcTreeStructure } from "react-icons/fc";
import { FaHandsHelping } from "react-icons/fa";

export default async function Page() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/bph`;

  const fetchBph = async () => {
    try {
      const fetchBph = await fetch(url, { next: { revalidate: 86400 } });
      if (!fetchBph) {
        console.error(`Failed to fetch data for bph`);
        return null;
      }

      const result = await fetchBph.json();
      const { images } = result.data;
      return images;
    } catch {
      console.error("Opps error when you try catch data BPH");
      return null;
    }
  };

  // const data = await fetchBph || undefined;
  const data = await fetchBph();
  console.log(data);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center max-w-7xl">
      {/* section 1 */}
      <div className="w-full h-screen relative bg-transparent mb-20">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="/assets/static-img/background-gradient2.jpeg"
            alt="BPH background"
            fill
            className="object-cover object-center w-full h-full opacity-100"
          />
          <div className="bg-gradient-to-b from-white/100 via-white/20 to-white/100 absolute w-full h-full z-10"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-16 items-center max-w-7xl mx-auto h-full w-full px-6 lg:px-12 relative z-20">
          {/* left content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-30">
            <span className="mb-2 text-sm font-bold text-primary uppercase tracking-wide bg-indigo-100 px-3 py-2 rounded-full">
              Badan Pengurus Harian
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Dari Informasi ke Inovasi, Bersama Kita Bisa
            </h1>
            <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-lg">
              Kami ada untuk bikin perjalanan kuliah bukan cuma soal nilai, tapi
              juga pengalaman yang seru dan bermakna.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
              <Link
                href="#live-demo"
                className="w-full sm:w-auto px-6 py-3 font-semibold text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
              >
                Start <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* right content */}
          <div className="hidden lg:flex w-full justify-center items-center z-30">
            <div className="w-4/5 relative aspect-[1.3/1] ">
              <Image
                src="/assets/undraw/remote-meeting.svg"
                alt="BPH illustration"
                fill
                className="object-contain object-center"
              />
            </div>
          </div>

          {/* image mobile POV */}
          <div className="lg:hidden grid grid-cols-2 gap-4">
            <Image
              width={1000}
              height={1000}
              src="/assets/static-img/kominfo-background.JPG"
              alt="Man on a video call"
              className="w-full h-72 object-cover rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
            <Image
              width={1000}
              height={1000}
              src="/assets/static-img/kominfo-background.JPG"
              alt="Man on a video call"
              className="w-full h-72 object-cover rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* section 2 */}
      <div className="w-full mb-20">
        <div className="w-full flex flex-col gap-10 px-6 lg:px-12">
          <div className="flex flex-col lg:max-w-3/5 w-full ">
            <div className="flex flex-col mb-4">
              <span className="text-sm md:text-sm font-semibold text-indigo-600 mb-1 lg:mb-0">
                HIMSI UBSI Kaliabang
              </span>
              <h2 className="text-4xl font-bold">Badan Pengurus Harian</h2>
            </div>
            <p className="text-lg font-normal opacity-95">
              Badan Pengurus Harian (BPH) adalah struktur inti dari Himpunan
              Mahasiswa Sistem Informasi (HIMSI) UBSI cabang Kaliabang. BPH
              berperan sebagai penggerak utama organisasi dalam mengatur arah,
              strategi, serta memastikan seluruh program kerja dapat berjalan
              dengan baik.
            </p>
          </div>

          <div className="flex gap-y-6 flex-col lg:flex-row-reverse">
            <div className="w-full lg:w-2/5 border-l-[1.5px] border-indigo-600 flex flex-col lg:px-6 pl-6 gap-6 h-fit py-1">
              <p className="text-lg lg:text-xl font-semibold">
                &quot;Kami percaya HIMSI hadir sebagai wadah untuk mengembangkan
                potensi mahasiswa, mempererat kebersamaan, dan berkontribusi
                nyata bagi kampus maupun masyarakat.&quot;
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 p-2 relative rounded-full overflow-hidden bg-slate-200">
                  <Image
                    src="/assets/static-img/isSay.png"
                    alt="BPH background"
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <span className="flex flex-col">
                  <span className="text-base font-semibold">Ketua Umum</span>
                  <span className="text-sm font-normal opacity-90">
                    @IsnanAdam
                  </span>
                </span>
              </div>
            </div>

            <div className="w-full lg:w-3/5 lg:pr-10">
              <p className="text-base opacity-75">
                HIMSI Kaliabang memiliki empat divisi utama, yaitu Pendidikan,
                Penelitian dan Pengembangan (Litbang), Komunikasi dan Informasi
                (Kominfo), serta Rekrutmen dan Sumber Daya Mahasiswa (RSDM).
                Keempat divisi ini bekerja sama di bawah koordinasi BPH untuk
                mendukung visi dan misi organisasi.
              </p>
              <ul className="flex flex-col text-base my-8 gap-8">
                <li className="flex items-start gap-3">
                  <FcTreeStructure className="text-indigo-600 mt-1 w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-black">Struktur BPH</p>
                    <p className="opacity-80">
                      BPH terdiri dari Ketua dan Wakil Ketua, Sekretaris 1 dan
                      Sekretaris 2, serta Bendahara 1 dan Bendahara 2. Struktur
                      ini dibuat agar kepengurusan lebih terarah dan setiap
                      bidang memiliki tanggung jawab yang jelas.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <AiFillAlert className="text-indigo-600 mt-1 w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-black">Peran Utama</p>
                    <p className="opacity-80">
                      BPH berperan sebagai pusat koordinasi seluruh kegiatan
                      HIMSI, mulai dari perencanaan, pengawasan, hingga
                      evaluasi. Dengan adanya BPH, diharapkan HIMSI mampu
                      menjaga kesinambungan organisasi secara profesional.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <FaHandsHelping className="text-indigo-600 mt-1 w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-black">
                      Kolaborasi Divisi
                    </p>
                    <p className="opacity-80">
                      Setiap divisi HIMSI bekerja dengan arahan BPH agar program
                      kerja dapat saling mendukung. Kolaborasi ini penting untuk
                      menciptakan kegiatan yang bermanfaat bagi mahasiswa Sistem
                      Informasi dan lingkungan sekitar.
                    </p>
                  </div>
                </li>
              </ul>
              <p className="text-base opacity-75">
                Dengan struktur dan peran yang jelas, BPH HIMSI Kaliabang hadir
                untuk menjadi motor penggerak organisasi sekaligus wadah
                pembelajaran dan pengembangan diri bagi seluruh pengurus maupun
                anggota.
              </p>
            </div>
          </div>

          <div className="flex flex-col mt-2 w-full lg:pr-10">
            <h2 className="text-xl font-semibold text-black mb-4">
              Visi & Misi BPH HIMSI
            </h2>
            <p className="text-base opacity-75 lg:w-3/5">
              Visi BPH HIMSI adalah menjadikan organisasi yang solid, aktif, dan
              berprestasi dalam bidang akademik maupun non-akademik. Misi kami
              adalah memperkuat solidaritas, mengembangkan potensi mahasiswa,
              serta melaksanakan program kerja yang berdampak positif bagi
              kampus dan masyarakat.
            </p>
          </div>
        </div>
      </div>

      {/* section 3 */}
      <div className="w-full mb-28">
        <div className="w-full flex gap-12 items-start px-6 lg:px-12">
          <div className="flex flex-col gap-4 lg:w-[45%]">
            <h2 className="text-4xl lg:text-5xl font-bold flex flex-row items-center">
              BPH Preview{" "}
            </h2>
            <span className="text-base md:text-lg font-normal opacity-95">
              Badan Pengurus Harian (BPH) HIMSI UBSI Kaliabang adalah inti dari
              struktur organisasi yang berperan penting dalam mengoordinasikan
              seluruh kegiatan himpunan. BPH memastikan jalannya program kerja
              berjalan lancar serta menjadi penghubung antar divisi.
            </span>
            <p className="text-sm md:text-base opacity-75">
              Dalam BPH terdapat Ketua dan Wakil Ketua yang memimpin jalannya
              organisasi, Sekretaris 1 dan 2 yang bertugas mengelola
              administrasi, serta Bendahara 1 dan 2 yang mengatur keuangan
              organisasi. Selain itu, HIMSI juga memiliki 4 divisi utama yaitu
              Pendidikan, Litbang, Kominfo, dan RSDM, yang masing-masing
              mendukung visi dan misi organisasi.
            </p>
          </div>

          <div className="lg:w-[55%] lg:block hidden">
            <div className="w-full rounded-xl overflow-hidden">
              <Image
                src="/assets/static-img/bph.jpg"
                alt="BPH preview illustration"
                width={800}
                height={600}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-full hidden lg:grid grid-cols-[30%_40%_30%] gap-8 relative ml-12 mt-8">
          <div className="space-y-9 pt-12 w-full h-fit z-10">
            <Image
              width={1000}
              height={1000}
              src="/assets/static-img/bph.jpg"
              alt="People working in office"
              className="w-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-black/40 opacity-90"
            />
          </div>
          <div className="space-y-9 h-fit w-full z-10">
            <Image
              width={1000}
              height={1000}
              src="/assets/static-img/bph.jpg"
              alt="Man on a video call"
              className="w-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-black/40 opacity-90"
            />
          </div>
          <div className="space-y-9 h-fit w-full pt-36 z-10">
            <Image
              width={1000}
              height={1000}
              src="/assets/static-img/bph.jpg"
              alt="Man on a video call"
              className="w-full object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 shadow-black/40 opacity-90"
            />
          </div>
        </div>

        <div className="lg:hidden flex flex-col w-full px-6 gap-6">
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="space-y-4 w-full h-fit z-10">
              <Image
                width={1000}
                height={1000}
                src="/assets/static-img/bph.jpg"
                alt="People working in office"
                className="w-full object-cover rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-4 h-fit w-full z-10 pt-8">
              <Image
                width={1000}
                height={1000}
                src="/assets/static-img/bph2.jpg"
                alt="Man on a video call"
                className="w-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
          <div className="w-full">
            <Image
              width={1000}
              height={1000}
              src="/assets/static-img/bph.jpg"
              alt="People working in office"
              className="w-full object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* section 4 */}
      <div className="w-full px-6 lg:px-12 mb-20">
        <div className="w-full bg-slate-900/95 py-28 lg:py-32 px-6 lg:px-12 rounded-xl shadow-lg flex flex-col justify-start items-start gap-20">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl lg:text-[44px] font-semibold text-white">
              BPH Team
            </h2>
            <p className="text-base text-gray-300 mt-2 max-w-2xl font-light">
              Inilah jajaran Badan Pengurus Harian (BPH) HIMSI UBSI Kaliabang
              yang terdiri dari Ketua, Wakil Ketua, Sekretaris, dan Bendahara.
              Mereka adalah tim inti yang berperan penting dalam
              mengoordinasikan seluruh divisi dan memastikan setiap program
              kerja berjalan dengan baik.
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 md:gap-y-16 gap-y-12">
            <MemberCard
              urlImage="/assets/static-img/bph/juwita.jpg"
              name="Juwita Aprilia"
              position="Wakil Ketua"
            />
            <MemberCard
              urlImage="/assets/static-img/bph/juwita.jpg"
              name="Juwita Aprilia"
              position="Wakil Ketua"
            />
            <MemberCard
              urlImage="/assets/static-img/bph/juwita.jpg"
              name="Juwita Aprilia"
              position="Wakil Ketua"
            />
            <MemberCard
              urlImage="/assets/static-img/bph/juwita.jpg"
              name="Juwita Aprilia"
              position="Wakil Ketua"
            />
            <MemberCard
              urlImage="/assets/static-img/bph/juwita.jpg"
              name="Juwita Aprilia"
              position="Wakil Ketua"
            />
            <MemberCard
              urlImage="/assets/static-img/bph/juwita.jpg"
              name="Juwita Aprilia"
              position="Wakil Ketua"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// element for member card
const MemberCard = ({
  urlImage,
  name,
  position,
}: {
  urlImage: string;
  name: string;
  position: string;
}) => {
  return (
    <div className="flex flex-col items-start w-full gap-4">
      <div className="w-full rounded-xl overflow-hidden">
        <Image
          src={urlImage}
          alt={name}
          width={5000}
          height={5000}
          className="w-full object-cover object-center"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p className="text-base text-gray-300">{position}</p>
        {/* <p className="text-sm text-gray-500">{address}</p> */}
      </div>
    </div>
  );
};
