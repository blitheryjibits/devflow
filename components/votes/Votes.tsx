"use client"
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface Params {
    upvotes: number;
    downvotes: number;
    hasupVoted: boolean;
    hasdownVoted: boolean;
}

export const Votes = ({upvotes, downvotes, hasupVoted, hasdownVoted}: Params) => {
    const [isLoading, setIsLoading] = useState(false);

    const session = useSession()
    const userId  = session?.data?.user?.id;
    
    const handleVote = async (voteType: "upvote" | "downvote") => {
        if (!userId) return toast.error("Please login to vote");

        setIsLoading(true);
        try {
            const successMessage = voteType === "upvote"
                ? `Upvote ${!hasupVoted ? 'added' : 'removed'} successfully`
                : `Downvote ${!hasdownVoted ? 'added' : 'removed'} successfully`

            toast.success("Your vote has been recorded")
        } catch (error) {
            toast.error("An error occured while trying to vote")
            
        } finally {
            setIsLoading(false);
        }
    }

    return <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
            <Image 
                src={hasupVoted ? "icons/upvoted.svg" : "icons/upvote.svg"}
                width={18}
                height={18}
                alt="upvote"
                className={`cursor-pointer ${isLoading && 'opacity-50'}`}
                aria-label="upvote"
                onClick={() => !isLoading && handleVote('upvote')}
            />
            <div className="flex-center background-light700_dark400 min-w-5 p-1 rounded-sm">
                <p className="subtle-medium text-dark400_light900">
                    {formatNumber(upvotes)}</p>
            </div>
        </div>
<div className="flex-center gap-1.5">
            <Image 
                src={hasdownVoted ? "icons/downvoted.svg" : "icons/downvote.svg"}
                width={18}
                height={18}
                alt="upvote"
                className={`cursor-pointer ${isLoading && 'opacity-50'}`}
                aria-label="upvote"
                onClick={() => !isLoading && handleVote('downvote')}
            />
            <div className="flex-center background-light700_dark400 min-w-5 p-1 rounded-sm">
                <p className="subtle-medium text-dark400_light900">
                    {formatNumber(downvotes)}</p>
            </div>
        </div>
    </div>
}