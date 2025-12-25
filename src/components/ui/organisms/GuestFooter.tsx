import Link from "next/link";
import {
    FaInstagram,
    FaTiktok,

} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const GuestFooter = () => {

    return (
        <footer className="bg-primary text-white px-12 max-md:px-4 max-md:py-4 pt-6 pb-2 flex flex-col gap-4 max-sm:gap-12">
            <div className="flex justify-between items-start max-sm:flex-col max-sm:gap-10">
                <div className="flex gap-24 max-sm:flex-col max-sm:gap-3 max-sm:w-full">
                    <ul className="flex flex-col gap-2 font-oswald">
                        <li><Link href="/" className="font-semibold text-[13px] uppercase opacity-75">privacy</Link></li>
                        <li><Link href="/" className="font-semibold text-[13px] uppercase opacity-75">teamwork</Link></li>
                        <li><Link href="/" className="font-semibold text-[13px] uppercase opacity-75">universitas</Link></li>
                        <li><Link href="/" className="font-semibold text-[13px] uppercase opacity-75">more</Link></li>
                    </ul>
                    <hr className="h-[1px] w-full max-sm:block hidden" />
                    <div className="flex gap-8 max-sm:flex-col max-sm:gap-2">
                        <span>
                            <span className="text-white text-base">help</span>
                            <ul className="max-sm:hidden">
                                <li><Link href="/" className="text-[13px] opacity-50 hover:opacity-100 capitalize">get help</Link></li>
                                <li><Link href="/" className="text-[13px] opacity-50 hover:opacity-100 capitalize">contact us</Link></li>
                                <li><Link href="/" className="text-[13px] opacity-50 hover:opacity-100 capitalize">faq</Link></li>
                                <li><Link href="/" className="text-[13px] opacity-50 hover:opacity-100 capitalize">terms</Link></li>
                                <li><Link href="/" className="text-[13px] opacity-50 hover:opacity-100 capitalize">privacy</Link></li>
                                <li><Link href="/" className="text-[13px] opacity-50 hover:opacity-100 capitalize">more</Link></li>
                            </ul>
                        </span>
                        <span>
                            <span className="text-white text-base">about</span>
                            <ul className="max-sm:hidden">
                                <li><Link href="" className="text-[13px] opacity-50 hover:opacity-100 capitalize">departemen</Link></li>
                                <li><Link href="https://www.bsi.ac.id/indexkoe_yht.php" className="text-[13px] opacity-50 hover:opacity-100 capitalize">BSI universitas</Link></li>
                                <li><Link href="https://pusatinformasi.kampusmerdeka.kemdikbud.go.id/hc/id" className="text-[13px] opacity-50 hover:opacity-100 capitalize">kampus merdeka</Link></li>
                            </ul>
                        </span>
                    </div>
                </div>
                <div className="h-full">
                    <ul className="flex gap-4">
                        <li className="p-1 rounded-full bg-slate-400 hover:bg-slate-100">
                            <a href="https://www.instagram.com/himsi.kaliabang">
                                <FaInstagram className="w-[20px] h-[20px] text-slate-900" />
                            </a>
                        </li>
                        <li className="p-1 rounded-full bg-slate-400 hover:bg-slate-100">
                            <a href="https://www.tiktok.com/@himsi_ubsikaliabang">
                                <FaTiktok className="w-[20px] h-[20px] text-slate-900" />
                            </a>
                        </li>
                        <li className="p-1 rounded-full bg-slate-400 hover:bg-slate-100">
                            <a href="mailto:himsi.ubsikaliabang@gmail.com">
                                <MdEmail className="w-[20px] h-[20px] text-slate-900" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-between items-start max-sm:flex-col max-sm:gap-4">
                <div className="flex gap-12 items-center max-sm:flex-col max-sm:gap-2 max-sm:items-start">
                    <div className="flex capitalize justify-center items-center">
                        <img src="./icons/mark.png" alt="" className="w-[20px]" />
                        <p className="text-xs text-slate-400 font-bold">kaliabang</p>
                    </div>
                    <p className="text-slate-400 text-xs font-semibold">
                        ©2024 | ©Copyright <span className="text-sky-700 font-bold">HIMSI KLA</span>
                    </p>
                </div>

                <ul className="flex gap-3 capitalize text-xs font-semibold text-slate-400 max-sm:flex-col">
                    <li><a href="" className="hover:text-slate-100">guides</a></li>
                    <li><a href="" className="hover:text-slate-100">himsi privacy</a></li>
                </ul>
            </div>
        </footer>
    )
}

export default GuestFooter;