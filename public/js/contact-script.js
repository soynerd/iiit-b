var btn = document.querySelectorAll(".w-button");
var temp = "";
btn.forEach(button =>{
    button.addEventListener('click', (event)=>{
        if(temp)
        document.querySelector("."+temp).style.display="none";
        const btn_clicked = event.target.classList[0];
        switch (btn_clicked) {
            case 'president-btn':
                document.querySelector(".president").style.display="block";
                // temp=".president";
                break;
            case 'vice-pres-btn':
                document.querySelector(".vice-president").style.display="block";
                break;
            case 'general-sec-btn':
                document.querySelector(".general-secretary").style.display="block";
                break;
            case 'secretary-cult-btn':
                document.querySelector(".secretary-cultural").style.display="block";
                break;
            case 'secretary-sport-btn':
                document.querySelector(".secretary-sports").style.display="block";
                break;
            case 'secretay-tech-btn':
                document.querySelector(".secretary-technical").style.display="block";
                break;
            case 'secretary-lit-btn':
                document.querySelector(".secretary-literacy").style.display="block";
                break;
            case 'secretary-treasure-btn':
                document.querySelector(".secretary-treasurer").style.display="block";
                break;
            case 'secretary-alumini-btn':
                document.querySelector(".secretary-alumini").style.display="block";
                break;
        
            default:
                break;
        }
        temp=btn_clicked;


    })
})