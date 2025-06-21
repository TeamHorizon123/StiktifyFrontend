"use client";
import React, { useContext, useEffect, useState } from "react";
import { Slider, Switch, Card } from "antd";
import { Button, Modal } from "antd";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

type AlgorithmConfig = {
  numberOfCount: {
    wishListCount: number;
    wishListScoreCount: number;
  };
  resetScore: {
    discountScore: number;
    wasCheckScore: boolean;
  };
  numberVideoSuggest: {
    triggerAction: number;
    collaboration: number;
    trending: number;
    random: number;
  };
  collaborativeFiltering: {
    numberCollaborator: number;
    numberWishListVideo: number;
  };
  scoreIncrease: {
    watchVideo: number;
    reactionAboutVideo: number;
    reactionAboutMusic: number;
    clickLinkMusic: number;
    followCreator: number;
    listenMusic: number;
    commentVideo: number;
    searchVideo: number;
    searchMusic: number;
    shareVideo: number;
  };
};

const ManageAlgorithm: React.FC = () => {
  const defaultConfig: AlgorithmConfig = {
    numberOfCount: { wishListCount: 10, wishListScoreCount: 100 },
    resetScore: { discountScore: 10, wasCheckScore: false },
    numberVideoSuggest: {
      triggerAction: 4,
      collaboration: 4,
      trending: 1,
      random: 1,
    },
    collaborativeFiltering: { numberCollaborator: 5, numberWishListVideo: 5 },
    scoreIncrease: {
      watchVideo: 1,
      reactionAboutVideo: 1.5,
      reactionAboutMusic: 1.5,
      clickLinkMusic: 2.5,
      followCreator: 2.5,
      listenMusic: 2.5,
      commentVideo: 1.5,
      searchVideo: 2.5,
      searchMusic: 2.5,
      shareVideo: 2,
    },
  };
  const [resetConfig, setResetConfig] =
    useState<AlgorithmConfig>(defaultConfig);
  const [config, setConfig] = useState<AlgorithmConfig>(defaultConfig);
  const [averageWishListScore, setAverageWishListScore] = useState<Number>(0);
  const [averageWishList, setAverageWishList] = useState<Number>(0);
  const { user, accessToken, logout } = useContext(AuthContext) ?? {};
  const onResetConfig = () => {
    setConfig(resetConfig);
  };
  const handleChange = (
    category: keyof AlgorithmConfig,
    key: string,
    value: any
  ) => {
    setConfig((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };
  useEffect(() => {
    handleFetchSetting();
  }, [accessToken]);
  const handleFetchSetting = async () => {
    if (!accessToken) return;
    const res = await sendRequest<
      IBackendRes<{
        algorithmConfig: AlgorithmConfig;
        averageWishListScore: Number;
        averageWishList: Number;
      }>
    >({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/settings`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setConfig(res?.data?.algorithmConfig ?? defaultConfig);
    setResetConfig(res?.data?.algorithmConfig ?? defaultConfig);
    setAverageWishList(res?.data?.averageWishList || 0);
    setAverageWishListScore(res?.data?.averageWishListScore || 0);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleUpdateAlgorithmSetting = async () => {
    if (!accessToken) return;
    setIsModalOpen(false);
    const res = await sendRequest<IBackendRes<AlgorithmConfig>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/settings`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: {
       numberOfCount:config.numberOfCount,
       resetScore:config.resetScore,
       numberVideoSuggest:config.numberVideoSuggest,
       collaborativeFiltering:config.collaborativeFiltering,
       scoreIncrease:config.scoreIncrease
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Manage Algorithm</h2>

      <div className="flex gap-4">
        {/* Number Of Count */}
        <Card
          title={<span className="text-xl">Number Of Count</span>}
          className="flex-1"
        >
          <div className="mb-4">
            <label className="block text-[18px] font-medium mb-1">
              Wish List Count:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">10</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.numberOfCount.wishListCount}
                min={10}
                max={30}
                step={1}
                onChange={(value) =>
                  handleChange("numberOfCount", "wishListCount", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">30</span>
            </div>
          </div>

          <div>
            <label className="block text-[18px] font-medium mb-1">
              Wish List Score Count:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-10 text-right">100</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.numberOfCount.wishListScoreCount}
                min={100}
                max={500}
                step={10}
                onChange={(value) =>
                  handleChange("numberOfCount", "wishListScoreCount", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-10">500</span>
            </div>
          </div>
        </Card>

        <Card
          title={<span className="text-xl">Averages</span>}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <div className="mb-4 text-center">
            <label className="block text-[18px]  mb-2 text-gray-700">
              Wish List Average:
            </label>
            <span className="text-3xl  text-blue-600">
              {averageWishList + ""}
            </span>
          </div>

          <div className="text-center">
            <label className="block text-[18px]  mb-2 text-gray-700">
              Score Count Average:
            </label>
            <span className="text-3xl  text-blue-600">
              {averageWishListScore + ""}
            </span>
          </div>
        </Card>

        <Card
          title={<span className="text-xl">Reset Score</span>}
          className="flex-1"
        >
          <div className="mb-4">
            <label className="block text-[18px] font-medium mb-1">
              Discount Score:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-10 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                min={0}
                max={50}
                step={10}
                value={config.resetScore.discountScore}
                onChange={(value) =>
                  handleChange("resetScore", "discountScore", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-10">50</span>
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-[18px] font-medium mb-1 mr-2">
              Was Check Score:
            </label>
            <Switch
              checked={config.resetScore.wasCheckScore}
              onChange={(checked) =>
                handleChange("resetScore", "wasCheckScore", checked)
              }
            />
          </div>
        </Card>
      </div>
      <div className="w-full flex ">
        <Card
          title={<span className="text-xl">Number Video Suggest</span>}
          className="mb-4 w-2/3"
        >
          <div className="flex flex-wrap">
            <div className="w-1/2 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Trigger Action:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.numberVideoSuggest.triggerAction}
                  min={0}
                  max={10}
                  step={1}
                  onChange={(value) =>
                    handleChange("numberVideoSuggest", "triggerAction", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">10</span>
              </div>
            </div>

            <div className="w-1/2 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Collaborator:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.numberVideoSuggest.collaboration}
                  min={0}
                  max={10}
                  step={1}
                  onChange={(value) =>
                    handleChange("numberVideoSuggest", "collaboration", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">10</span>
              </div>
            </div>

            <div className="w-1/2 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Trending:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.numberVideoSuggest.trending}
                  min={0}
                  max={2}
                  step={1}
                  onChange={(value) =>
                    handleChange("numberVideoSuggest", "trending", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>

            <div className="w-1/2 p-2">
              <label className="block text-[18px] font-medium mb-1">
                Random:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm w-6 text-right">0</span>
                <Slider
                  railStyle={{ backgroundColor: "#C3C3C3" }}
                  value={config.numberVideoSuggest.random}
                  min={0}
                  max={2}
                  step={1}
                  onChange={(value) =>
                    handleChange("numberVideoSuggest", "random", value)
                  }
                  className="flex-1"
                />
                <span className="text-sm w-6">2</span>
              </div>
            </div>
          </div>
        </Card>
        <Card
          title={<span className="text-xl">Collaberative Filtering</span>}
          className=" w-1/3 mb-4"
        >
          <div className="p-2">
            <label className="block text-[18px] font-medium mb-1">
              Number Collaberator:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.collaborativeFiltering.numberCollaborator}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange(
                    "collaborativeFiltering",
                    "numberCollaborator",
                    value
                  )
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>

          <div className="p-2">
            <label className="block text-[18px] font-medium mb-1">
              Number WishList Video:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.collaborativeFiltering.numberWishListVideo}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange(
                    "collaborativeFiltering",
                    "numberWishListVideo",
                    value
                  )
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>
        </Card>
      </div>
      <Card
        title={<span className="text-xl">Score Increase</span>}
        className="mb-4 w-full"
      >
        <div className="flex flex-wrap">
          <div className="w-1/3 p-2">
            <label className="block text-[18px] font-medium mb-1">
              Watch Video:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.scoreIncrease.watchVideo}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange("scoreIncrease", "watchVideo", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>

          <div className="w-1/3 p-2">
            <label className="block text-[18px] font-medium mb-1">
              Reaction Video:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.scoreIncrease.reactionAboutVideo}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange("scoreIncrease", "reactionAboutVideo", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>

          <div className="w-1/3 p-2">
            <label className="block text-[18px] font-medium mb-1">
              Reaction Music:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.scoreIncrease.reactionAboutMusic}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange("scoreIncrease", "reactionAboutMusic", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>

          <div className="w-1/3 p-2">
            <label className="block text-[18px] font-medium mb-1">
              Click Link Music:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.scoreIncrease.clickLinkMusic}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange("scoreIncrease", "clickLinkMusic", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>
          <div className="w-1/3 p-2">
            <label className="block text-[18px] font-medium mb-1">
              Follow Creator:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.scoreIncrease.followCreator}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange("scoreIncrease", "followCreator", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>
          <div className="w-1/3 p-2">
            <label className="block text-[18px] font-medium mb-1">
              Listen Music:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.scoreIncrease.listenMusic}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange("scoreIncrease", "listenMusic", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>
          <div className="w-1/3 p-2">
            <label className="block text-[18px] font-medium mb-1">
              Comment Video:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.scoreIncrease.commentVideo}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange("scoreIncrease", "commentVideo", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>
          <div className="w-1/3 p-2">
            <label className="block text-[18px] font-medium mb-1">
              Search Video:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.scoreIncrease.searchVideo}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange("scoreIncrease", "searchVideo", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>
          <div className="w-1/3 p-2">
            <label className="block text-[18px] font-medium mb-1">
              Search Music:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.scoreIncrease.searchMusic}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange("scoreIncrease", "searchMusic", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>
          <div className="w-1/3 p-2">
            <label className="block text-[18px] font-medium mb-1">
              Share Video:
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm w-6 text-right">0</span>
              <Slider
                railStyle={{ backgroundColor: "#C3C3C3" }}
                value={config.scoreIncrease.shareVideo}
                min={0}
                max={5}
                step={0.5}
                onChange={(value) =>
                  handleChange("scoreIncrease", "shareVideo", value)
                }
                className="flex-1"
              />
              <span className="text-sm w-6">5</span>
            </div>
          </div>
        </div>
      </Card>
      <div className="flex justify-end">
        <Button
          color="primary"
          variant="solid"
          onClick={showModal}
          size="large"
          className="mr-2"
        >
          Save
        </Button>
        <Button
          onClick={onResetConfig}
          size="large"
          color="default"
          variant="outlined"
        >
          Reset
        </Button>
      </div>

      <Modal
        title={<div className="text-xl">Confirm Algorithm Update</div>}
        open={isModalOpen}
        onOk={handleUpdateAlgorithmSetting}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p className="text-[16px]">
          Are you sure you want to apply these changes to the system-wide
          algorithm?
        </p>
      </Modal>
    </div>
  );
};

export default ManageAlgorithm;
