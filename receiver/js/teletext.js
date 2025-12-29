const PAGES = {
  120: `120  NOTICIAS
-------------------------
Hoy en el centro
Radio en directo`
};

function handleCommand(cmd) {
  if (cmd.startsWith("P")) {
    const page = cmd.slice(1);
    document.getElementById("screen").innerText =
      PAGES[page] || "Página no disponible";
  }
}
