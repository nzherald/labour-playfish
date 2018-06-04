import "./loading.less"
import HTML from "./loading.html"
if (localStorage.getItem("loading") === "done") {
    console.log("Loading screen is too late to be useful.")
}
else {
    console.log("Loading screen created.")
    let doc = new DOMParser().parseFromString(HTML, "text/html")
    document.body.appendChild(doc.firstChild)
}
