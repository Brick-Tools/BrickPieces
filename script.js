window.onload = function() {
  cardCount = 0
  // getPieces(cardCount)
  // getRowCount()
  getPieces()
}

const supabaseUrl = 'https://jbqrtvchsaonsmpwsjcb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpicXJ0dmNoc2FvbnNtcHdzamNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcwNjg4MTQsImV4cCI6MjA0MjY0NDgxNH0.KGIZTN_Dm1Z_8G_uMnUCto-7eVLDH0IgUaG8oUwMwu8';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

pieces = []
// piecesList = []
async function getPieces() {
  // load first 20 to make loading time feel quicker
  const { data: response0, error0 } = await supabaseClient
    .from("brickPiecesStart")
    .select("*")
    console.log("db response0:", response0)
      // cardCount +=20
      if (error0) {
        console.error("Error fetching db data:", error)
      }
      response0.forEach(part => {
        pieces.push(part)
      })

      makeCards(pieces)


  // load all remaining pieces
  const { data: response, error } = await supabaseClient
  .from("brickPiecesRemain")
  .select("*")
  
  console.log("db response:", response)
    
  
    if (error) {
      console.error("Error fetching db data:", error)
    }
    response.forEach(part => {
      pieces.push(part)
      // console.log(part["part"]);
      
      // piecesList[part["part"]]={"year":part["latest_year"], "img":`piecesNew\\${part["part"]}.webp`, "altIDs":[], "categories":[], "names":[]}
    })
  
    // // pieces = response
    // // console.log("pieces:", pieces)


    makeCards(pieces)
    
    return 0
}


function makeCards(pieces) {
  document.getElementById("cards").innerHTML = "";
  const container = document.getElementById('cards');
  pieces.forEach(key =>  {    
    url = `https://jbqrtvchsaonsmpwsjcb.supabase.co/storage/v1/object/public/brickPiecesImages/${key["part"]}.webp`
    const card = document.createElement('div');
        card.className = 'card';

        if (key["latest_year"] != 2025) {
          card.className = 'card retired';
        }
        card.id=key["part"]
  
        const img = document.createElement('img');
        // img.width = "1080"
        // img.height = "1080"
        img.src = url;
        img.alt = '';
  
        const info = document.createElement('div');
        info.classList.add("info")
        const title = document.createElement('h1');
        const subTitle = document.createElement('h1');
        subTitle.className = "copy"
        const details = document.createElement('details')
        const summary = document.createElement('summary')
        const addInput = document.createElement('input');
        addInput.type="text";
        addInput.placeholder = "Suggest a name or category"
        addInput.addEventListener("keypress", function(event) {
          if (event.key === 'Enter') {
            console.log(this.parentElement.parentElement)
            data = {
              "element": this.parentElement.parentElement.id,
              "name": this.value
            }
            appendRow( "brickPieces", data)
            this.value=""
          }
        })

        id = key["part"]
        
        if (key["names"] == null) { partName = id }
        else {partName = key["names"][0]}

        title.title = partName
        subTitle.innerText = id
        subTitle.title = "Click to copy"

        // copy part ID on click
        subTitle.addEventListener("click", function () {
          navigator.clipboard.writeText(this.innerText);        
        })
  
        const link = document.createElement('a');
        link.textContent = partName
        // console.log(id);
        
        link.href = `https://rebrickable.com/parts/${id}`
        link.target = "_blank"
        title.appendChild(link)
        info.appendChild(title)
        // info.appendChild(add)
        info.appendChild(subTitle)
  
        // MARK: details
        summary.innerText="Full Details"
        // details.innerText="details"
        details.appendChild(Object.assign(document.createElement("hr")));
        details.appendChild(Object.assign(document.createElement("p"), { innerText: `Part ID: ${key["part"]}` }));
        details.appendChild(Object.assign(document.createElement("p"), { innerText: `Latest Year Produced: ${key["latest_year"]}` }));
        details.appendChild(Object.assign(document.createElement("p"), { innerText: "Names:" }));
        namesList = document.createElement("ul")
        key["names"].forEach( name => { namesList.appendChild(Object.assign(document.createElement("li"), { innerText: name })); })
        details.appendChild(namesList)

        details.appendChild(summary)

        info.appendChild(addInput); //
        info.appendChild(details)

        card.appendChild(img);
        card.appendChild(info); //
      //   card.appendChild(link);
        container.appendChild(card);
  });  
}

// adding rows to db
async function appendRow(table, data) {
  // console.log(`Added to table "${table}":`, data)
  // message = `Submitted name "${data["name"]}" for ${data["element"]} for review`
  // toast(message)
  // return

  const { error } = await supabaseClient
  .from('pending')
  .insert({ table: table, data:data })
  if (error) {
    console.error('Error fetching data:', error);
  } else {
    message = `Submitted name "${data["name"]}" for ${data["element"]} for review`
    console.log(message)
    toast(message)
  }
}
function toast(msg, duration = 4000) {
  console.log("toast:", msg);
  const t = Object.assign(document.createElement("div"), {
    textContent: msg,
    style: `
      position: fixed; top: 20px; left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8); color: #fff;
      padding: 8px 16px; border-radius: 8px;
      font-size: 14px; z-index: 9999;
      opacity: 1; transition: opacity 0.5s;
    `
  });
  document.body.appendChild(t);
  setTimeout(() => (t.style.opacity = 0), duration);
  setTimeout(() => t.remove(), duration + 500);
}


search = ""
document.getElementById("search").addEventListener("input", function(event) {
  search = event.target.value;
  filter();
})

function checkMatch(string, searchTerm, searchWhole) {
  // console.log(searchWhole, searchTerm, string);
  if( searchWhole ) {boundaryRegex = new RegExp(`\\b${searchTerm}\\b`, "i")}
  else {boundaryRegex = new RegExp(`\\b${searchTerm}`, "i")}

  return boundaryRegex.test(string);
}

function filter() {
  searchWhole = false
  if (search.slice(-1) == ' ') {
    searchWhole = true
  }
  search = search.toLowerCase().trim()
  // filterResults = {}
  filterResults = []


  pieces.forEach( part => {
    piece = part["part"]
    
    if (piece.includes(search)) {
      if(!filterResults.some(d => d["part"] === piece)) {
        // console.log("add:", piece);        
       filterResults.push(part)
      }
    };

    
    part.names.forEach( name => {
      name = name.toLowerCase().trim();
      if (checkMatch(name, search, searchWhole)) {
        if(!filterResults.some(d => d["part"] === piece)) {
        filterResults.push(part)
        }
      }
    })
    
    // piece["altIDs"].forEach(altID => {
    //   if (altID.includes(search)) {
    //     // console.log("altID", altID)
    //     if(filterResults[part]==undefined) {filterResults[part] = piece}
    //   }});

    // piece["categories"].forEach(category => {
    //   if (category.includes(search)) {
    //     // console.log("category", category)
    //     if(filterResults[part]==undefined) {filterResults[part] = piece}
    //   }});      
    })
    // console.log(filterResults);
    makeCards(filterResults)
}



