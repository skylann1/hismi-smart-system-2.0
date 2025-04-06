import { Inter, Oswald, Headland_One } from "next/font/google";

export const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900" ],
    display: "swap",
});

export const oswald = Oswald({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
})

export const headlandOne = Headland_One({
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
})