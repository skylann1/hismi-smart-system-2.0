

type  DashboardSectionProps = {
    className?: string;
    children: React.ReactElement | React.ReactElement[];
}

const DashboardSection = ({ className = "", children } : DashboardSectionProps) => {
    return(
        <div className={className}>
            {children}
        </div>
    )
}

export default DashboardSection;