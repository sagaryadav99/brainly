/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "../components/Button";
import { Card } from "../components/cards";
import { Createcontenmodal } from "../components/createcontentmodal";
import { Sidebarcom } from "../components/sidebascomp";
import { Addicon } from "../icons/addicon";
import { BrainIcon } from "../icons/brainIcon";
import { Shareicon } from "../icons/shareicone";
import { useState } from "react";
import { Searchbar } from "../components/searchbar";
import { useGetCards } from "../hooks/getcards";
import { Twittericon } from "../icons/twitterIcon";
import { SideBarItem } from "../components/sidebaritem";
import { YoutubeIcon } from "../icons/youtubeIcon";

export function Dashboard() {
  const [openmodal, setOpenmodal] = useState(false);
  const { data, isLoading, isError, error, refetch } = useGetCards();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }
  return (
    <div className="bg-gray-200 min-h-screen h-fit pb-16 flex">
      <div className="fixed top-0 left-0">
        <Sidebarcom
          icon={<BrainIcon size={"size-7"} />}
          title={`Second Brain ${
            data[0] ? `of ${data[0].authorid.username}` : ""
          }`}
        >
          <SideBarItem icon={<Twittericon />} text={"twitter"} />
          <SideBarItem icon={<YoutubeIcon />} text={"youtube"} />
        </Sidebarcom>
      </div>
      <div className="ml-52">
        <div className="flex items-center justify-end pt-2">
          <Button
            variant="primary"
            size="sm"
            text="Add content"
            starticon={<Addicon />}
            onClick={() => {
              setOpenmodal(true);
            }}
          />

          <Button
            variant="secondary"
            size="sm"
            text="Share Brain"
            starticon={<Shareicon />}
          />
        </div>
        <Searchbar placeholder="ask your brain" />
        <div className="flex flex-wrap items-stretch">
          {data?.map((item: any) => {
            return (
              <Card
                key={item._id}
                id={item._id}
                variant={item.contenttype}
                title={item.title}
                link={item.link}
                tags={item.tags}
                summary={item.summary}
                summaryStatus={item.summaryStatus}
                note={item.note}
              />
            );
          })}
        </div>
        <Createcontenmodal
          open={openmodal}
          refetch={() => {
            refetch();
          }}
          onClose={() => {
            setOpenmodal(false);
          }}
        />
      </div>
    </div>
  );
}
