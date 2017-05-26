/*
	@summary A simple JavaScript file for Adobe Acrobat Pro which automatically converts commented text into redactions and saves a copy
	@author Jack W. Davis <github@jackwdavis.com>
	@website www.jackwdavis.com
	@version 1.0.0
*/

/* Add new menu item to Acrobat */
function init() {
	app.addSubMenu({
		cName: "Redaction Tools",
		cParent: "Edit",
		nPos: 0
	});

	app.addMenuItem({
		cName: "Auto Redaction",
		cParent: "Redaction Tools",
		cPos: 1,
		cExec: "redactionHelper()"
	});
}

/* Redaction Tool function & helpers */
function redactionHelper(){
	
	var confirmation = redactionConfirm();
	if(confirmation == 4){
		app.alert("The document will now be redacted, please don't close Adobe Acrobat while this is running.", 3);
		searchRedactedText();
	} else {
		app.alert("Successfully cancelled, no redactions have been made.");
	}
	
}

function redactionConfirm(){
	return app.alert("This will automatically redact all commented text in the document, do you want to continue?", 2, 2);
}

function searchRedactedText(){
		
	this.syncAnnotScan()
	var annots = this.getAnnots();
	
	if(annots){
		app.alert(annots.length + " Annotations found");
		markForRedaction(annots);
	} else {
		app.alert("No Annotations found");
	}

}

function markForRedaction(annotations){
	
	/* Convert all comments into marks for redaction */
	for(var i = 0; i < annotations.length; i++){
		annotations[i].type = "Redact";
		annotations[i].fillColor = color.black;
	}
	
	/* Commit the redactions */
	this.applyRedactions({
		bKeepMarks: true,
		bShowConfirmation: false
	});
	
	/* Flatten the PDF to remove hidden references to the data */
	this.flattenPages();
	
	savePdfAs();
	
}

function savePdfAs(){	
	app.execMenuItem("SaveAs");
}


/* Initiate */
init();