'use client'
import { useState, useEffect} from "react";
import Card from "@/app/components/applicationCard";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Error from "next/error";
import http from "@/app/utils/http";
const Applications = () => {
    const router = useRouter();
    const path = usePathname();
    const [applications, setApplications] = useState<any>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<number>(200);
    let refreshToken: any;
    let accessToken: any;
    if (typeof window !== 'undefined') {
        // Perform localStorage action
        refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken){
             router.push("/login");
        }
        accessToken = localStorage.getItem('accessToken')
    }
    useEffect(() => {
        getPosts()
        async function getPosts() {
            try{
                const data  = await http.getWithAutoRefreshToken(`/api/recruiterApplication/getPendingApplications/${path.split('/').pop()}`, {useAccessToken: true})
                setApplications([...data.data]);
                setLoading(false);
            }
            catch(e:any){
                setError(e.response.status)
            }
        }
    }, [path]);
    if (error != 200){
        return(
            <>
                <Error statusCode={error} />
            </>
        )
    }
    if (isLoading){
        return (
            <>
                <div className="text-center h-screen">
                    <h1 className="text-3xl text-gray-800 font-semibold">
                        Loading...
                    </h1>
                </div>
            </>
        )
    }
    return (
        <>
        {!(applications!=null && applications.length==0) ||
            <div className="text-center h-screen">
                <h1 className="text-3xl text-gray-800 font-semibold">
                        Pending Applications
                </h1>
                    <p className="mt-3 text-gray-500">
                        No Pending Applications
                    </p>
                </div>
        }
            {!(applications != null && applications.length) || 
                <Card applications={applications} href={`/pendingApplications/detail/`} title={"Pending Applications"}></Card>
        }
        </>
    )
}
export default Applications