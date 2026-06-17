const nodemailer = require("nodemailer");
function json(res,status,data){res.statusCode=status;res.setHeader("Content-Type","application/json");res.setHeader("Access-Control-Allow-Origin","*");res.setHeader("Access-Control-Allow-Methods","POST, OPTIONS");res.setHeader("Access-Control-Allow-Headers","Content-Type");res.end(JSON.stringify(data));}
function safe(v,m=1200){if(v===undefined||v===null)return "";return String(v).replace(/[<>]/g,"").slice(0,m);}
module.exports=async function handler(req,res){
 if(req.method==="OPTIONS")return json(res,200,{ok:true});
 if(req.method!=="POST")return json(res,405,{ok:false,error:"Method not allowed"});
 try{
  const body=typeof req.body==="object"?req.body:JSON.parse(req.body||"{}");
  const to=process.env.NOTIFY_TO||"scbernard004@gmail.com";
  const smtpHost=process.env.SMTP_HOST, smtpPort=Number(process.env.SMTP_PORT||587), smtpUser=process.env.SMTP_USER, smtpPass=process.env.SMTP_PASS, from=process.env.NOTIFY_FROM||smtpUser;
  if(!smtpHost||!smtpUser||!smtpPass||!from)return json(res,500,{ok:false,error:"Email is not configured in Vercel Environment Variables."});
  const eventType=safe(body.eventType||"Website Notification",100), page=safe(body.page||"",400), product=safe(body.product||"",300), name=safe(body.name||"",200), phone=safe(body.phone||"",200), email=safe(body.email||"",200), message=safe(body.message||"",1500), action=safe(body.action||"",300), userAgent=safe(body.userAgent||req.headers["user-agent"]||"",500);
  const when=new Date().toLocaleString("en-GB",{timeZone:"Africa/Dar_es_Salaam"});
  const subject=`OHGS Website: ${eventType}${product?" - "+product:""}`;
  const text=["OHGS Website Notification",`Event: ${eventType}`,`Time: ${when}`,`Page: ${page}`,`Action: ${action}`,`Product: ${product}`,`Name: ${name}`,`Phone: ${phone}`,`Email: ${email}`,`Message: ${message}`,`Device: ${userAgent}`].join("\n");
  const transporter=nodemailer.createTransport({host:smtpHost,port:smtpPort,secure:smtpPort===465,auth:{user:smtpUser,pass:smtpPass}});
  await transporter.sendMail({from,to,subject,text,html:text.split("\n").map(x=>`<p>${x}</p>`).join("")});
  return json(res,200,{ok:true});
 }catch(err){return json(res,500,{ok:false,error:err.message||"Notification failed"});}
};
