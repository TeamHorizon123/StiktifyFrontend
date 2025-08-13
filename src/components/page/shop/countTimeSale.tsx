export default function CountSaleTime() {
    return (
        <>
            <div className="w-fit px-2 ml-4 text-sm bg-[#EF4444] rounded-lg text-center font-light">
                <div className="flex space-x-1">
                    <p>End in</p>
                    <div className="flex">
                        <p>hh</p>
                        <p>:</p>
                        <p>mm</p>
                        <p>:</p>
                        <p>ss</p>
                    </div>
                </div>
            </div>
        </>
    )
}