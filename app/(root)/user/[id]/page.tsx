import { Suspense } from "react";
import { notFound } from "next/navigation";

import {
  AUTHOR_BY_ID_QUERY,
  IDEAS_BY_AUTHOR_QUERY,
} from "@/sanity/lib/queries";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import StartupCard, { Fallback } from "@/components/StartupCard";

async function Page({ params }: { params: { id: string } }) {
  const session = auth();

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, {
    id: params.id,
  });
  if (!user) return notFound();

  const posts = await client.fetch(IDEAS_BY_AUTHOR_QUERY, {
    id: params.id,
  });

  return (
    <>
      <section className="w-full pb-10 pt-20 px-6 max-w-7xl mx-auto lg:flex-row flex-col flex gap-10">
        <div className="w-80 px-6 pb-6 pt-20 flex flex-col justify-center items-center bg-primary border-[5px] border-black shadow-100 rounded-[30px] relative z-0 h-fit max-lg:w-full">
          <div className="w-11/12 bg-white border-[5px] border-black rounded-[20px] px-5 py-3 absolute -top-9 after:absolute after:content-[''] after:-top-1 after:right-0 after:-skew-y-6 after:bg-black after:-z-[1]  after:rounded-[20px] after:w-full after:h-[60px]  before:absolute before:content-[''] before:-bottom-1 before:left-0  before:-skew-y-6 before:w-full before:h-[60px] before:bg-black  before:-z-[1]   before:rounded-[20px] shadow-100">
            <h3 className="text-[24px] font-black uppercase text-center">
              {user.name}
            </h3>
          </div>

          <img
            src={user.image}
            alt="user_image"
            className="size-[220px] rounded-full object-cover border-[3px] border-black"
          />
          <p className="text-[30px] font-extrabold mt-7 text-white text-center">
            @{user?.username}
          </p>
          <p className="mt-1 font-normal text-sm text-center text-white-100/80">
            {user?.bio}
          </p>
        </div>

        <ul className="flex-1 grid sm:grid-cols-2 gap-5">
          {posts.length > 0 ? (
            <Suspense fallback={<Fallback />}>
              {posts.map((post) => (
                <StartupCard key={post._id} post={post} />
              ))}
            </Suspense>
          ) : (
            <p className="font-semibold text-black-100">No posts yet</p>
          )}
        </ul>
      </section>
    </>
  );
}

export default Page;