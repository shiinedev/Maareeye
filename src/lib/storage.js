
import { v4 } from "uuid";
import supabase from "./supabase";
export const uploadImage = async (file,userId,bucket)=>{

    try {
        const fileEx = file.name.split(".").pop();
        const fileName = `${v4()}.${fileEx}`;
        const filepath = `${fileName}`;

        console.log(filepath);
        
        const {data,error} = await supabase.storage
        .from(bucket)
        .upload(filepath,file,{
             cacheControl:"3600",
            contentType:file.type,
            upsert:true
        });

        if(error) throw error;

        const {data:imageUrl} =  supabase.storage
        .from(bucket)
        .getPublicUrl(filepath);

        return{
            imageUrl:imageUrl.publicUrl,
            path:filepath
        }
    } catch (error) {
        console.log("error uploading image");
        throw error;
    }
        
    

}