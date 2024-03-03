const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "SK-965NMO7hKlvmSu7VSdETT3B1bkFJiSjp9xi4xhJDWrQkm8si";

const updateImageCard = (ImageDataArray) => {
    ImageDataArray.forEach((imgObject, index) =>{
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
       const imgElement = imgCard.querySelector("img");
       const downloadBtn =  imgCard.querySelector(".download-btn");

       const aiGeneratedImg = `data:jpeg;base64,${imgObject.b64_json} `;
        imgElement.src = aiGeneratedImg;
        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }

    });

}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations" , {
            method :  "POST", 
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size :  "512x512",
                response_fornat: "b64_json"
                })
        });

        if(!response.ok) throw new Error("yükleme hatası lütfen tekrar deneyiniz");


        const {data} = await  response.json();
        updateImageCard([...data]);
        console.log(data);
    }catch (error){
        alert(error.message);
    }
    finally{
        isImageGenerating = false;
    }
}

let isImageGenerating = false;





const handleFormSubmission = (e) => {
 e.preventDefault();
 if(isImageGenerating) return;
 isImageGenerating=true;
 const userPrompt = e.srcElement[0].value;
 const userImgQuantity = e.srcElement[1].value;

 const imgCardMarkup = Array.from({length:userImgQuantity}, () => 
   ` <div class="img-card loading">
   <img src="Feather-core-loader.svg.png"  alt="Resim Bulucu">
   <a href="#" class="download-btn">
       <img src="istockphoto-844294300-612x612.jpg"  alt="Download ıcon">
   </a>
</div>`
 ).join("");

 imageGallery.innerHTML = imgCardMarkup;
 generateAiImages(userPrompt, userImgQuantity);
}
generateForm.addEventListener("submit" , handleFormSubmission);
