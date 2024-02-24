import { getBoardData } from "@/lib/actions/board.action";
import { notFound } from "next/navigation";
import React from "react";
import BoardNavbar from "./_components/BoardNavbar";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { board }: any = await getBoardData({ boardId: params.boardId });

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar board={board} />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default Layout;
