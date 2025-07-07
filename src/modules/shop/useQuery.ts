import { useState } from "react"

const useQuery = (iquery: IQuery) => {
    const [query, setQuery] = useState(iquery);

    const updateQuery = (newQuery: IQuery) => {
        setQuery((prev) => ({
            ...prev,
            ...newQuery
        }))
    }

    const resetQuery = () => {
        setQuery(iquery)
    }

    return [query, updateQuery, resetQuery]
}

export default useQuery