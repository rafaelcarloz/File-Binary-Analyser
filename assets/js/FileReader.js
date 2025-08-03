let DATA_Binary = null;

$("#FileOpener").change(async function(){
    if (this.files.length <= 0){
        return;
    }

    let currentFile = this.files[0];

    const binary = await getBinaryFromFile(currentFile);

    DATA_Binary = new Uint8Array(binary);

    DisplayData(DATA_Binary);
});


function formatHexadecimal(number, length = 2){
    return number.toString(16).padStart(length, "0");
}


async function getBinaryFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result))
      reader.addEventListener('error', (err) => reject(err))
      reader.readAsArrayBuffer(file)
    })
}

let lineNumber = 0;

async function DisplayData(dataArray){
    lineNumber = 0;

    let counter = 0;

    console.log(dataArray);

    while(counter < dataArray.byteLength){
        let offset = formatHexadecimal(lineNumber*16, 8);

        let binaryHex = formatHexadecimal(dataArray[counter]);
        let ascii = String.fromCharCode(dataArray[counter]);

        for(let i = 1; i < 16; i++){
            let addr = counter + i;

            let dataByte = dataArray[addr];

            binaryHex += ` <span data-address="${addr}">${formatHexadecimal(dataByte)}</span>`;
            ascii += ` ${String.fromCharCode(dataByte)}`;
        }

        DisplayRow(offset, binaryHex, ascii);

        counter+=16;
        lineNumber++;
    }
}

async function DisplayRow(offset, binaryHex, ascii){
    console.log("DisplayRow", lineNumber)

    $("#FileViewerContainer").append(`
        <div id="line_${lineNumber}" style="top: 3.6rem;">
            <pre class="offset unselectable pe-2">${offset}</pre>
            <pre class="hex">${binaryHex}</pre>
            <pre class="chr unselectable">${ascii}</pre>
        </div>
    `);
}

