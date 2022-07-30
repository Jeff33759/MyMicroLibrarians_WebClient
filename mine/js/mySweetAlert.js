const gDEFAULT = 0, gSUCCESS = 1, gERROR = 2, gCONFIRM = 3 , gINFO = 4;

function showSweetAlert(mode,titleStr,msg,callback,callbackParam){
	let iconStyle;
	let titleName = titleStr == undefined ? "" : titleStr;
	let message = msg == undefined ? "" : msg;
	let cancelBtn = false;

	switch (mode) { 
		case gDEFAULT: {
			iconStyle = "";
			break;
		}
		case gSUCCESS: {
			iconStyle = "success";
			break;
		}
		case gERROR: {
			iconStyle = "error";
			break;
		}
		case gCONFIRM: {
			iconStyle = "question";
			cancelBtn = true;
			break;
		}
		case gINFO: {
			iconStyle = "info";
			break;
		}
	}

	Swal.fire({
		title: titleName,
		html: `<div>${message}</div>`,
		icon: iconStyle,
		confirmButtonColor: '#3085d6', 
		confirmButtonText:'OK',
		reverseButtons:true,
		cancelButtonColor: '#d33',
		cancelButtonText:'No',
		showCancelButton: cancelBtn
	}).then((result) => {
		if (result.isConfirmed) {
			if(callback==undefined){
				return false;
			}else{
				if(callbackParam == undefined){
					callback();
				}else{
					callback(callbackParam);
				}
			}
		} 
	})
}

function genResStatusAlertTemplate(statusCode,cause){
	if(cause==undefined){
		return `Status code: <b>${statusCode}</b>`;
	}
	return `Status code: <b>${statusCode}</b><br>Cause: <b>${cause}</b>`;
}