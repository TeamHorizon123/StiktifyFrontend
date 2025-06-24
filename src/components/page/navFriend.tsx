import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";

interface IAccount{
    _id: string,
    userName: string,
}

export default function Account({ _id, userName }: IAccount) {
    return (
        <Link href="" className="test-base sm:text-[4vw] lg:text-base flex items-center space-x-2">
            <AiOutlineUser />
            <p className="text-base sm:hidden max-[600px]:hidden lg:block">{userName}</p>
        </Link>
    )
}