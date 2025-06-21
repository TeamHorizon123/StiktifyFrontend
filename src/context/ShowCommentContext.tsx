"use client";
import { createContext, useState, ReactNode, useContext } from "react";

interface ShowCommentContextType {
  showComments: boolean;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
  showNotification: boolean;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShowCommentContext = createContext<ShowCommentContextType | null>(null);

export const ShowCommentProvider = ({ children }: { children: ReactNode }) => {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  return (
    <ShowCommentContext.Provider
      value={{
        showComments,
        setShowComments,
        showNotification,
        setShowNotification,
      }}
    >
      {children}
    </ShowCommentContext.Provider>
  );
};

export const useShowComment = () => {
  const context = useContext(ShowCommentContext);
  if (!context) {
    throw new Error(
      "useShowComment phải được sử dụng bên trong ShowCommentProvider"
    );
  }
  return context;
};
