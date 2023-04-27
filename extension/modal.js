console.log("Attaching keydown event...");

let isModalOpen= false;

const renderModalResults= () => {
	const submitButton= document.getElementById("gpt_extension_submit");
	if(submitButton) submitButton.innerText= "checking...";
	
	runSearch(document.getElementById("gpt_extension_search")?.value)
	.then(data => {
		let resultNode= document.getElementById("gpt_extension_result");
		if(!resultNode)
		{
			resultNode= document.createElement("pre");
			Object.entries({
				"font-size": "18px",
				"width": "100%",
				"background-color": "#171819",
				"z-index": "1",
				"white-space": "pre-line",
				"color": "#c8d0e0",
				"box-sizing": "border-box",
				"padding": "20px 30px",
				"border-radius": "5px",
				"margin-top": "20px",
				"max-height": "50vh",
				"overflow": "auto",
			}).forEach(([key, value]) => {
				resultNode.style[key]= value;
			});
			resultNode.id= "gpt_extension_result";
		}
		resultNode.innerHTML= data.result.trim();
		document.getElementById("gpt_extension_modal")?.appendChild(resultNode);
		if(submitButton) submitButton.innerText= "Go!";
	})
	.catch((err) => {
		console.log(err);
		if(submitButton) submitButton.innerText= "Go!";
	});
};

window.addEventListener("keydown", event => {
	// console.log(event.ctrlKey, event.key);

	if(event.ctrlKey && event.key === "m")
	{
		const modalNode= document.getElementById("gpt_extension_modal");
		if(modalNode)
		{
			document.body.removeChild(modalNode);
			document.body.removeChild(document.getElementById("gpt_extension_backdrop"));
			return;
		}

		const backdrop= document.createElement("div");
		backdrop.id= "gpt_extension_backdrop";
		Object.entries({
			"position": "fixed",
			"top": "50%",
			"left": "50%",
			"transform": "translate(-50%, -50%)",
			"width": "100vw",
			"height": "100vh",
			"z-index": 1,
			"background-color": "#000000ad",
		}).forEach(([key, value]) => {
			backdrop.style[key]= value;
		});

		backdrop.addEventListener("click", event => {
			document.body.removeChild(document.getElementById("gpt_extension_modal"));
			document.body.removeChild(document.getElementById("gpt_extension_backdrop"));
		});

		const modal= document.createElement("div");
		modal.id= "gpt_extension_modal";
		Object.entries({
			"position": "fixed",
			"top": "50%",
			"left": "50%",
			"transform": "translate(-50%, -50%)",
			"width": "70vw",
			"background-color": "#333941",
			"z-index": "2",
			"box-sizing": "border-box",
			"padding": "20px 30px",
			"border-radius": "5px",
		}).forEach(([key, value]) => {
			modal.style[key]= value;
		});

		const searchBox= document.createElement("textarea");
		Object.entries({
			"font-size": "18px",
			"color": "black",
			"width": "100%",
			"border": "1px solid #10a37f",
			"background-color": "#edeff4",
			"margin-bottom": "20px",
		}).forEach(([key, value]) => {
			searchBox.style[key]= value;
		});
		Object.entries({
			"rows": 2,
			"id": "gpt_extension_search",
			"placeholder": "search"
		}).forEach(([key, value]) => {
			searchBox.setAttribute(key, value);
		});
		searchBox.addEventListener("keypress", event => {
			if(event.key === "Enter" && !event.shiftKey)
			{
				renderModalResults();
				event.preventDefault();
			}
		});

		const submitButton= document.createElement("button");
		Object.entries({
			"font-size": "18px",
			"color": "black",
			"width": "100%",
			"border": "1px solid #10a37f",
			"background-color": "#8a9fcd",
			"border": "none",
			"border-radius": "3px",
			"box-sizing": "border-box",
			"padding": "10px",
			"cursor": "pointer"
		}).forEach(([key, value]) => {
			submitButton.style[key]= value;
		});
		Object.entries({
			"id": "gpt_extension_submit",
		}).forEach(([key, value]) => {
			submitButton.setAttribute(key, value);
		});
		submitButton.addEventListener("click", renderModalResults);
		submitButton.innerText= "Go!";

		modal.appendChild(searchBox);
		modal.appendChild(submitButton);
		document.body.appendChild(backdrop);
		document.body.appendChild(modal);

		setTimeout(() => searchBox.focus(), 1000);
	}
});

