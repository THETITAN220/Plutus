// export  default async function asr(audioBlob: Blob) {

// const formData = new FormData();
// formData.append("file", audioBlob, "audio.wav");

// try {
//   const response = await fetch("api/sarvam", {
//     method: "POST",
//     body: formData,
//   });
  
//   if (!response.ok) throw new Error("Transcription failed");
  
//   const data = await response.json();   
//   console.log(data);
// }
// catch(error)
// {
//     return error;
// }
// }