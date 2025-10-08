import { resendClient, sender } from "../src/lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  //console.log("here 1.1")
  try {
     const {data,error} =  await resendClient.emails.send({
  from:`${sender.name} <${sender.email}>`,
  to:email,
  subject:"Welcome to chatify!",
  html:createWelcomeEmailTemplate(name,clientURL)
 });
 //console.log("here 1.2")
  if(error){
    console.error("Error", error);
    return error;
 }
 // console.log("here 1.3")
  console.log("welcome email sent successfully:", data);
 return data;

  } catch (error) {
    console.error("Error in sendWelcomeEmail function:", error);
  }

 if(error){
  console.error("Error sending welcome email:", error);
  throw new Error("Failed to send welcome email",error);
 }
//  console.log("welcome email sent successfully:", data);
 
};