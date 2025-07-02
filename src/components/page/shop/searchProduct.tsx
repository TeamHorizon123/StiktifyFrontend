
export default function Search() {
    

    return (
        <>
            <div className="w-full mt-6 flex items-center space-x-4 justify-center">
                <input 
                className="min-w-60 w-[30vw] outline-none py-1 px-2 bg-[#1C1B33] text-white border-[2px] border-[#454B79] rounded-lg" 
                type="text" placeholder="Search product" />
                <select name="" id="" defaultValue="Filter">
                    <option key={1} value="1">NONE</option>
                </select>
            </div>
        </>
    )
}