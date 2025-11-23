
const APP = {
  key:"cashgo_data",
  init(){
    let d = localStorage.getItem(this.key);
    if(d){ this.data = JSON.parse(d); }
    else{ this.data = {username:"User", points:0}; this.save(); }
    this.render();
  },
  save(){ localStorage.setItem(this.key, JSON.stringify(this.data)); },
  add(n){
    this.data.points += n;
    this.save();
    alert("Hai guadagnato +"+n+" punti!");
    this.render();
  },
  render(){
    document.getElementById("app").innerHTML = `
      <div class='card'>
        <h2>Ciao, ${this.data.username}</h2>
        <p>Punti: <b>${this.data.points}</b></p>
      </div>
      <div class='card'>
        <a class='btn' href='#' onclick='APP.add(20)'>Guarda video (+20)</a>
      </div>
    `;
  }
};
window.onload = ()=>APP.init();
