import Link from 'next/link'
import Image from "next/image";


export default function NotFound() {
    return (
        <div className={" flex w-full h-full justify-center content-center"}>
            <div className={"flex flex-col items-center content-center justify-center w-1/3"}>
                <div className={"text-6xl font-bold"}>
                    Oops
                </div>
                <Image src={"/images/404.png"} alt={"error 404"} width={500} height={500}/>
                <div className={"text-sm mb-4"}>
                    Description
                </div>
                <Link href="/">
                    <button
                        className="text-white px-4 py-2 bg-rose-600 text-muted-100 font-semibold rounded hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500">
                        Retour
                    </button>
                </Link>
            </div>

        </div>
    )
}