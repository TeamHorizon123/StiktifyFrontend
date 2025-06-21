import React from "react";

interface SearchCardProps {
  videos: any[]; // Nhận một danh sách video
}

const SearchCard: React.FC<SearchCardProps> = ({ videos }) => {

  if (!videos || videos.length === 0) return <p>No videos found</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">
              User
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">
              Thumbnail
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">
              Description
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">
              Views
            </th>
            <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-600">
              Reactions
            </th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {/* User */}
              <td className="px-4 py-2 border-b text-gray-600">
                {video.userId?.userName ?? "Unknown"}
              </td>
              {/* Thumbnail */}
              <td className="px-4 py-2 border-b">
                <img
                  src={video.videoThumbnail}
                  alt="Thumbnail"
                  className="w-24 h-16 object-cover rounded-md"
                />
              </td>

              {/* Description */}
              <td className="px-4 py-2 border-b text-gray-800">
                {video.videoDescription}
              </td>

              {/* Views */}
              <td className="px-4 py-2 border-b text-gray-600">
                {video.totalViews.toLocaleString()}
              </td>

              {/* Reactions */}
              <td className="px-4 py-2 border-b text-gray-600">
                {video.totalReaction.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchCard;
