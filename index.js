import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import passport from "passport";
import pg from "pg";
import env from "dotenv";
import bcrypt, { compare } from "bcrypt";

env.config();


const app = express();
const port = 3000;
const slatRounds=10;
// const db = new pg.Client({
//     user: "postgres",
//     database: "IIIT-B Site",
//     host : "localhost",
//     password : process.env.dbPassword,
//     port: 5432
// });
// db.connect();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.render("index.ejs");
});
app.get("/academic", (req, res)=>{
    res.render("academic.ejs", {eceurls : eceUrls, cseUrls : cesUrls, itUrls : itUrls});
});
app.get("/map", (req, res)=>{
    res.render("map.ejs", {positions : position});
});
app.get("/resources", (req, res)=>{
    res.render("academic.ejs", {resour : 1});
});
app.get("/login", (req, res)=>{
    res.render("login.ejs");

});
app.get("/test", (req, res)=>{
    res.render("signupSuccess.ejs");
});
app.get("/contact", (req, res)=>{
    res.render("contact.ejs");
});
app.get("/errorPage", (req, res)=>{
    res.render("errorPage.ejs");
});
app.get("*", (req, res)=>{
    res.status(404).render("errorPage.ejs");
});


app.post("/downloadSyllabus", (req, res)=>{
    console.log(req.body);
    setTimeout(()=>{
        res.redirect("/academic");
    }, 100);

});
app.post("/downloadResources", (req, res)=>{
    console.log(req.body);
    setTimeout(()=>{
        res.redirect("/resources");
    }, 100);

});
app.post("*", (req, res)=>{
    res.render("errorPage.ejs");
})
// app.post("/checkLogin",async (req, res)=>{
//     console.log(req.body);
//     const data = await db.query("select password from users where username = $1", [req.body.username]);
//     if(data.rows.length > 0){
//         const hashed = data.rows[0].password;
//         const check = bcrypt.compareSync(req.body.password, hashed);
//         if(check)
//             res.render("secret.ejs");
//         else
//             res.render("login.ejs", {loginPasswordAlert : "Incorrect Password"})
//     }else{
//         res.render("login.ejs", {loginUsernameAlert : "Username not found"})
//     }
    
    

// });
// app.post("/register", async (req, res)=>{
//     console.log(req.body);
//     console.log(req.body.passwordReg);
//     const check = await db.query("select * from users where username = $1", [req.body.usernameReg]);
//     if(check.rows.length > 0)
//         res.render("login.ejs", {signup : 1, signUpAlert : "User already exists",name : req.body.name})
//     else
//         bcrypt.hash(req.body.passwordReg, slatRounds,async (err, hash)=> {
//             if(err)
//                 console.log(err);
//             else
//                 console.log(hash);
//                 const data =await db.query("insert into users values(default, $1, $2) returning id;", [req.body.usernameReg, hash]);
//                 const id = data.rows[0].id;
//                 db.query("insert into userdetails(id, fName) values($1, $2)", [id, req.body.name]);
//                 res.redirect("/signupSuccess.ejs");
//         });
    
// });


app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})










// here are the static datas
const position =[
    {lat : 23.222269, lon : 77.404709},
    {lat : 23.22313, lon : 77.40673}
]


const eceUrls =[
    "https://drive.usercontent.google.com/u/0/uc?id=1BJlcThazPReMBmJ2M6traE0SSiikWlA7&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1H4eY3pD2B8_-dhcRLRw-neXYfrRI_1yw&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1pVaiUcpu_NnKo9tbr0s9Hv04kuFimoMX&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1xz-fS_COYKWrsccwsur8cOFEP8YJq0tY&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1iM35u7wWDHDRIl77HvUy7famhWNOynG4&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=18TwfBlZH_1ydhpYW0KymOoTi4jNkCGM9&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1xiajrxlzWFbe2HU_SetV6KaWyX2OYvY9&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1T3kFQUA92qujtR2kTKH03KBVQDLaEZVi&export=download",

]
const cesUrls = [
    "https://drive.usercontent.google.com/u/0/uc?id=17swVC93YhmlNNDS0UYD_0HV44EcekuH3&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1nZH00hADsHIf7uFfOdUJWTJM29B84vta&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1m6kmQe0R7NRHZvgwtZkvW1yn5ZKL9sig&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1Lsu9WJnhTwyDUTVkQe1VgWW9w88LWtyE&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1wRYN-9zBwZBKbOdRiP2oepuB0DRhtxrO&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=18IHJgpUCqmWTjcd3mfzEA8UuVG13MLO7&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1AeTQpCWdvoh1OixQLBmG4RzPpRUwi8_U&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=12aYTyIxIQHRu1EBXzGXrBX1SfugZYOfI&export=download",
];
const itUrls = [
    "https://drive.usercontent.google.com/u/0/uc?id=1y0Obbet5VSfQZG8Xf87imExVkZCkocTs&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1zqvs64H-NBj5R85vdrJ-rqLWWJt6L23a&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1FudP238GdpTAmODpOAocTxDIhoCGVdn6&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1fq-yQ7AO98y0cPVmidUlSLacDLTN6gf_&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1y-YgGkIHNmoLGu59rtKLt0sJa3-scCmp&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1LUG6U3Fuv1mNW77UNjREwy0hoCnbL2m5&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1--XUeM7j4sr4oGA261p8fhG9jQ5C76qO&export=download",
    "https://drive.usercontent.google.com/u/0/uc?id=1okQv03Em8eqfWDPegsM-sfh7L7efiq5U&export=download",
]