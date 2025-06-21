"use client";

import { useGlobalContext } from "@/library/global.context";
import CardMusic from "./card.music";
import InputCustomize from "../input/input.customize";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { handleFilterSearchMusic, handleGetDataHotMusic, handleGetRecommendMusic } from "@/actions/music.action";
import DropdownCustomizeFilterMusic from "../dropdown/dropdownFilterMusic";
import { handleGetPlaylistAction } from "@/actions/playlist.action";
import { AuthContext } from "@/context/AuthContext";
import RecommendMusicList from "./recommend.music";
import HotMusicList from "./hot.music.list";

interface IProps {
  data: IMusic[];
}

const ListMusic = (props: IProps) => {
  const { setTrackCurrent, trackCurrent, isPlaying, setIsPlaying, playlist, setPlaylist, refreshPlaylist, listPlaylist, setListPlayList, setFlag } =
    useGlobalContext()!;
  const { data } = props;
  const [search, setSearch] = useState<string>("");
  const [filterReq, setFilterReq] = useState<string>("");
  const [filteredData, setFilteredData] = useState<IMusic[]>(data);
  const { user } = useContext(AuthContext)!
  const [dataRecommend, setDataRecommend] = useState<IMusic[] | []>([])
  const [dataHotMusic, setDataHotMusic] = useState<IMusic[] | []>([])

  useEffect(() => {
    setListPlayList([])
  }, [])

  useEffect(() => {
    (async () => {
      if (user) {
        const res = await handleGetPlaylistAction(user._id)
        if (res?.statusCode === 200) {
          setPlaylist(res.data.result)
        }
      }
    })()
  }, [user, refreshPlaylist])

  useEffect(() => {
    const fetchData = async () => {
      if (search.trim() === "") {
        setFilteredData(data);
        return;
      }
      try {
        const response = await handleFilterSearchMusic("1", "30");
        if (!response || !response.data || !response.data.result) {
          setFilteredData([]);
          return;
        }
        if (Array.isArray(response.data.result)) {
          const filtered = response.data.result.filter((music: IMusic) =>
            music.musicDescription.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredData(filtered);
        } else {
          setFilteredData([]);
        }
      } catch (error) {
        setFilteredData([]);
      }
    };
    fetchData();
  }, [search, data]);

  const handlePlayer = (track: IMusic) => {
    if (trackCurrent?._id !== track._id) {
      setFlag(false)
      setTrackCurrent(track);
      if (listPlaylist && listPlaylist.length > 0) {
        setListPlayList([])
      }
      localStorage.setItem("trackCurrent", JSON.stringify(track));
      return setIsPlaying(isPlaying ? true : !isPlaying);
    }
    return setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    (async () => {
      if (user) {
        const res = await handleGetRecommendMusic(user._id)
        const resHotMusic = await handleGetDataHotMusic()

        setDataHotMusic(resHotMusic?.data)
        setDataRecommend(res?.data)
      }
    })()
  }, [user])

  return (
    <>
      <div>
        <div className="ml-[200px] flex justify-start gap-2">
          <div className="w-[700px]">
            <InputCustomize
              setValue={(val: any) => setSearch(val)}
              value={search}
              icon={<SearchOutlined />}
            />
          </div>
          <div>
            <DropdownCustomizeFilterMusic
              title="Filter"
              selected={filterReq}
              setSelect={(value: any) => setFilterReq(value)}
              icon={<FilterOutlined />}
            />
          </div>
        </div>
        <div>
          {user && dataRecommend && dataRecommend.length > 0 &&
            <div className="my-3 mx-20">
              <h1 className="font-bold text-2xl">Recommend Music</h1>
              <RecommendMusicList data={dataRecommend} />
            </div>
          }
        </div>
        <div>
          {dataHotMusic && dataHotMusic.length > 0 &&
            <div className="my-3 mx-20">
              <h1 className="font-bold text-2xl">Hot Music On Week</h1>
              <HotMusicList data={dataHotMusic} />
            </div>
          }
        </div>
        <div className="flex flex-wrap justify-start gap-5 my-3 mx-20">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <CardMusic
                key={item._id}
                handlePlayer={handlePlayer}
                isPlaying={isPlaying}
                item={item}
              />
            ))
          ) : (
            <p className="text-gray-500 ml-[200px]">Not found!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ListMusic;
