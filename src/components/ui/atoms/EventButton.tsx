import Link from "next/link"

type EventButtonProps = {
    title: string;
    href: string;
}

const EventButton = ( { title, href }: EventButtonProps) => {
    return(
        <Link href={href} className="text-semibold text-white rounded-md py-2 px-4 bg-primary hover:bg-primary/80" >{title}</Link>
    )
}

export default EventButton;