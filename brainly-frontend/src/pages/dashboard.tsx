import { Button } from "../components/Button";
import { Createcontenmodal } from "../components/createcontentmodal";
import { Addicon } from "../icons/addicon";
import { Shareicon } from "../icons/shareicone";
import { useEffect, useState } from "react";
import { Searchbar } from "../components/searchbar";
import { useGetCards, useGetSharedCards } from "../hooks/getcards";
import { AnimatePresence, motion } from "motion/react";
import { MainSmallCard } from "../components/mainsmallcard";
import { MainBigCard } from "../components/mainbigcard";
import { CardContext } from "../contexts/CardContext";
import { DummyCard } from "../components/skeletons/dummycard";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { BrainIconAnimated } from "../icons/brainIconAnimated";
import { BrainIcon } from "../icons/brainIcon";
const API = import.meta.env.VITE_BASE_URL;
interface cardprops {
  contenttype: "youtube" | "twitter" | "note";
  _id: string;
  title: string;
  link: string;
  tags?: [];
  summary?: string;
  summaryStatus?: string;
  note?: string;
}
export function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const { shareId } = useParams<{ shareId?: string }>();
  const hidden = shareId ? true : false;
  const tokenstate = token ? false : true;
  const [openmodal, setOpenmodal] = useState(false);
  const [open, setOpen] = useState(false);
  const [generateLink, setGenerateLink] = useState<boolean>(false);
  const [link, setLink] = useState("");
  const normalCard = useGetCards(token);
  const sharedCard = useGetSharedCards(shareId);
  const data = shareId ? sharedCard.data ?? [] : normalCard.data ?? [];
  const isLoading = shareId ? sharedCard.isLoading : normalCard.isLoading;
  const isError = shareId ? sharedCard.isError : normalCard.isError;
  const error = shareId ? sharedCard.error : normalCard.error;
  const refetch = normalCard.refetch;
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (isError && (error as any)?.status === 401) {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [isError, error]);
  const mutation = useMutation({
    mutationFn: shareablefn,
    retry: false,
    onSuccess: (data) => {
      if (data.Link) {
        setLink("http://localhost:5173/brainshare/" + data.Link);
      } else {
        setLink("");
      }
    },
  });
  const [currentCard, setCurrentCard] = useState<cardprops | null>(null);
  function sharefn() {
    if (hidden || tokenstate || isError) {
      navigate("/account");
      return;
    }
    const immediateValue = !generateLink;
    setGenerateLink(immediateValue);
    mutation.mutate(immediateValue);
  }
  async function shareablefn(immediateValue: boolean) {
    const data = await fetch(API + "/api/v1/brain/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? token : "",
      },
      body: JSON.stringify({ share: immediateValue }),
    });
    if (!data.ok) {
      const error = await data.json();
      throw new Error(error.error);
    }
    return data.json();
  }
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background">
        <div className="mx-auto w-[90%]">
          <div className={`flex items-center justify-end pt-2 gap-4 `}>
            <Button
              variant="primary"
              size="sm"
              text="Add content"
              starticon={<Addicon />}
              onClick={() => {
                if (hidden) {
                  navigate("/account");
                  return;
                }
                setOpenmodal(true);
              }}
            />

            <Button
              variant="secondary"
              size="sm"
              text="Share Brain"
              starticon={<Shareicon />}
              onClick={sharefn}
            />
          </div>
          <Searchbar
            placeholder="ask your brain"
            hidden={hidden || tokenstate}
          />
          <div className="h-full mx-auto my-auto flex items-center justify-center pt-30">
            <span className="inline-block w-20 h-20 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }
  function closeOpen() {
    setOpen(false);
  }
  const parentVariant = {
    open: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.08,
        staggerDirection: -1,
      },
    },
  };
  const cardWrapperVariant = {
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    closed: {
      opacity: 0,
      y: 20,
      scale: 0.96,
    },
  };

  return (
    <motion.div className="bg-background min-h-dvh pb-16 flex text-sm font-hero selection:bg-neutral-400 selection:text-black">
      <div className="mx-auto w-[95%] md:w-[90%] mt-2">
        <div
          className={`flex flex-col md:flex-row items-center justify-center lg:justify-between pt-2 gap-4`}
        >
          <div className="text-neutral-200 hidden md:flex justify-center gap-4 items-center">
            <div
              onClick={() => {
                navigate("/");
              }}
              className="cursor-pointer hover:scale-103 transition-all duration-200 ease-in-out"
            >
              <BrainIcon size="size-8 md:size-11" />
            </div>
            <div>
              <h5 className="text-base md:text-2xl font-bold">MINDRAW</h5>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 ">
            <AnimatePresence>
              {link && (
                <motion.div
                  initial={{
                    scaleX: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scaleX: 1,
                    opacity: 1,
                  }}
                  exit={{
                    scaleX: 0,
                    opacity: 0,
                  }}
                  style={{
                    originX: 1,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="p-1 bg-neutral-400 font-semibold text-base tracking-tight selection:bg-zinc-700 selection:text-neutral-200 border border-3 border-black rounded-lg"
                >
                  {link}
                </motion.div>
              )}
            </AnimatePresence>
            {mutation.isError ? (
              <div className="text-red-500">{mutation.error.message}</div>
            ) : null}
            <Button
              variant="primary"
              size="sm"
              text="Add content"
              starticon={<Addicon />}
              onClick={() => {
                if (hidden || tokenstate || isError) {
                  navigate("/account");
                  return;
                }
                setOpenmodal(true);
              }}
            />
            <Button
              variant="secondary"
              size="sm"
              text={link ? "Brain Sharing is On!" : "Share Brain"}
              starticon={
                link ? <BrainIconAnimated size="size-6" /> : <Shareicon />
              }
              onClick={sharefn}
            />
          </div>
        </div>
        <Searchbar
          placeholder={
            hidden || tokenstate ? "signin to ask" : "ask your brain"
          }
          hidden={hidden || tokenstate || isError}
          cards={data}
        />
        {isError ? (
          <div className="text-white text-center mt-10 text-lg">
            {error?.message}
          </div>
        ) : (
          <motion.div
            variants={parentVariant}
            initial="closed"
            animate={data.length ? "open" : "closed"}
            className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-3 md:gap-y-4 lg:grid-cols-3 mx-auto max-w-full p-4"
          >
            <AnimatePresence>
              {data.length != 0 ? (
                data
                  ?.map((item: cardprops) => {
                    return (
                      <motion.div variants={cardWrapperVariant} key={item._id}>
                        <div
                          onClick={() => {
                            setCurrentCard(() => item);
                            setOpen(true);
                          }}
                        >
                          <MainSmallCard
                            key={item._id}
                            id={item._id}
                            variant={item.contenttype}
                            title={item.title}
                            link={item.link}
                            tags={item.tags}
                            summary={item.summary}
                            summaryStatus={item.summaryStatus}
                            note={item.note}
                            isexpanding={open && currentCard?._id == item._id}
                            hidden={hidden}
                          />
                        </div>
                      </motion.div>
                    );
                  })
                  .reverse()
              ) : (
                <div>
                  <DummyCard
                    openfn={() => {
                      setOpenmodal(true);
                    }}
                  />
                </div>
              )}
              {open && currentCard && (
                <div>
                  <motion.div
                    className="fixed inset-0 drop-shadow-blue-500/20 flex items-center justify-center"
                    onClick={closeOpen}
                    initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                    animate={{ backdropFilter: "blur(7px)", opacity: 1 }}
                    exit={{
                      backdropFilter: "blur(0px)",
                      opacity: 0,
                      transition: {
                        duration: 0.3,
                        ease: "easeInOut",
                      },
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <CardContext.Provider value={{ open, setOpen }}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className={open && `z-999`}
                      >
                        <MainBigCard
                          key={currentCard?._id}
                          id={currentCard?._id}
                          variant={currentCard?.contenttype}
                          title={currentCard?.title}
                          link={currentCard?.link}
                          tags={currentCard?.tags}
                          summary={currentCard?.summary}
                          summaryStatus={currentCard?.summaryStatus}
                          note={currentCard?.note}
                          hidden={hidden}
                        />
                      </div>
                    </CardContext.Provider>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
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
    </motion.div>
  );
}
