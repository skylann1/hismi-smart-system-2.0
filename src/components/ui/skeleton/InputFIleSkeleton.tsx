import Image from "next/image";

export default function InputFileSkeleton() {
    return(
        <div className="w-32 h-32 rounded-lg bg-gray-200 animate-pulse overflow-hidden">
            <Image src="/assets/static-img/avatar.png" alt="placeholder" width={1000} height={1000} className="w-full h-full object-cover object-center"/>
        </div>
    )
}