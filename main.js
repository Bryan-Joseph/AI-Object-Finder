Status = false;
isFound = false;
var input = "";
// start = false;

function preload() {
    
}

function setup() {
    canv = createCanvas(400,300);
    canv.parent("canvHolder");

    cam = createCapture(VIDEO);
    cam.size(400,300);
    cam.hide();    
}

document.getElementById('startB').addEventListener('click',()=>{
    Status = false;
    input = document.getElementById('objectI').value;
    if (input != "") {
        objectDetector = ml5.objectDetector('cocossd', ()=>{
            console.log('model loaded');
            document.getElementById('statusP').innerHTML = 'Detecting objects';
            Status = true;
        });
    }
});

function draw() {
    image(cam,0,0,400,300);

    if (Status) {
        objectDetector.detect(cam,(error,result)=>{
            isFound = false;
            if (error) {
                console.error(error);
            }else{
                for (let i = 0; i < result.length; i++) {
                    const results = result[i];
                    
                    x = results.normalized.x * 400;
                    y = results.normalized.y * 300;
                    width = results.normalized.width * 400;
                    height = results.normalized.height * 300;

                    percentage = Math.round(results.confidence * 100);

                    fill(255,0,0);
                    text(`${results.label} ${percentage}%`,x + 10,y+ 20);
                    noFill();
                    stroke(255,0,0);
                    rect(x,y,width,height);

                    if (results.label == input) {
                        isFound =true;
                    }
                }

                if (isFound && Status) {
                    document.getElementById('resultP').innerHTML = `${input} is found`;
                }else if (!isFound && Status) {
                    document.getElementById('resultP').innerHTML = `${input} is not found`;
                }else {
                    document.getElementById('resultP').innerHTML = "";
                }
            }
        });
    }
}