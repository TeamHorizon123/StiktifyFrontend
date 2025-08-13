import { useRouter } from "next/navigation"

export default function BtnSignIn() {
    const router = useRouter()
    return (<>
        <button
            onClick={() => router.push("/auth/login")}
            className="w-full text-white bg-[rgb(254,44,85)] rounded-lg p-2 hover:bg-[rgb(234,40,78)] hover:text-white transition-all duration-300"
        >
            Sign In
        </button>
    </>)
}