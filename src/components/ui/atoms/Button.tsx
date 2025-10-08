"use client";

import Link from "next/link";

export const LinkButton = ({
  label,
  exStyle,
  redirect = "#",
}: {
  label: string;
  exStyle?: string;
  redirect: string;
}) => {
  return (
    <Link
      href={redirect}
      className={`text-semibold text-white rounded-md py-2 px-4 bg-primary ${exStyle}`}
    >
      {label}
    </Link>
  );
};
