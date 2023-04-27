console.log("Searching...");

const runSearch= (searchText) => {
	// console.log(inputNode);
	if(!searchText) return Promise.reject("Search query must not be empty");
	
	return fetch("http://localhost:3000/api/generate", {
		method: "POST",
		body: searchText,
	})
	.then((res) => res.json());
};

const findSearchBox= () => {
	return document.querySelector("textarea[type=search]");
};

const renderResults= result => {
	const appbar= document.getElementById("appbar");
	// console.log(appbar);
	if(!appbar) return console.log("Could not attach results");

	appbar.style.position= "relative";

	const resultNode= document.createElement("pre");
	// console.log(resultNode);
	Object.entries({
		"position": "absolute",
		"top": "50px",
		"right": "50px",
		"width": "500px",
		"background-color": "#171819",
		"z-index": "1",
		"white-space": "pre-line",
		"color": "#c8d0e0",
		"padding": "20px 30px",
		"border-radius": "5px",
	}).forEach(([key, value]) => {
		resultNode.style[key]= value;
	});
	resultNode.innerHTML= result.trim();
	appbar.appendChild(resultNode);
};

runSearch(findSearchBox()?.value)
.then(data => {
	renderResults(data.result);
})
.catch((err) => {
	console.log(err);
});
