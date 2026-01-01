const url =import.meta.env.VITE_SUPABASE_URL
const key =import.meta.env.VITE_SUPABASE_KEY

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(url,key)

export default function uploadFile(file){
    const promis = new Promise(
        (resolve,reject)=>{
            if(file==null){
                reject("Please select a file to upload")
                return
            }

            const timeStamp = new Date().getTime()
            const fileName = timeStamp+"-"+file.name 

            supabase.storage.from("userpic").upload(fileName,file,{
                cacheControl: "3600",
                upsert: false
            }).then(
                ()=>{
                    const publicUrl = supabase.storage.from("userpic").getPublicUrl(fileName).data.publicUrl
                    //console.log("file public url:",publicUrl)
                    resolve(publicUrl)
                }
            ).catch(
                ()=>{
                    //console.error("Error uploading file",error)
                    reject("Failed to upload file")
                }
            )

        }
    )
    return promis
}