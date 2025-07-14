import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { useContext, useEffect, useState } from "react"

const useFetchListOData = <T>(props: IRequestOData) => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const getData = async () => {
      if (!accessToken) return;
      try {
        const limit = props.limit || 8;
        const skip = (props.page - 1) * limit
        const res = await sendRequest<IListOdata<T>>({
          url: `${props.url}`,
          queryParams: {
            $top: limit,
            $skip: skip
          },
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });

        setData(res.value || []);
      } catch (error) {
        console.log("Error get all item: ", error);
      }
    }

    getData();
  }, [accessToken, props.url, props.page, props.limit]);

  return [data];
}

export default useFetchListOData