import { Button } from "../components/Button";
import { Createcontenmodal } from "../components/createcontentmodal";
import { Addicon } from "../icons/addicon";
import { Shareicon } from "../icons/shareicone";
import { useState } from "react";
import { Searchbar } from "../components/searchbar";
import { useGetCards } from "../hooks/getcards";
import { AnimatePresence, motion } from "motion/react";
import { MainSmallCard } from "../components/mainsmallcard";
import { MainBigCard } from "../components/mainbigcard";
import { CardContext } from "../contexts/CardContext";
import { DummyCard } from "../components/skeletons/dummycard";
import { LoaderCircle } from "../icons/loader";
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
  const [openmodal, setOpenmodal] = useState(false);
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } = useGetCards();
  const [currentCard, setCurrentCard] = useState<cardprops | null>(null);
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-background">
        <div className="mx-auto w-[90%]">
          <div className="flex items-center justify-end pt-2 gap-4">
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
          <div className="h-full mx-auto my-auto flex items-center justify-center pt-30">
            <span className="inline-block w-20 h-20 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }
  if (isError) {
    return <div>{error.message}</div>;
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
        <div className="flex items-center justify-center lg:justify-end pt-2 gap-4">
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
        <motion.div
          variants={parentVariant}
          initial="closed"
          animate={data.length ? "open" : "closed"}
          className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-4 md:gap-y-4 lg:grid-cols-3 mx-auto max-w-full p-4"
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
            {open && (
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
                      />
                    </div>
                  </CardContext.Provider>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
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
