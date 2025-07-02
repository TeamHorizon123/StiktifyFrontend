import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { useContext, useEffect, useState } from "react"

const useFetchItem = <T>(props: IRequest) => {
    const { accessToken } = useContext(AuthContext) ?? {};
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await sendRequest<T>({
                    url: `${props.url}`,
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });

                if (res) setData(res);
            } catch (error) {
                console.error("error: ", error);
            }
        }

        getData();
    }, [accessToken, props.url, data]);
    return { data };
}

export default useFetchItem