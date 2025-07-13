"use client";
import HistoryList from "@/components/page/history/history-list";
import SettingHistory from "@/components/page/history/setting-history";
import Header from "@/components/page/trending/header";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import React, { useContext, useEffect, useState } from "react";

const ViewingHistory = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [videoList, setVideoList] = useState<VideoHistoryProps[]>([]);
  const [isFetch, setIsFetch] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxLength, setMaxLength] = useState(false);
  const [watchedDate, setWachtedDate] = useState<string>();
  const { user, accessToken, logout } = useContext(AuthContext) ?? {};
  useEffect(() => {
    getViewingHistoryList();
  }, [accessToken, user]);
  const getViewingHistoryList = async () => {
    if (accessToken && user) {
      const filter = JSON.stringify({
        userId: user._id,
        updatedAt: watchedDate,
      });
      const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/v1/viewinghistory/list-viewing-history?query=${encodeURIComponent(
            filter
          )}&current=${currentPage}&pageSize=10&searchValue=${searchValue}&`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res.data);
      setIsFetch(false);
      if (res.data.result.length === 0) {
        setMaxLength(true);
        setCurrentPage((prev) => prev - 1);
      }
      if (videoList.length == 0) {
        setVideoList(res?.data?.result);
      } else {
        setVideoList((prev) => [...prev, ...(res?.data?.result || [])]);
      }
    }
  };

  useEffect(() => {
    if (isFetch) {
      getViewingHistoryList();
    }
  }, [isFetch]);
  const handleSearchHistory = async () => {
    let filter;
    if (watchedDate) {
      filter = JSON.stringify({
        userId: user._id,
        updatedAt: watchedDate,
      });
    } else {
      filter = JSON.stringify({
        userId: user._id,
      });
    }

    setCurrentPage(1);
    console.log(searchValue);
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/v1/viewinghistory/list-viewing-history?query=${encodeURIComponent(
          filter
        )}&current=${1}&pageSize=10&searchValue=${searchValue}&`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.data.result.length === 0) {
      setMaxLength(true);
      setCurrentPage((prev) => prev - 1);
    }
    setMaxLength(false);
    setVideoList(res?.data?.result);
    console.log(res.data);
  };
  const handleFilterDate = async (date: Date | null) => {
    let filter;
    setMaxLength(false);
    setCurrentPage(1);
    if (!date) {
      setWachtedDate("");
      filter = JSON.stringify({
        userId: user._id,
      });
    } else {
      // Chuyển date về đầu ngày (local)
      const localDate = new Date(date);
      localDate.setHours(0, 0, 0, 0); // Reset về 00:00:00

      // Chuyển về ISO mà không làm thay đổi ngày
      const offset = localDate.getTimezoneOffset() * 60000; // Lấy độ lệch UTC (milliseconds)
      const correctedISODate = new Date(
        localDate.getTime() - offset
      ).toISOString();

      setWachtedDate(correctedISODate);

      filter = JSON.stringify({
        userId: user._id,
        updatedAt: correctedISODate,
      });
      console.log(correctedISODate);
    }

    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/v1/viewinghistory/list-viewing-history?query=${encodeURIComponent(
          filter
        )}&current=1&pageSize=10&searchValue=${searchValue}&`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(accessToken)
    if (res.data.result.length === 0) {
      setMaxLength(true);
      setCurrentPage((prev) => prev - 1);
    }
    setVideoList(res?.data?.result);
    console.log(res.data);
  };

  return (
    <div className="flex-grow p-5 ml-64">
      {/* <Header
        isGuest={false}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onClick={() => handleSearchHistory()}
      /> */}
      <div className="flex items-start gap-4 mt-2">
        <HistoryList
          videoList={videoList}
          setVideoList={setVideoList}
          maxLength={maxLength}
          setMaxLength={setMaxLength}
          setIsFetch={setIsFetch}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <SettingHistory
          setVideoList={setVideoList}
          onChange={handleFilterDate}
        />
      </div>
    </div>
  );
};

export default ViewingHistory;
